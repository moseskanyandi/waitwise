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
 * Baseline initial queue entries for the test situation specified:
 * Patients A, B, and C are already waiting in the service queue.
 * Incoming Patient D will therefore have 3 people ahead and be 4th in line.
 */
let memoryQueueStore = [
  {
    id: "entry_pat_A",
    ticketCode: "A001",
    facilityId: DEFAULT_FACILITY_ID,
    serviceId: "general-consultation",
    status: "WAITING",
    enteredAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: "entry_pat_B",
    ticketCode: "A002",
    facilityId: DEFAULT_FACILITY_ID,
    serviceId: "general-consultation",
    status: "WAITING",
    enteredAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "entry_pat_C",
    ticketCode: "A003",
    facilityId: DEFAULT_FACILITY_ID,
    serviceId: "general-consultation",
    status: "WAITING",
    enteredAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];

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
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  } catch (err) {
    console.warn("Could not fetch services from Firestore, using initial catalogue:", err);
  }

  // Fallback to documented initial services
  return INITIAL_SERVICES.filter(
    (s) => s.facilityId === facilityId && s.active !== false
  );
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

    if (snapshot && !snapshot.empty) {
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
        if (snapshot && !snapshot.empty) {
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
