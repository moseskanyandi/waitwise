/**
 * Queue system constants and fallback data per specification Section 6.
 */

export const DEFAULT_FACILITY_ID = "main-health-centre";

export const QUEUE_STATUS = {
  WAITING: "WAITING",
  CALLED: "CALLED",
  IN_CONSULTATION: "IN_CONSULTATION",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
};

// Baseline wait estimate per waiting person in minutes
export const BASELINE_MINUTES_PER_PERSON = 7;

// Initial service catalog documented in Section 6 of specification
export const INITIAL_SERVICES = [
  {
    id: "general-consultation",
    facilityId: DEFAULT_FACILITY_ID,
    name: "General Consultation",
    code: "A",
    active: true,
    capacity: 1,
    description: "See a doctor for a general check-up, illness or medical advice.",
    icon: "stethoscope",
    themeColor: "teal",
  },
  {
    id: "laboratory",
    facilityId: DEFAULT_FACILITY_ID,
    name: "Laboratory",
    code: "B",
    active: true,
    capacity: 1,
    description: "Get your tests done quickly and safely.",
    icon: "flask",
    themeColor: "blue",
  },
  {
    id: "pharmacy",
    facilityId: DEFAULT_FACILITY_ID,
    name: "Pharmacy",
    code: "C",
    active: true,
    capacity: 1,
    description: "Collect your prescribed medication.",
    icon: "pill",
    themeColor: "purple",
  },
  {
    id: "imaging",
    facilityId: DEFAULT_FACILITY_ID,
    name: "Imaging / X-ray",
    code: "D",
    active: true,
    capacity: 1,
    description: "Get your scans and imaging services.",
    icon: "xray",
    themeColor: "cyan",
  },
];
