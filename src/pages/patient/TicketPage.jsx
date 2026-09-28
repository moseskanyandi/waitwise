import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PatientHeader from "../../components/layout/PatientHeader";
import TicketCard from "../../components/patient/TicketCard";
import QuickInfoCard from "../../components/patient/QuickInfoCard";
import HelpfulTipsCard from "../../components/patient/HelpfulTipsCard";
import { TICKET_CONTENT } from "../../constants/patientContent.js";
import { getActiveTicket } from "../../utils/storage.js";
import { getServiceQueue, subscribeToServiceQueue } from "../../services/queueService.js";
import { calculateQueuePosition } from "../../utils/queue.js";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  TicketIcon,
  CheckBurstBadge,
  CommunityIcon,
  ClockIcon,
  SyncIcon,
  InfoIcon,
  HeartOutlineIcon,
  BotanicalDecoration,
} from "../../components/common/Icons.jsx";

export function TicketPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve active ticket from state or storage
  const [ticketData, setTicketData] = useState(() => {
    return location.state || getActiveTicket() || {
      entryId: "temp_106",
      ticketCode: "A106",
      service: { id: "general-consultation", name: "General Consultation", code: "A" },
      facility: { name: "Main Health Centre", location: "Lusaka" },
    };
  });

  const [queueMetrics, setQueueMetrics] = useState(() => {
    return (
      location.state?.initialMetrics || {
        position: 4,
        positionOrdinal: "4th in line",
        peopleAhead: 3,
        estimatedWaitText: "15 – 30 minutes",
      }
    );
  });

  useEffect(() => {
    let isMounted = true;
    const facilityId = ticketData.facility?.id || "main-health-centre";
    const serviceId = ticketData.service?.id || "general-consultation";
    const currentEntryId = ticketData.entryId || ticketData.ticketCode;

    // Real-time listener for queue entries to recalculate position dynamically
    const unsubscribe = subscribeToServiceQueue(
      facilityId,
      serviceId,
      (waitingEntries) => {
        if (isMounted && Array.isArray(waitingEntries)) {
          const metrics = calculateQueuePosition(waitingEntries, currentEntryId);
          setQueueMetrics({
            position: metrics.position,
            positionOrdinal: `${metrics.positionOrdinal} in line`,
            peopleAhead: metrics.peopleAhead,
            estimatedWaitText: metrics.estimatedWaitText,
          });
        }
      }
    );

    return () => {
      isMounted = false;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [ticketData?.entryId, ticketData?.ticketCode, ticketData?.service?.id]);

  const service = ticketData.service || { name: "General Consultation", code: "A" };
  const facility = ticketData.facility || { name: "Main Health Centre" };
  const ticketCode = ticketData.ticketCode || "A106";

  return (
    <div className="ww-page-container">
      <PatientHeader />

      <main className="ww-main-content">
        {/* Back Link */}
        <div className="ww-back-nav">
          <Link to="/" className="ww-back-link">
            <ArrowLeftIcon size={16} />
            <span>{TICKET_CONTENT.backLabel}</span>
          </Link>
        </div>

        {/* Confirmation Header with radiant burst checkmark badge */}
        <div className="ww-ticket-header">
          <div className="ww-ticket-badge-wrapper" aria-hidden="true">
            <CheckBurstBadge size={72} />
          </div>
          <div className="ww-ticket-header-text">
            <h1 className="ww-ticket-heading-dark">{TICKET_CONTENT.headingDark}</h1>
            <h2 className="ww-ticket-heading-teal">{TICKET_CONTENT.headingTeal}</h2>
            <p className="ww-ticket-summary-copy">
              {TICKET_CONTENT.joinedPrefix} <strong>{service.name}</strong>{" "}
              {TICKET_CONTENT.joinedMiddle} <strong>{facility.name}</strong>.
            </p>
            <p className="ww-ticket-notice">{TICKET_CONTENT.autoUpdateNotice}</p>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="ww-ticket-layout">
          {/* Left Column: Ticket Cutout + Status Metrics & Check Later Bar */}
          <div className="ww-ticket-left">
            <div className="ww-ticket-display-container">
              {/* Physical Cutout Card */}
              <div className="ww-ticket-cutout-wrap">
                <TicketCard
                  ticketCode={ticketCode}
                  serviceName={service.name}
                  facilityName={facility.name}
                  serviceIcon={service.icon || "stethoscope"}
                />
              </div>

              {/* Status information beside ticket */}
              <div className="ww-ticket-metrics">
                <div className="ww-metric-row">
                  <div className="ww-metric-icon-circle theme-teal" aria-hidden="true">
                    <CommunityIcon size={22} />
                  </div>
                  <div className="ww-metric-text">
                    <span className="ww-metric-label">{TICKET_CONTENT.positionLabel}</span>
                    <span className="ww-metric-value">{queueMetrics.positionOrdinal}</span>
                    <span className="ww-metric-sub">
                      {queueMetrics.peopleAhead} {TICKET_CONTENT.aheadLabel}
                    </span>
                  </div>
                </div>

                <div className="ww-metric-row">
                  <div className="ww-metric-icon-circle theme-mint" aria-hidden="true">
                    <ClockIcon size={22} />
                  </div>
                  <div className="ww-metric-text">
                    <span className="ww-metric-label">{TICKET_CONTENT.waitLabel}</span>
                    <span className="ww-metric-value">{queueMetrics.estimatedWaitText}</span>
                    <span className="ww-metric-sub">{TICKET_CONTENT.waitDisclaimer}</span>
                  </div>
                </div>

                <div className="ww-metric-row">
                  <div className="ww-metric-icon-circle theme-cyan" aria-hidden="true">
                    <SyncIcon size={20} />
                  </div>
                  <div className="ww-metric-text">
                    <span className="ww-metric-label">{TICKET_CONTENT.lastUpdatedLabel}</span>
                    <span className="ww-metric-value ww-text-teal">{TICKET_CONTENT.justNowText}</span>
                    <span className="ww-metric-sub">{TICKET_CONTENT.updatingNotice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Check Later Notice Bar */}
            <div className="ww-check-later-bar">
              <div className="ww-check-later-left">
                <div className="ww-check-later-icon" aria-hidden="true">
                  <InfoIcon size={24} />
                </div>
                <div className="ww-check-later-text">
                  <h4 className="ww-check-later-title">{TICKET_CONTENT.checkLater.title}</h4>
                  <p className="ww-check-later-desc">
                    {TICKET_CONTENT.checkLater.textPrefix} ({ticketCode}).
                  </p>
                </div>
              </div>
              <Link
                to="/track"
                state={ticketData}
                className="ww-track-queue-pill-btn"
                id="ticket-track-queue-button"
              >
                <TicketIcon size={18} />
                <span>{TICKET_CONTENT.checkLater.buttonLabel}</span>
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>

          {/* Right Column: Quick Information & Helpful Tips */}
          <aside className="ww-ticket-right" aria-label="Ticket details">
            <QuickInfoCard
              title={TICKET_CONTENT.quickInfoTitle}
              service={service.name}
              facility={facility.name}
              ticketNumber={ticketCode}
              currentPosition={queueMetrics.positionOrdinal}
              peopleAhead={queueMetrics.peopleAhead}
              estimatedWaitTime={queueMetrics.estimatedWaitText}
            />

            <HelpfulTipsCard isScreen5={false} />
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
                {TICKET_CONTENT.thankYouBanner.title}
              </span>
              <span className="ww-reassurance-subtitle">
                {TICKET_CONTENT.thankYouBanner.subtitle}
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

export default TicketPage;
