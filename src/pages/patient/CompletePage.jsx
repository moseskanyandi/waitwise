import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PatientHeader from "../../components/layout/PatientHeader";
import TicketCard from "../../components/patient/TicketCard";
import VisitSummaryCard from "../../components/patient/VisitSummaryCard";
import TakeCareCard from "../../components/patient/TakeCareCard";
import { COMPLETE_CONTENT } from "../../constants/patientContent";
import { getActiveTicket } from "../../utils/storage";
import {
  CommunityIcon,
  BuildingIcon,
  MapPinIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  StarIcon,
  HeartOutlineIcon,
  BotanicalDecoration,
  CheckBurstBadge,
} from "../../components/common/Icons";

export function CompletePage() {
  const location = useLocation();

  // Retrieve ticket from route state or recover from local storage
  const [ticketData] = useState(() => {
    return (
      location.state ||
      getActiveTicket() || {
        entryId: "temp_106",
        ticketCode: "A106",
        service: { id: "general-consultation", name: "General Consultation", code: "A" },
        facility: { name: "Main Health Centre", location: "Lusaka" },
        status: "COMPLETED",
        room: "Room 3",
      }
    );
  });

  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const service = ticketData.service || { name: "General Consultation" };
  const facility = ticketData.facility || { name: "Main Health Centre" };
  const ticketCode = ticketData.ticketCode || "A106";
  const room = ticketData.room || ticketData.service?.room || "Room 3";

  // Format real or fallback completion timestamp
  const getFormattedDateTime = () => {
    const rawDate = ticketData.completedAt || ticketData.updatedAt || ticketData.createdAt;
    const dateObj = rawDate ? new Date(rawDate) : new Date();

    const dateStr = dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const timeStr = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${dateStr} • ${timeStr}`;
  };

  const handleRate = (value) => {
    setRating(value);
    setFeedbackGiven(true);
  };

  return (
    <div className="ww-page-container">
      <PatientHeader />

      <main className="ww-main-content">
        {/* Hero Header with Check Burst Badge */}
        <div className="ww-complete-hero">
          <div className="ww-complete-badge-wrapper" aria-hidden="true">
            <CheckBurstBadge size={72} />
          </div>
          <div className="ww-complete-header-text">
            <span className="ww-complete-eyebrow">{COMPLETE_CONTENT.eyebrow}</span>
            <h1 className="ww-complete-title">{COMPLETE_CONTENT.title}</h1>
            <p className="ww-complete-subtitle">{COMPLETE_CONTENT.subtitle}</p>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="ww-complete-layout">
          {/* Left Column: Status Card + Experience Feedback Banner */}
          <div className="ww-complete-left">
            <div className="ww-complete-status-card">
              {/* Ticket Cutout Card */}
              <div className="ww-complete-ticket-wrap">
                <TicketCard
                  ticketCode={ticketCode}
                  serviceName={service.name}
                  facilityName={facility.name}
                  serviceIcon={service.icon || "stethoscope"}
                />
              </div>

              {/* Completion Details Panel */}
              <div className="ww-complete-details-panel">
                <div className="ww-complete-detail-row">
                  <div className="ww-complete-detail-icon theme-teal" aria-hidden="true">
                    <CommunityIcon size={20} />
                  </div>
                  <div className="ww-complete-detail-text">
                    <span className="ww-complete-detail-label">Service</span>
                    <span className="ww-complete-detail-value">{service.name}</span>
                  </div>
                </div>

                <div className="ww-complete-detail-row">
                  <div className="ww-complete-detail-icon theme-blue" aria-hidden="true">
                    <BuildingIcon size={20} />
                  </div>
                  <div className="ww-complete-detail-text">
                    <span className="ww-complete-detail-label">Facility</span>
                    <span className="ww-complete-detail-value">{facility.name}</span>
                  </div>
                </div>

                <div className="ww-complete-detail-row">
                  <div className="ww-complete-detail-icon theme-cyan" aria-hidden="true">
                    <MapPinIcon size={20} />
                  </div>
                  <div className="ww-complete-detail-text">
                    <span className="ww-complete-detail-label">Room</span>
                    <span className="ww-complete-detail-value">{room}</span>
                  </div>
                </div>

                <div className="ww-complete-detail-row">
                  <div className="ww-complete-detail-icon theme-mint" aria-hidden="true">
                    <CheckCircleIcon size={20} />
                  </div>
                  <div className="ww-complete-detail-text">
                    <span className="ww-complete-detail-label">Status</span>
                    <span className="ww-complete-detail-value">
                      {COMPLETE_CONTENT.statusCompleted}
                    </span>
                    <span className="ww-complete-detail-sub">
                      {COMPLETE_CONTENT.statusDescription}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience / Feedback Banner */}
            <div className="ww-feedback-banner" role="region" aria-label="Patient Feedback">
              <div className="ww-feedback-left">
                <div className="ww-feedback-icon" aria-hidden="true">
                  <MessageCircleIcon size={24} />
                </div>
                <div className="ww-feedback-text">
                  <h4 className="ww-feedback-title">{COMPLETE_CONTENT.feedback.title}</h4>
                  <p className="ww-feedback-desc">{COMPLETE_CONTENT.feedback.subtitle}</p>
                </div>
              </div>

              <div className="ww-feedback-action">
                {feedbackGiven ? (
                  <div className="ww-feedback-submitted">
                    <div className="ww-stars-row">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon
                          key={s}
                          size={18}
                          filled={s <= rating}
                          className="ww-star-icon filled"
                        />
                      ))}
                    </div>
                    <span className="ww-feedback-thanks">Thank you for your feedback!</span>
                  </div>
                ) : (
                  <div className="ww-feedback-interactive">
                    <div className="ww-stars-row" role="radiogroup" aria-label="Rate your experience">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="ww-star-btn"
                          onClick={() => handleRate(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                        >
                          <StarIcon
                            size={20}
                            filled={s <= (hoverRating || rating)}
                            className={`ww-star-icon ${
                              s <= (hoverRating || rating) ? "filled" : ""
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="ww-give-feedback-btn"
                      onClick={() => handleRate(5)}
                    >
                      <StarIcon size={16} />
                      <span>{COMPLETE_CONTENT.feedback.buttonLabel}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Visit Summary & Take Care Card */}
          <aside className="ww-complete-right" aria-label="Visit summary">
            <VisitSummaryCard
              service={service.name}
              facility={facility.name}
              ticketNumber={ticketCode}
              room={room}
              status={COMPLETE_CONTENT.statusCompleted}
              dateTime={getFormattedDateTime()}
            />

            <TakeCareCard />
          </aside>
        </div>

        {/* Thank You Reassurance Banner */}
        <div className="ww-reassurance-banner" role="complementary">
          <div className="ww-reassurance-left">
            <div className="ww-reassurance-icon">
              <HeartOutlineIcon size={24} />
            </div>
            <div className="ww-reassurance-divider" aria-hidden="true" />
            <div className="ww-reassurance-text">
              <span className="ww-reassurance-title">
                Thank you for choosing WaitWise.
              </span>
              <span className="ww-reassurance-subtitle">
                We're here to make your visit easier, faster and more comfortable.
              </span>
            </div>
          </div>
          <div className="ww-reassurance-leaves" aria-hidden="true">
            <BotanicalDecoration width={88} height={46} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default CompletePage;
