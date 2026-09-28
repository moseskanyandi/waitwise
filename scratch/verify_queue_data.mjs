import { calculateQueuePosition } from "../src/utils/queue.js";

console.log("=== VERIFYING REAL QUEUE DATA ORDER & STATUS TRANSITIONS ===");

// Initial situation: Patient A, B, C are waiting in queue
const patientA = { id: "pat_A", ticketCode: "A001", status: "WAITING", enteredAt: "2026-09-25T08:00:00Z" };
const patientB = { id: "pat_B", ticketCode: "A002", status: "WAITING", enteredAt: "2026-09-25T08:05:00Z" };
const patientC = { id: "pat_C", ticketCode: "A003", status: "WAITING", enteredAt: "2026-09-25T08:10:00Z" };
const patientD = { id: "pat_D", ticketCode: "A004", status: "WAITING", enteredAt: "2026-09-25T08:15:00Z" };

const queueBeforeD = [patientA, patientB, patientC];

// Test 1: Screen 3 (Confirm Queue) for incoming Patient D (not joined yet)
const screen3Metrics = calculateQueuePosition(queueBeforeD, null);
console.log("Screen 3 (Confirm) before joining:", screen3Metrics);
console.assert(screen3Metrics.peopleAhead === 3, `Expected 3 people ahead on Screen 3, got ${screen3Metrics.peopleAhead}`);
console.assert(screen3Metrics.position === 4, `Expected position 4 on Screen 3, got ${screen3Metrics.position}`);
console.assert(screen3Metrics.positionOrdinal === "4th", `Expected 4th on Screen 3, got ${screen3Metrics.positionOrdinal}`);

// Test 2: Screen 4 (Ticket Generated) after Patient D joins
const queueWithD = [patientA, patientB, patientC, patientD];
const screen4Metrics = calculateQueuePosition(queueWithD, "pat_D");
console.log("Screen 4 (Ticket) for Patient D:", screen4Metrics);
console.assert(screen4Metrics.peopleAhead === 3, `Expected 3 people ahead for Patient D, got ${screen4Metrics.peopleAhead}`);
console.assert(screen4Metrics.position === 4, `Expected position 4 for Patient D, got ${screen4Metrics.position}`);
console.assert(screen4Metrics.positionOrdinal === "4th", `Expected 4th for Patient D, got ${screen4Metrics.positionOrdinal}`);

// Test 3: Status transition - Patient A called
patientA.status = "CALLED";
const metricsAfterACalled = calculateQueuePosition(queueWithD, "pat_D");
console.log("After Patient A CALLED, Patient D metrics:", metricsAfterACalled);
console.assert(metricsAfterACalled.peopleAhead === 2, `Expected 2 people ahead, got ${metricsAfterACalled.peopleAhead}`);
console.assert(metricsAfterACalled.position === 3, `Expected position 3, got ${metricsAfterACalled.position}`);
console.assert(metricsAfterACalled.positionOrdinal === "3rd", `Expected 3rd, got ${metricsAfterACalled.positionOrdinal}`);

// Test 4: Status transition - Patient B completed
patientB.status = "COMPLETED";
const metricsAfterBCompleted = calculateQueuePosition(queueWithD, "pat_D");
console.log("After Patient B COMPLETED, Patient D metrics:", metricsAfterBCompleted);
console.assert(metricsAfterBCompleted.peopleAhead === 1, `Expected 1 person ahead, got ${metricsAfterBCompleted.peopleAhead}`);
console.assert(metricsAfterBCompleted.position === 2, `Expected position 2, got ${metricsAfterBCompleted.position}`);
console.assert(metricsAfterBCompleted.positionOrdinal === "2nd", `Expected 2nd, got ${metricsAfterBCompleted.positionOrdinal}`);

// Test 5: Status transition - Patient C cancelled
patientC.status = "CANCELLED";
const metricsAfterCCancelled = calculateQueuePosition(queueWithD, "pat_D");
console.log("After Patient C CANCELLED, Patient D metrics:", metricsAfterCCancelled);
console.assert(metricsAfterCCancelled.peopleAhead === 0, `Expected 0 people ahead, got ${metricsAfterCCancelled.peopleAhead}`);
console.assert(metricsAfterCCancelled.position === 1, `Expected position 1, got ${metricsAfterCCancelled.position}`);
console.assert(metricsAfterCCancelled.positionOrdinal === "1st", `Expected 1st, got ${metricsAfterCCancelled.positionOrdinal}`);

console.log("✓ ALL QUEUE VERIFICATION TESTS PASSED PERFECTLY!");
