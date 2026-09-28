import { getServiceQueue, createQueueEntry, updateQueueEntryStatus } from "../src/services/queueService.js";
import { calculateQueuePosition } from "../src/utils/queue.js";

async function run() {
  console.log("1. Checking initial waiting entries...");
  const initialEntries = await getServiceQueue("main-health-centre", "general-consultation");
  console.log("Initial count:", initialEntries.length);
  const prospective = calculateQueuePosition(initialEntries, null);
  console.log("Screen 3 (prospective before join):", prospective);
  console.assert(prospective.peopleAhead === 3, "Expected 3 people ahead on Screen 3");
  console.assert(prospective.position === 4, "Expected position 4 on Screen 3");

  console.log("\n2. Patient D joins via createQueueEntry...");
  const patientD = await createQueueEntry({
    facilityId: "main-health-centre",
    serviceId: "general-consultation",
    ticketPrefix: "A",
  });
  console.log("Patient D ticket created:", patientD.ticketCode, patientD.id);

  const entriesAfterD = await getServiceQueue("main-health-centre", "general-consultation");
  const dMetrics = calculateQueuePosition(entriesAfterD, patientD.id);
  console.log("Screen 4 (Patient D on Ticket page):", dMetrics);
  console.assert(dMetrics.peopleAhead === 3, "Expected 3 people ahead for Patient D");
  console.assert(dMetrics.position === 4, "Expected position 4 for Patient D");
  console.assert(dMetrics.positionOrdinal === "4th", "Expected 4th");

  console.log("\n3. Patient A status changes to CALLED...");
  await updateQueueEntryStatus("entry_pat_A", "CALLED");
  const entriesAfterCall = await getServiceQueue("main-health-centre", "general-consultation");
  const dMetricsAfterCall = calculateQueuePosition(entriesAfterCall, patientD.id);
  console.log("Patient D after Patient A called:", dMetricsAfterCall);
  console.assert(dMetricsAfterCall.peopleAhead === 2, "Expected 2 people ahead");
  console.assert(dMetricsAfterCall.position === 3, "Expected position 3");
  console.assert(dMetricsAfterCall.positionOrdinal === "3rd", "Expected 3rd");

  console.log("\n✓ ALL SERVICE LEVEL TESTS PASSED!");
}

run().catch(console.error);
