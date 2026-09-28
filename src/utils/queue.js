import { BASELINE_MINUTES_PER_PERSON, QUEUE_STATUS } from "../constants/queueConstants.js";

/**
 * Format a number as an ordinal string (e.g. 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th")
 */
export function formatOrdinal(n) {
  const num = Math.max(1, parseInt(n, 10) || 1);
  const s = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Robustly extract a millisecond timestamp from Firestore Timestamp, Date, string, or number.
 */
export function getTimestampMillis(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (typeof ts.toDate === "function") return ts.toDate().getTime();
  if (typeof ts.seconds === "number") {
    return ts.seconds * 1000 + (ts.nanoseconds ? ts.nanoseconds / 1e6 : 0);
  }
  if (ts instanceof Date) return ts.getTime();
  if (typeof ts === "string") {
    const parsed = Date.parse(ts);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof ts === "number") return ts;
  return 0;
}

/**
 * Calculate dynamic queue position, count of people ahead, and estimated wait time.
 * Calculates from live queue entries in FIFO order, respecting active waiting status.
 *
 * @param {Array} entries - All queue entries (or waiting queue entries) for the service
 * @param {string|null} currentEntryId - Patient's queue entry ID or ticketCode, or null if prospective (Screen 3)
 * @returns {Object} { position, positionOrdinal, peopleAhead, estimatedWaitText, estimatedWaitMinutes }
 */
export function calculateQueuePosition(entries = [], currentEntryId = null) {
  const waitingStatus = QUEUE_STATUS?.WAITING || "WAITING";

  // Filter only eligible active waiting entries (exclude CALLED, IN_CONSULTATION, COMPLETED, CANCELLED, NO_SHOW)
  const activeEntries = (Array.isArray(entries) ? entries : []).filter((e) => {
    if (!e) return false;
    const status = e.status || waitingStatus;
    return status === waitingStatus;
  });

  // Sort FIFO: entries with earlier enteredAt or createdAt come first
  // Alphanumeric ticketCode as secondary tie-breaker
  const sorted = [...activeEntries].sort((a, b) => {
    const timeA = getTimestampMillis(a.enteredAt || a.createdAt);
    const timeB = getTimestampMillis(b.enteredAt || b.createdAt);
    if (timeA && timeB && timeA !== timeB) {
      return timeA - timeB;
    }
    return (a.ticketCode || "").localeCompare(b.ticketCode || "", undefined, { numeric: true });
  });

  let peopleAhead = 0;

  if (!currentEntryId) {
    // Prospective patient (e.g. Screen 3 Confirm page before joining)
    peopleAhead = sorted.length;
  } else {
    // Look up patient by entry ID or ticket code
    const index = sorted.findIndex(
      (e) => e.id === currentEntryId || (e.ticketCode && e.ticketCode === currentEntryId)
    );

    if (index >= 0) {
      peopleAhead = index;
    } else {
      // If newly joined entry is not yet in the active snapshot, it is positioned at the end
      peopleAhead = sorted.length;
    }
  }

  const position = peopleAhead + 1;
  const positionOrdinal = formatOrdinal(position);

  // Dynamic estimated wait range based on people ahead
  let estimatedWaitText = "15 – 30 minutes";
  const interval = BASELINE_MINUTES_PER_PERSON || 7;

  if (position <= 1) {
    estimatedWaitText = "Under 10 minutes";
  } else if (position === 2) {
    estimatedWaitText = "5 – 15 minutes";
  } else if (position <= 4) {
    estimatedWaitText = "15 – 30 minutes";
  } else {
    const minMins = Math.max(20, peopleAhead * interval);
    const maxMins = minMins + 15;
    estimatedWaitText = `${minMins} – ${maxMins} minutes`;
  }

  return {
    position,
    positionOrdinal,
    peopleAhead,
    estimatedWaitText,
    estimatedWaitMinutes: position * interval,
  };
}
