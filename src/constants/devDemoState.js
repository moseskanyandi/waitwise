/**
 * Development-only demonstration queue state.
 * Strictly isolated for dev previews.
 * Never written to Firestore or mixed with real patient queues.
 */

// Deliberate demonstration state: 3rd in line / 2 people ahead
export const DEV_DEMO_PATIENT_STATE = {
  isPreview: true,
  entryId: "dev_preview_entry_A004",
  ticketCode: "A004",
  status: "WAITING",
  service: {
    id: "general-consultation",
    name: "General Consultation",
    code: "A",
  },
  facility: {
    id: "main-health-centre",
    name: "Main Health Centre",
    location: "Lusaka",
  },
  queueMetrics: {
    position: 3,
    positionOrdinal: "3rd in line",
    peopleAhead: 2,
    estimatedWaitText: "10 – 20 minutes",
  },
};

// Screen 6 preview: 2nd in line / 1 person ahead
export const DEV_SCREEN_6_PREVIEW = {
  isPreview: true,
  entryId: "dev_preview_entry_A004",
  ticketCode: "A004",
  status: "WAITING",
  service: {
    id: "general-consultation",
    name: "General Consultation",
    code: "A",
  },
  facility: {
    id: "main-health-centre",
    name: "Main Health Centre",
    location: "Lusaka",
  },
  queueMetrics: {
    position: 2,
    positionOrdinal: "2nd in line",
    peopleAhead: 1,
    estimatedWaitText: "5 – 15 minutes",
  },
};

// Screen 7 preview: CALLED to Room 3 with instruction
export const DEV_SCREEN_7_PREVIEW = {
  isPreview: true,
  entryId: "dev_preview_entry_A004",
  ticketCode: "A004",
  status: "CALLED",
  room: "Room 3",
  service: {
    id: "general-consultation",
    name: "General Consultation",
    code: "A",
  },
  facility: {
    id: "main-health-centre",
    name: "Main Health Centre",
    location: "Lusaka",
  },
};

// Screen 8 preview: COMPLETED
export const DEV_SCREEN_8_PREVIEW = {
  isPreview: true,
  entryId: "dev_preview_entry_A004",
  ticketCode: "A004",
  status: "COMPLETED",
  room: "Room 3",
  service: {
    id: "general-consultation",
    name: "General Consultation",
    code: "A",
  },
  facility: {
    id: "main-health-centre",
    name: "Main Health Centre",
    location: "Lusaka",
  },
  completedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
};
