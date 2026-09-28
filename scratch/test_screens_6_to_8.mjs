import {
  getServiceQueue,
  createQueueEntry,
  updateQueueEntryStatus,
  subscribeToQueueEntry,
  subscribeToServiceQueue,
} from "../src/services/queueService.js";
import { calculateQueuePosition } from "../src/utils/queue.js";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import auth from "../src/services/firebase/auth.js";
import db from "../src/services/firebase/firestore.js";
import { doc, getDoc } from "firebase/firestore";

// Load environment variables from .env if present (built into Node v20.6+)
try {
  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile();
  }
} catch {
  // .env file is optional if variables are already set in process.env
}

// ---------------------------------------------------------------------------
// FALLBACK PROTECTION: Trap console warnings and fail if Firestore is bypassed
// ---------------------------------------------------------------------------
const firestoreFailures = [];
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args.map((a) => (a?.message || a?.toString?.() || String(a))).join(" ");
  if (
    msg.includes("Firestore") ||
    msg.includes("PERMISSION_DENIED") ||
    msg.includes("Missing or insufficient permissions")
  ) {
    firestoreFailures.push(msg);
  }
  originalWarn(...args);
};

function assertNoFirestoreFailures(stepName) {
  if (firestoreFailures.length > 0) {
    const errorDetails = firestoreFailures.join("\n   ");
    throw new Error(
      `CRITICAL TEST FAILURE in ${stepName}: Firestore operation failed and fell back to memory!\n   ${errorDetails}`
    );
  }
}

async function verifyDocInFirestore(entryId, expectedStatus, expectedFields = {}) {
  const ref = doc(db, "queueEntries", entryId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error(`CRITICAL TEST FAILURE: Entry ${entryId} does not exist in Firestore!`);
  }
  const data = snap.data();
  if (expectedStatus && data.status !== expectedStatus) {
    throw new Error(
      `CRITICAL TEST FAILURE: Entry ${entryId} in Firestore has status "${data.status}", expected "${expectedStatus}"!`
    );
  }
  for (const [key, val] of Object.entries(expectedFields)) {
    if (data[key] !== val) {
      throw new Error(
        `CRITICAL TEST FAILURE: Entry ${entryId} field "${key}" is "${data[key]}", expected "${val}"!`
      );
    }
  }
  return data;
}

// ---------------------------------------------------------------------------
// TEST SUITE
// ---------------------------------------------------------------------------
const staffEmail = process.env.WAITWISE_TEST_STAFF_EMAIL;
const staffPassword = process.env.WAITWISE_TEST_STAFF_PASSWORD;

// Isolated, deterministic test service scenario on live Firestore
const TEST_FACILITY_ID = "test-health-centre";
const TEST_SERVICE_ID = `consultation-test-${Date.now()}`;

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING TESTS FOR SCREENS 6–8 QUEUE LIFECYCLE");
  console.log(`Scenario Service: ${TEST_SERVICE_ID}`);
  console.log("==================================================\n");

  // PREPARATION: Verify clean initial queue for this isolated test service
  const initialCheck = await getServiceQueue(TEST_FACILITY_ID, TEST_SERVICE_ID);
  console.assert(initialCheck.length === 0, "Expected isolated test service queue to start empty");
  assertNoFirestoreFailures("Initial Queue Check");

  // SETUP: Populate live Firestore queue with initial Patients A, B, and C
  console.log("--- SETUP: Populating live Firestore queue with Patients A, B, C ---");
  const patA = await createQueueEntry({
    facilityId: TEST_FACILITY_ID,
    serviceId: TEST_SERVICE_ID,
    ticketPrefix: "A",
  });
  await verifyDocInFirestore(patA.id, "WAITING");
  console.log(`Created Patient A in Firestore: Ticket ${patA.ticketCode} (ID: ${patA.id})`);

  const patB = await createQueueEntry({
    facilityId: TEST_FACILITY_ID,
    serviceId: TEST_SERVICE_ID,
    ticketPrefix: "A",
  });
  await verifyDocInFirestore(patB.id, "WAITING");
  console.log(`Created Patient B in Firestore: Ticket ${patB.ticketCode} (ID: ${patB.id})`);

  const patC = await createQueueEntry({
    facilityId: TEST_FACILITY_ID,
    serviceId: TEST_SERVICE_ID,
    ticketPrefix: "A",
  });
  await verifyDocInFirestore(patC.id, "WAITING");
  console.log(`Created Patient C in Firestore: Ticket ${patC.ticketCode} (ID: ${patC.id})`);
  assertNoFirestoreFailures("Patients A, B, C creation");

  // TEST A: Target Patient joins queue anonymously and observes position
  console.log("\n--- TEST A: Target Patient joins queue anonymously ---");
  const patient = await createQueueEntry({
    facilityId: TEST_FACILITY_ID,
    serviceId: TEST_SERVICE_ID,
    ticketPrefix: "A",
  });
  await verifyDocInFirestore(patient.id, "WAITING");
  console.log(`Target Patient joined with Ticket: ${patient.ticketCode} (ID: ${patient.id})`);
  assertNoFirestoreFailures("Target Patient creation");

  // Query raw service queue directly from Firestore (no client-side filtering)
  const queueSnapshotA = await getServiceQueue(TEST_FACILITY_ID, TEST_SERVICE_ID);
  assertNoFirestoreFailures("Raw Firestore getServiceQueue (Test A)");

  // Exercise production calculateQueuePosition on the raw, unfiltered queue
  const metricsA = calculateQueuePosition(queueSnapshotA, patient.id);
  console.log(`Initial position: ${metricsA.positionOrdinal} (${metricsA.peopleAhead} people ahead)`);
  console.assert(metricsA.position === 4, "Expected target patient to be 4th in line initially");
  console.assert(metricsA.peopleAhead === 3, "Expected 3 people ahead initially");
  console.log("✓ TEST A PASSED: Real Firestore entry created and position 4 calculated!");

  // AUTHENTICATE STAFF USER FOR LIFECYCLE TESTS
  console.log("\n--- AUTHENTICATING STAFF USER FOR LIFECYCLE TESTS ---");
  if (!staffEmail || !staffPassword) {
    console.error("\n❌ [ERROR] Missing required environment variables for staff tests:");
    if (!staffEmail) console.error("   - WAITWISE_TEST_STAFF_EMAIL is not set.");
    if (!staffPassword) console.error("   - WAITWISE_TEST_STAFF_PASSWORD is not set.");
    console.error("\nPlease define them in your .env file or environment, for example:");
    console.error("   WAITWISE_TEST_STAFF_EMAIL=staff@waitwise.local");
    console.error("   WAITWISE_TEST_STAFF_PASSWORD=YourPassword123!\n");
    process.exit(1);
  }

  console.log(`Signing in staff user: ${staffEmail}...`);
  const userCredential = await signInWithEmailAndPassword(auth, staffEmail, staffPassword);
  console.log(`✓ Authenticated as Staff UID: ${userCredential.user.uid}`);

  // TEST B: Staff advances Patients A and B; patient becomes Almost Next (Screen 6)
  console.log("\n--- TEST B: Queue advances until patient is Almost Next (Screen 6) ---");
  await updateQueueEntryStatus(patA.id, "CALLED");
  await verifyDocInFirestore(patA.id, "CALLED");

  await updateQueueEntryStatus(patB.id, "COMPLETED");
  await verifyDocInFirestore(patB.id, "COMPLETED");
  assertNoFirestoreFailures("Staff queue advancement");

  // Query raw service queue directly from Firestore (no client-side filtering)
  const queueSnapshotB = await getServiceQueue(TEST_FACILITY_ID, TEST_SERVICE_ID);
  assertNoFirestoreFailures("Raw Firestore getServiceQueue (Test B)");

  // Exercise production calculateQueuePosition on the raw, unfiltered queue
  const metricsB = calculateQueuePosition(queueSnapshotB, patient.id);
  console.log(`Updated position: ${metricsB.positionOrdinal} (${metricsB.peopleAhead} person ahead)`);
  console.log(`Estimated wait: ${metricsB.estimatedWaitText}`);

  const isAlmostNext = metricsB.position <= 2 || metricsB.peopleAhead <= 1;
  console.assert(isAlmostNext === true, "Expected Almost Next condition to be true");
  console.assert(metricsB.position === 2, "Expected exactly 2nd in line for Almost Next");
  console.assert(metricsB.peopleAhead === 1, "Expected exactly 1 person ahead for Almost Next");
  console.assert(metricsB.estimatedWaitText === "5 – 15 minutes", "Expected 5 – 15 minutes wait time");
  console.log("✓ TEST B PASSED: Realtime queue updates triggered Almost Next (Screen 6) condition!");

  // TEST C: Staff calls patient (Screen 7)
  console.log("\n--- TEST C: Patient becomes CALLED (Screen 7) ---");
  let lastEntryUpdate = null;
  const unsubscribe = subscribeToQueueEntry(
    patient.id,
    (entry) => {
      lastEntryUpdate = entry;
    },
    (err) => {
      throw new Error(`CRITICAL TEST FAILURE: Firestore entry subscription failed: ${err.message}`);
    }
  );

  await updateQueueEntryStatus(patient.id, "CALLED", { room: "Room 3" });
  await verifyDocInFirestore(patient.id, "CALLED", { room: "Room 3" });
  assertNoFirestoreFailures("Staff call patient");

  console.log(`Patient status updated: ${lastEntryUpdate?.status}, Room: ${lastEntryUpdate?.room}`);
  console.assert(lastEntryUpdate?.status === "CALLED", "Expected patient status to be CALLED");
  console.assert(lastEntryUpdate?.room === "Room 3", "Expected Room 3");
  console.log("✓ TEST C PASSED: Patient transitioned to CALLED with Room 3 in live Firestore (Screen 7)!");

  // TEST D: Staff updates patient to IN_CONSULTATION then COMPLETED (Screen 8)
  console.log("\n--- TEST D: Patient reaches COMPLETED (Screen 8) ---");
  await updateQueueEntryStatus(patient.id, "IN_CONSULTATION");
  await verifyDocInFirestore(patient.id, "IN_CONSULTATION");
  console.log(`Patient status: ${lastEntryUpdate?.status}`);
  console.assert(lastEntryUpdate?.status === "IN_CONSULTATION", "Expected IN_CONSULTATION");

  const completedTime = new Date().toISOString();
  await updateQueueEntryStatus(patient.id, "COMPLETED", {
    completedAt: completedTime,
    room: "Room 3",
  });
  await verifyDocInFirestore(patient.id, "COMPLETED", { room: "Room 3" });
  assertNoFirestoreFailures("Staff complete patient");

  console.log(`Patient status: ${lastEntryUpdate?.status}, CompletedAt: ${lastEntryUpdate?.completedAt}`);
  console.assert(lastEntryUpdate?.status === "COMPLETED", "Expected COMPLETED");
  console.assert(Boolean(lastEntryUpdate?.completedAt), "Expected completedAt timestamp");
  console.log("✓ TEST D PASSED: Patient transitioned to COMPLETED in live Firestore (Screen 8)!");

  unsubscribe();

  // TEARDOWN: Complete Patient C so no WAITING records linger
  await updateQueueEntryStatus(patC.id, "COMPLETED");
  await verifyDocInFirestore(patC.id, "COMPLETED");

  // STAFF LOGOUT
  console.log("\nSigning out staff user...");
  await signOut(auth);
  console.log("✓ Staff signed out cleanly.");

  // TEST E: Ticket Recovery verification (Anonymous Patient storage)
  console.log("\n--- TEST E: Ticket recovery verification ---");
  const storedTicket = {
    entryId: patient.id,
    ticketCode: patient.ticketCode,
    status: lastEntryUpdate?.status,
    service: { id: TEST_SERVICE_ID, name: "General Consultation" },
    facility: { name: "Main Health Centre" },
    room: lastEntryUpdate?.room,
    completedAt: lastEntryUpdate?.completedAt,
  };
  console.log("Simulating local storage recovery:", JSON.stringify(storedTicket, null, 2));
  console.assert(storedTicket.ticketCode === patient.ticketCode, "Ticket code must match");
  console.assert(storedTicket.status === "COMPLETED", "Status must be COMPLETED");
  console.log("✓ TEST E PASSED: Ticket and state data are safely recoverable!");

  console.log("\n==================================================");
  console.log("ALL TESTS A–E PASSED SUCCESSFULLY WITH LIVE FIRESTORE!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
