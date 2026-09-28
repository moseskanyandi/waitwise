import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PatientHeader from "../../components/layout/PatientHeader";
import TicketCard from "../../components/patient/TicketCard";
import QueueProgressDots from "../../components/patient/QueueProgressDots";
import QuickInfoCard from "../../components/patient/QuickInfoCard";
import HelpfulTipsCard from "../../components/patient/HelpfulTipsCard";
import { ALMOST_NEXT_CONTENT } from "../../constants/patientContent";
import { getActiveTicket } from "../../utils/storage";
import {
  subscribeToQueueEntry,
  subscribeToServiceQueue,
  getServiceQueue,
} from "../../services/queueService";
import { calculateQueuePosition } from "../../utils/queue";
import {
  ArrowLeftIcon,
  CommunityIcon,
  ClockIcon,
  BellIcon,
  HeartOutlineIcon,
  BotanicalDecoration,
  PhoneNotificationGraphic,
} from "../../components/common/Icons";

export function AlmostNextPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve active ticket from route state or recover from local storage
  const [ticketData, setTicketData] = useState(() => {
    return (
      location.state ||
      getActiveTicket() || {
        entryId: "temp_106",
        ticketCode: "A106",
        service: { id: "general-consultation", name: "General Consultation", code: "A" },
        facility: { name: "Main Health Centre", location: "Lusaka" },
        status: "WAITING",
      }
    );
  });

  const [queueMetrics, setQueueMetrics] = useState({
    position: 2,
    positionOrdinal: "2nd in line",
    peopleAhead: 1,
    estimatedWaitText: "5 – 15 minutes",
  });

  // Listen to Firestore real-time updates for entry status and service queue changes
  useEffect(() => {
    if (!ticketData?.entryId || !ticketData?.service?.id) return;

    const facilityId = ticketData.facility?.id || "main-health-centre";
    const serviceId = ticketData.service.id;

    // Initial fetch to ensure accurate position calculation
    getServiceQueue(facilityId, serviceId)
      .then((entries) => {
        const metrics = calculateQueuePosition(
          entries,
          ticketData.entryId || ticketData.ticketCode
        );
        setQueueMetrics({
          position: metrics.position,
          positionOrdinal: `${metrics.positionOrdinal} in line`,
          peopleAhead: metrics.peopleAhead,
          estimatedWaitText: metrics.estimatedWaitText,
        });
      })
      .catch((err) => console.warn("Initial queue fetch error:", err));

    // Real-time listener for the entry status: automatically transition when CALLED or COMPLETED
    const unsubscribeEntry = subscribeToQueueEntry(
      ticketData.entryId,
      (entrySnap) => {
        if (!entrySnap) return;
        setTicketData((prev) => ({ ...prev, ...entrySnap }));

        if (entrySnap.status === "CALLED") {
          navigate("/called", { state: { ...ticketData, ...entrySnap } });
        } else if (entrySnap.status === "COMPLETED") {
          navigate("/complete", { state: { ...ticketData, ...entrySnap } });
        }
      }
    );

    // Real-time listener for waiting queue entries to recalculate queue position dynamically
    const unsubscribeQueue = subscribeToServiceQueue(
      facilityId,
      serviceId,
      (entries) => {
        const metrics = calculateQueuePosition(
          entries,
          ticketData.entryId || ticketData.ticketCode
        );
        setQueueMetrics({
          position: metrics.position,
          positionOrdinal: `${metrics.positionOrdinal} in line`,
          peopleAhead: metrics.peopleAhead,
          estimatedWaitText: metrics.estimatedWaitText,
        });
      }
    );

    return () => {
      if (typeof unsubscribeEntry === "function") unsubscribeEntry();
      if (typeof unsubscribeQueue === "function") unsubscribeQueue();
    };
  }, [ticketData?.entryId, ticketData?.service?.id, navigate]);

  const service = ticketData.service || { name: "General Consultation" };
  const facility = ticketData.facility || { name: "Main Health Centre" };
  const ticketCode = ticketData.ticketCode || "A106";

  return (
    <div className="ww-page-container">
      <PatientHeader />

      <main className="ww-main-content">
        {/* Top Back Link */}
        <div className="ww-back-nav">
          <Link to="/track" state={ticketData} className="ww-back-link">
            <ArrowLeftIcon size={16} />
            <span>{ALMOST_NEXT_CONTENT.backLabel}</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="ww-track-header">
          <span className="ww-page-tag">{ALMOST_NEXT_CONTENT.tag}</span>
          <h1 className="ww-track-title">{ALMOST_NEXT_CONTENT.title}</h1>
          <p className="ww-track-subtitle">
            {ALMOST_NEXT_CONTENT.subtitlePrefix}
            <strong>
              {queueMetrics.peopleAhead}{" "}
              {queueMetrics.peopleAhead === 1
                ? ALMOST_NEXT_CONTENT.aheadLabel
                : ALMOST_NEXT_CONTENT.aheadLabelPlural}
            </strong>{" "}
            {ALMOST_NEXT_CONTENT.subtitleSuffix}
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="ww-track-layout">
          {/* Left Column: Status Card + What to do now Banner */}
          <div className="ww-track-left">
            <div className="ww-track-status-card">
              {/* Ticket Cutout Card */}
              <div className="ww-track-ticket-wrap">
                <TicketCard
                  ticketCode={ticketCode}
                  serviceName={service.name}
                  facilityName={facility.name}
                  serviceIcon={service.icon || "stethoscope"}
                />
              </div>

              {/* Progress & Metrics */}
              <div className="ww-track-status-details">
                {/* Position Row */}
                <div className="ww-track-position-row">
                  <div className="ww-metric-icon-circle theme-teal" aria-hidden="true">
                    <CommunityIcon size={24} />
                  </div>
                  <div className="ww-track-position-text">
                    <span className="ww-track-position-label">
                      {ALMOST_NEXT_CONTENT.positionLabel}
                    </span>
                    <h2 className="ww-track-position-value">
                      {queueMetrics.positionOrdinal}
                    </h2>
                    <span className="ww-track-ahead-sub">
                      {queueMetrics.peopleAhead}{" "}
                      {queueMetrics.peopleAhead === 1
                        ? ALMOST_NEXT_CONTENT.aheadLabel
                        : ALMOST_NEXT_CONTENT.aheadLabelPlural}
                    </span>
                  </div>
                </div>

                {/* 8-Step Timeline Progress Dots (with passed checkmark) */}
                <div className="ww-track-dots-container">
                  <QueueProgressDots
                    currentPosition={queueMetrics.position}
                    showPassedCheckmark={true}
                  />
                </div>

                {/* Estimated Wait Time Row */}
                <div className="ww-track-wait-row">
                  <div className="ww-metric-icon-circle theme-mint" aria-hidden="true">
                    <ClockIcon size={22} />
                  </div>
                  <div className="ww-track-wait-text">
                    <span className="ww-metric-label">
                      {ALMOST_NEXT_CONTENT.waitLabel}
                    </span>
                    <span className="ww-metric-value">
                      {queueMetrics.estimatedWaitText}
                    </span>
                    <span className="ww-metric-sub">
                      {ALMOST_NEXT_CONTENT.waitDisclaimer}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* What to do now? Banner */}
            <div className="ww-what-next-banner ww-what-to-do-banner">
              <div className="ww-what-next-left">
                <div className="ww-what-next-icon ww-bell-icon-wrap" aria-hidden="true">
                  <BellIcon size={24} />
                </div>
                <div className="ww-what-next-text">
                  <h3 className="ww-what-next-title">
                    {ALMOST_NEXT_CONTENT.whatToDoNow.title}
                  </h3>
                  <p className="ww-what-next-desc">
                    {ALMOST_NEXT_CONTENT.whatToDoNow.descriptionPrefix}
                    <strong>{ticketCode}</strong>
                    {ALMOST_NEXT_CONTENT.whatToDoNow.descriptionSuffix}
                  </p>
                </div>
              </div>
              <div className="ww-what-next-graphic" aria-hidden="true">
                <PhoneNotificationGraphic width={90} height={75} />
              </div>
            </div>
          </div>

          {/* Right Column: Your Queue Details & Helpful Tips */}
          <aside className="ww-track-right" aria-label="Queue details">
            <QuickInfoCard
              title={ALMOST_NEXT_CONTENT.queueDetailsTitle}
              service={service.name}
              facility={facility.name}
              ticketNumber={ticketCode}
              currentPosition={queueMetrics.positionOrdinal}
              peopleAhead={queueMetrics.peopleAhead}
              estimatedWaitTime={queueMetrics.estimatedWaitText}
            />

            <HelpfulTipsCard isScreen5={true} />
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

export default AlmostNextPage;
