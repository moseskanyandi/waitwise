import React from "react";
import {
  StethoscopeIcon,
  FlaskIcon,
  PillIcon,
  XrayIcon,
} from "../common/Icons";

export function TicketCard({
  ticketCode = "A106",
  serviceName = "General Consultation",
  facilityName = "Main Health Centre",
  serviceIcon = "stethoscope",
}) {
  const renderServiceIcon = () => {
    switch (serviceIcon) {
      case "flask":
        return <FlaskIcon size={20} />;
      case "pill":
        return <PillIcon size={20} />;
      case "xray":
        return <XrayIcon size={20} />;
      case "stethoscope":
      default:
        return <StethoscopeIcon size={20} />;
    }
  };

  return (
    <div className="ww-ticket-cutout-card" aria-label={`Ticket ${ticketCode}`}>
      {/* Decorative semi-circular ticket punch notches */}
      <div className="ww-ticket-notch ww-ticket-notch-left" aria-hidden="true" />
      <div className="ww-ticket-notch ww-ticket-notch-right" aria-hidden="true" />

      <div className="ww-ticket-inner">
        <span className="ww-ticket-badge">YOUR TICKET NUMBER</span>
        <div className="ww-ticket-number">{ticketCode}</div>

        <div className="ww-ticket-footer">
          <div className="ww-ticket-service-icon" aria-hidden="true">
            {renderServiceIcon()}
          </div>
          <div className="ww-ticket-service-info">
            <span className="ww-ticket-service-name">{serviceName}</span>
            <span className="ww-ticket-facility-name">{facilityName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
