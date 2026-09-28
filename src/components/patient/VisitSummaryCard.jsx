import React from "react";
import { DocumentIcon } from "../common/Icons";

export function VisitSummaryCard({
  service = "General Consultation",
  facility = "Main Health Centre",
  ticketNumber = "A106",
  room = "Room 3",
  status = "Completed",
  dateTime = "24 Sep 2025 • 10:42 AM",
}) {
  return (
    <div className="ww-quick-info-card ww-visit-summary-card">
      <div className="ww-quick-info-header">
        <div className="ww-quick-info-icon" aria-hidden="true">
          <DocumentIcon size={18} />
        </div>
        <h3 className="ww-quick-info-title">Visit Summary</h3>
      </div>

      <div className="ww-quick-info-body">
        <div className="ww-quick-info-row">
          <span className="ww-info-label">Service</span>
          <span className="ww-info-value">{service}</span>
        </div>
        <div className="ww-quick-info-row">
          <span className="ww-info-label">Facility</span>
          <span className="ww-info-value">{facility}</span>
        </div>
        <div className="ww-quick-info-row">
          <span className="ww-info-label">Ticket number</span>
          <span className="ww-info-value ww-info-value-bold">{ticketNumber}</span>
        </div>
        <div className="ww-quick-info-row">
          <span className="ww-info-label">Room</span>
          <span className="ww-info-value">{room}</span>
        </div>
        <div className="ww-quick-info-row">
          <span className="ww-info-label">Status</span>
          <span className="ww-info-value">{status}</span>
        </div>
        <div className="ww-quick-info-row">
          <span className="ww-info-label">Date & time</span>
          <span className="ww-info-value">{dateTime}</span>
        </div>
      </div>
    </div>
  );
}

export default VisitSummaryCard;
