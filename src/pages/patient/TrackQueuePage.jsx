import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PatientHeader from "../../components/layout/PatientHeader";
import TicketCard from "../../components/patient/TicketCard";
import QueueProgressDots from "../../components/patient/QueueProgressDots";
import QuickInfoCard from "../../components/patient/QuickInfoCard";
import HelpfulTipsCard from "../../components/patient/HelpfulTipsCard";
import { TRACK_CONTENT } from "../../constants/patientContent";
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
  InfoIcon,
  HeartOutlineIcon,
  BotanicalDecoration,
  PhoneNotificationGraphic,
} from "../../components/common/Icons";

export function TrackQueuePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve active ticket from route state or recover from local storage
  const [ticketData, setTicketData] = useState(() => {
    return location.state || getActiveTicket() || {
      entryId: "temp_106",
      ticketCode: "A106",
      service: { id: "general-consultation", name: "General Consultation", code: "A" },
      facility: { name: "Main Health Centre", location: "Lusaka" },
    };
  });

  const [queueMetrics, setQueueMetrics] = useState({
    position: 4,
    positionOrdinal: "4th in line",
    peopleAhead: 3,
    estimatedWaitText: "15 – 30 minutes",
  });

  // Listen to Firestore real-time updates for entry status and service queue changes
  useEffect(() => {
    if (!ticketData?.entryId || !ticketData?.service?.id) return;

    const facilityId = ticketData.facility?.id || "main-health-centre";
    const serviceId = ticketData.service.id;

    // Initial fetch to ensure immediate display
    getServiceQueue(facilityId, serviceId).then((entries) => {
      const metrics = calculateQueuePosition(entries, ticketData.entryId || ticketData.ticketCode);
      setQueueMetrics({
        position: metrics.position,
        positionOrdinal: `${metrics.positionOrdinal} in line`,
        peopleAhead: metrics.peopleAhead,
        estimatedWaitText: metrics.estimatedWaitText,
      });

      // If already almost next on initial load, smoothly transition to Screen 6
      if (
        !location.state?.stayOnTrack &&
        ticketData.status !== "CALLED" &&
        ticketData.status !== "COMPLETED" &&
        (metrics.position <= 2 || metrics.peopleAhead <= 1)
      ) {
        navigate("/almost-next", { state: { ...ticketData } });
      }
    }).catch(err => console.warn("Initial queue fetch error:", err));

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

    // Real-time listener for other waiting patients to recalculate queue position dynamically
    const unsubscribeQueue = subscribeToServiceQueue(
      facilityId,
      serviceId,
      (entries) => {
        const metrics = calculateQueuePosition(entries, ticketData.entryId || ticketData.ticketCode);
        setQueueMetrics({
          position: metrics.position,
          positionOrdinal: `${metrics.positionOrdinal} in line`,
          peopleAhead: metrics.peopleAhead,
          estimatedWaitText: metrics.estimatedWaitText,
        });

        // If turn approaches (1 person ahead or 2nd in line), transition to Screen 6 Almost Next
        if (
          !location.state?.stayOnTrack &&
          ticketData.status !== "CALLED" &&
          ticketData.status !== "COMPLETED" &&
          (metrics.position <= 2 || metrics.peopleAhead <= 1)
        ) {
          navigate("/almost-next", { state: { ...ticketData } });
        }
      }
    );

    return () => {
      if (typeof unsubscribeEntry === "function") unsubscribeEntry();
      if (typeof unsubscribeQueue === "function") unsubscribeQueue();
    };
  }, [ticketData?.entryId, ticketData?.service?.id, navigate, location.state?.stayOnTrack]);

  const service = ticketData.service || { name: "General Consultation" };
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
            <span>{TRACK_CONTENT.backLabel}</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="ww-track-header">
          <span className="ww-page-tag">{TRACK_CONTENT.tag}</span>
          <h1 className="ww-track-title">{TRACK_CONTENT.title}</h1>
          <p className="ww-track-subtitle">{TRACK_CONTENT.subtitle}</p>
        </div>

        {/* Two-Column Grid */}
        <div className="ww-track-layout">
          {/* Left Column: Main Status Card & What Happens Next Banner */}
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
                    <span className="ww-track-position-label">{TRACK_CONTENT.positionLabel}</span>
                    <h2 className="ww-track-position-value">{queueMetrics.positionOrdinal}</h2>
                    <span className="ww-track-ahead-sub">
                      {queueMetrics.peopleAhead} {TRACK_CONTENT.aheadLabel}
                    </span>
                  </div>
                </div>

                {/* 8-Step Timeline Progress Dots */}
                <div className="ww-track-dots-container">
                  <QueueProgressDots currentPosition={queueMetrics.position} />
                </div>

                {/* Estimated Wait Time Row */}
                <div className="ww-track-wait-row">
                  <div className="ww-metric-icon-circle theme-mint" aria-hidden="true">
                    <ClockIcon size={22} />
                  </div>
                  <div className="ww-track-wait-text">
                    <span className="ww-metric-label">{TRACK_CONTENT.waitLabel}</span>
                    <span className="ww-metric-value">{queueMetrics.estimatedWaitText}</span>
                    <span className="ww-metric-sub">{TRACK_CONTENT.waitDisclaimer}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next Banner with smartphone illustration */}
            <div className="ww-what-next-banner">
              <div className="ww-what-next-left">
                <div className="ww-what-next-icon" aria-hidden="true">
                  <InfoIcon size={24} />
                </div>
                <div className="ww-what-next-text">
                  <h3 className="ww-what-next-title">{TRACK_CONTENT.whatNext.title}</h3>
                  <p className="ww-what-next-desc">{TRACK_CONTENT.whatNext.description}</p>
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
              title={TRACK_CONTENT.queueDetailsTitle}
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
              <span className="ww-reassurance-title">Thank you for choosing WaitWise.</span>
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

export default TrackQueuePage;
