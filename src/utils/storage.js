/**
 * Local storage helpers for patient ticket persistence and recovery.
 * Firestore remains the source of truth; local storage is used solely
 * so patients can recover their active ticket on browser refresh or return.
 */

const ACTIVE_TICKET_KEY = "waitwise_active_ticket";
const SELECTED_SERVICE_KEY = "waitwise_selected_service";

export function saveActiveTicket(ticketData) {
  try {
    if (!ticketData) return;
    localStorage.setItem(ACTIVE_TICKET_KEY, JSON.stringify(ticketData));
  } catch (err) {
    console.warn("Could not save active ticket to localStorage:", err);
  }
}

export function getActiveTicket() {
  try {
    const raw = localStorage.getItem(ACTIVE_TICKET_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Could not read active ticket from localStorage:", err);
    return null;
  }
}

export function clearActiveTicket() {
  try {
    localStorage.removeItem(ACTIVE_TICKET_KEY);
  } catch (err) {
    console.warn("Could not clear active ticket from localStorage:", err);
  }
}

export function saveSelectedService(serviceData) {
  try {
    if (!serviceData) return;
    sessionStorage.setItem(SELECTED_SERVICE_KEY, JSON.stringify(serviceData));
  } catch (err) {
    console.warn("Could not save selected service to sessionStorage:", err);
  }
}

export function getSelectedService() {
  try {
    const raw = sessionStorage.getItem(SELECTED_SERVICE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Could not read selected service from sessionStorage:", err);
    return null;
  }
}

export function clearSelectedService() {
  try {
    sessionStorage.removeItem(SELECTED_SERVICE_KEY);
  } catch (err) {
    console.warn("Could not clear selected service from sessionStorage:", err);
  }
}
