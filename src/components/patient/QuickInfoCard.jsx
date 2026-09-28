import React from "react";
import { ClockIcon } from "../common/Icons";

export function QuickInfoCard({
  title = "Quick Information",
  service = "General Consultation",
  facility = "Main Health Centre",
  ticketNumber = "A106",
  currentPosition = "4th in line",
  peopleAhead = 3,
  estimatedWaitTime = "15 – 30 minutes",
}) {
  return (
    <div className="ww-quick-info-card">
      <div className="ww-quick-info-header">
        <div className="ww-quick-info-icon" aria-hidden="true">
          <ClockIcon size={20} />
        </div>
        <h3 className="ww-quick-info-title">{title}</h3>
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
          <span className="ww-info-label">Current position</span>
          <span className="ww-info-value">{currentPosition}</span>
        </div>
        <div className="ww-quick-info-row">
          <span className="ww-info-label">People ahead</span>
          <span className="ww-info-value">{peopleAhead}</span>
        </div>
        <div className="ww-quick-info-row">
          <span className="ww-info-label">Estimated wait time</span>
          <span className="ww-info-value">{estimatedWaitTime}</span>
        </div>
      </div>
    </div>
  );
}

export default QuickInfoCard;
