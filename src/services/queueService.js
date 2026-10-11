import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  runTransaction,
  serverTimestamp,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import db from "./firebase/firestore.js";
import { INITIAL_SERVICES, DEFAULT_FACILITY_ID, QUEUE_STATUS } from "../constants/queueConstants.js";

/**
 * Dynamic in-memory queue store used strictly for client fallback/offline resilience.
 * Does NOT contain preloaded fake patients so real patient positions are never influenced.
 */
let memoryQueueStore = [];

const memoryListeners = new Set();

function notifyMemoryListeners() {
  memoryListeners.forEach((fn) => {
    try {
      fn([...memoryQueueStore]);
    } catch (e) {
      console.warn("Error in queue listener callback:", e);
    }
  });
}

/**
 * Fetch all active services for a given facility.
 * Sourced from Firestore, with fallback to Section 6 initial services if unavailable.
 */
export async function getServices(facilityId = DEFAULT_FACILITY_ID) {
  try {
    const servicesRef = collection(db, "services");
    const servicesQuery = query(
      servicesRef,
      where("facilityId", "==", facilityId),
      where("active", "==", true)
    );

    const snapshot = await getDocs(servicesQuery);

    if (!snapshot.empty) {
      const fetched = snapshot.docs.map((doc) => {
        const data = doc.data();
        let displayOrder = data.displayOrder;
        let name = data.name;
        let description = data.description;

        const code = (data.code || "").toUpperCase();
        const id = doc.id.toLowerCase().trim();

        // Assign numeric displayOrder if not already present in Firestore document
        if (typeof displayOrder !== "number") {
          if (code === "A" || id.includes("general") || id.includes("consult")) displayOrder = 1;
          else if (code === "B" || id.includes("lab")) displayOrder = 2;
          else if (code === "C" || id.includes("pharm")) displayOrder = 3;
          else if (code === "D" || id.includes("imag") || id.includes("xray")) displayOrder = 4;
          else displayOrder = 99;
        }

        // Ensure patient-facing display name is exactly "Imaging / X-ray"
        if (code === "D" || id.includes("imag") || id.includes("xray") || (name && name.trim().toLowerCase() === "imaging")) {
          name = "Imaging / X-ray";
        }

        // Standardize descriptions to match Screen 2 reference
        if (code === "A" || id.includes("general")) {
          description = "See a doctor for a general check-up or medical advice.";
        } else if (code === "B" || id.includes("lab")) {
          description = "Get your tests done quickly and safely.";
        } else if (code === "C" || id.includes("pharm")) {
          description = "Collect your prescribed medication.";
        } else if (code === "D" || id.includes("imag")) {
          description = "Get your scans and imaging services.";
        }

        return {
          id: doc.id.trim(),
          ...data,
          name: name ? name.trim() : data.name,
          description: description || data.description,
          displayOrder,
        };
      });

      return fetched.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
    }
  } catch (err) {
    console.warn("Could not fetch services from Firestore, using initial catalogue:", err);
  }

  // Fallback to documented initial services sorted by displayOrder
  return INITIAL_SERVICES.filter(
    (s) => s.facilityId === facilityId && s.active !== false
  ).sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
}

/**
 * Fetch facility details from Firestore.
 */
export async function getFacility(facilityId = DEFAULT_FACILITY_ID) {
  try {
    const facRef = doc(db, "facilities", facilityId);
    const snap = await getDoc(facRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn("Could not fetch facility from Firestore:", err);
  }

  return {
    id: facilityId,
    name: "Main Health Centre",
    location: "Lusaka",
    active: true,
  };
}

/**
 * Fetch waiting entries for a given service.
 * First queries Firestore. If Firestore rejects or is offline,
 * uses the reactive active queue store so queue positions are never lost.
 */
export async function getServiceQueue(facilityId, serviceId) {
  try {
    const queueRef = collection(db, "queueEntries");
    const queueQuery = query(
      queueRef,
      where("facilityId", "==", facilityId),
      where("serviceId", "==", serviceId),
      where("status", "==", "WAITING")
    );

    const snapshot = await getDocs(queueQuery);

    if (snapshot) {
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  } catch (err) {
    console.warn("Could not fetch service queue from Firestore:", err);
  }

  // Filter memory store for active WAITING entries matching facility and service
  return memoryQueueStore.filter(
    (e) =>
      (!facilityId || e.facilityId === facilityId) &&
      (!serviceId || e.serviceId === serviceId) &&
      e.status === (QUEUE_STATUS?.WAITING || "WAITING")
  );
}

/**
 * Create a new queue entry using Firestore transaction counter.
 */
export async function createQueueEntry({
  facilityId = DEFAULT_FACILITY_ID,
  serviceId,
  ticketPrefix = "A",
}) {
  const today = new Date().toISOString().split("T")[0];
  const counterId = `${facilityId}_${serviceId}_${today}`;
  const counterRef = doc(db, "counters", counterId);
  const queueEntryRef = doc(collection(db, "queueEntries"));

  try {
    const ticketNumber = await runTransaction(db, async (transaction) => {
      const counterSnapshot = await transaction.get(counterRef);
      let currentNumber = 1;

      if (!counterSnapshot.exists()) {
        transaction.set(counterRef, {
          nextNumber: 2,
          facilityId,
          serviceId,
          date: today,
        });
      } else {
        currentNumber = counterSnapshot.data().nextNumber || 1;
        transaction.update(counterRef, {
          nextNumber: currentNumber + 1,
        });
      }

      transaction.set(queueEntryRef, {
        ticketCode: `${ticketPrefix}${String(currentNumber).padStart(3, "0")}`,
        facilityId,
        serviceId,
        status: "WAITING",
        enteredAt: serverTimestamp(),
        entryMethod: "patient",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return currentNumber;
    });

    const newTicketCode = `${ticketPrefix}${String(ticketNumber).padStart(3, "0")}`;
    const newEntry = {
      id: queueEntryRef.id,
      entryId: queueEntryRef.id,
      ticketCode: newTicketCode,
      facilityId,
      serviceId,
      status: "WAITING",
      enteredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    memoryQueueStore.push(newEntry);
    notifyMemoryListeners();

    return newEntry;
  } catch (err) {
    console.warn("Firestore transaction failed, creating safe client entry:", err);
    // Determine sequential number based on current queue store
    const existingForService = memoryQueueStore.filter(
      (e) => e.serviceId === serviceId && (e.ticketCode || "").startsWith(ticketPrefix)
    );
    const nextSeq = existingForService.length + 1;
    const ticketCode = `${ticketPrefix}${String(nextSeq).padStart(3, "0")}`;
    const entryId = queueEntryRef.id || `local_entry_${Date.now()}`;

    const localEntry = {
      id: entryId,
      entryId,
      ticketCode,
      facilityId,
      serviceId,
      status: "WAITING",
      enteredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    memoryQueueStore.push(localEntry);
    notifyMemoryListeners();

    return localEntry;
  }
}

/**
 * Fetch a single queue entry by ID.
 */
export async function getQueueEntry(entryId) {
  try {
    const ref = doc(db, "queueEntries", entryId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn("Could not fetch queue entry from Firestore:", err);
  }

  return memoryQueueStore.find((e) => e.id === entryId || e.entryId === entryId) || null;
}

/**
 * Update a queue entry's status (e.g. WAITING -> CALLED, COMPLETED, CANCELLED).
 * Updates Firestore and notifies local listeners so real-time recalculation fires.
 */
export async function updateQueueEntryStatus(entryId, newStatus, additionalFields = {}) {
  try {
    const ref = doc(db, "queueEntries", entryId);
    await updateDoc(ref, {
      status: newStatus,
      ...additionalFields,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Could not update queue entry status in Firestore:", err);
  }

  // Update memory store and notify
  const target = memoryQueueStore.find((e) => e.id === entryId || e.entryId === entryId);
  if (target) {
    target.status = newStatus;
    Object.assign(target, additionalFields);
    target.updatedAt = new Date().toISOString();
    notifyMemoryListeners();
  }
}

/**
 * Real-time listener for a patient's active queue entry.
 */
export function subscribeToQueueEntry(entryId, onUpdate, onError) {
  if (!entryId) return () => {};

  let unsubscribeFirestore = null;
  try {
    const ref = doc(db, "queueEntries", entryId);
    unsubscribeFirestore = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          onUpdate({ id: snap.id, ...snap.data() });
        }
      },
      (err) => {
        console.warn("Firestore entry subscription error:", err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn("Could not attach Firestore entry listener:", err);
  }

  // Also hook into local memory listener for seamless status change reactivity
  const memoryHandler = (entries) => {
    const found = entries.find((e) => e.id === entryId || e.entryId === entryId);
    if (found) onUpdate(found);
  };
  memoryListeners.add(memoryHandler);

  // Send initial data if available
  const initial = memoryQueueStore.find((e) => e.id === entryId || e.entryId === entryId);
  if (initial) onUpdate(initial);

  return () => {
    if (typeof unsubscribeFirestore === "function") unsubscribeFirestore();
    memoryListeners.delete(memoryHandler);
  };
}

/**
 * Real-time listener for all waiting entries in a service.
 */
export function subscribeToServiceQueue(facilityId, serviceId, onUpdate, onError) {
  if (!facilityId || !serviceId) return () => {};

  let unsubscribeFirestore = null;
  try {
    const queueRef = collection(db, "queueEntries");
    const queueQuery = query(
      queueRef,
      where("facilityId", "==", facilityId),
      where("serviceId", "==", serviceId),
      where("status", "==", "WAITING")
    );

    unsubscribeFirestore = onSnapshot(
      queueQuery,
      (snapshot) => {
        if (snapshot) {
          const entries = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          onUpdate(entries);
        }
      },
      (err) => {
        console.warn("Firestore service queue subscription error:", err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn("Could not attach Firestore service queue listener:", err);
  }

  // Local listener for real-time reactivity
  const memoryHandler = (allEntries) => {
    const filtered = allEntries.filter(
      (e) =>
        (!facilityId || e.facilityId === facilityId) &&
        (!serviceId || e.serviceId === serviceId) &&
        e.status === "WAITING"
    );
    onUpdate(filtered);
  };
  memoryListeners.add(memoryHandler);

  // Send initial waiting entries
  const initialWaiting = memoryQueueStore.filter(
    (e) =>
      (!facilityId || e.facilityId === facilityId) &&
      (!serviceId || e.serviceId === serviceId) &&
      e.status === "WAITING"
  );
  onUpdate(initialWaiting);

  return () => {
    if (typeof unsubscribeFirestore === "function") unsubscribeFirestore();
    memoryListeners.delete(memoryHandler);
  };
}
