import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PatientHeader from "../../components/layout/PatientHeader";
import TicketCard from "../../components/patient/TicketCard";
import QuickInfoCard from "../../components/patient/QuickInfoCard";
import HelpfulTipsCard from "../../components/patient/HelpfulTipsCard";
import { CALLED_CONTENT } from "../../constants/patientContent";
import { getActiveTicket } from "../../utils/storage";
import { subscribeToQueueEntry } from "../../services/queueService";
import {
  ArrowLeftIcon,
  CommunityIcon,
  BuildingIcon,
  MapPinIcon,
  CheckCircleIcon,
  HeartOutlineIcon,
  BotanicalDecoration,
  MegaphoneBurstBadge,
} from "../../components/common/Icons";

export function CalledPage() {
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
        status: "CALLED",
        room: "Room 3",
      }
    );
  });

  // Listen to Firestore real-time updates for entry status: transition when COMPLETED
  useEffect(() => {
    if (!ticketData?.entryId) return;

    const unsubscribeEntry = subscribeToQueueEntry(
      ticketData.entryId,
      (entrySnap) => {
        if (!entrySnap) return;
        setTicketData((prev) => ({ ...prev, ...entrySnap }));

        if (entrySnap.status === "COMPLETED") {
          navigate("/complete", { state: { ...ticketData, ...entrySnap } });
        }
      }
    );

    return () => {
      if (typeof unsubscribeEntry === "function") unsubscribeEntry();
    };
  }, [ticketData?.entryId, navigate]);

  const service = ticketData.service || { name: "General Consultation" };
  const facility = ticketData.facility || { name: "Main Health Centre" };
  const ticketCode = ticketData.ticketCode || "A106";
  const room = ticketData.room || ticketData.service?.room || "Room 3";

  return (
    <div className="ww-page-container">
      <PatientHeader />

      <main className="ww-main-content">
        {/* Top Back Link */}
        <div className="ww-back-nav">
          <Link to="/track" state={ticketData} className="ww-back-link">
            <ArrowLeftIcon size={16} />
            <span>{CALLED_CONTENT.backLabel}</span>
          </Link>
        </div>

        {/* Hero Header with Megaphone Burst Badge */}
        <div className="ww-called-hero">
          <div className="ww-called-badge-wrapper" aria-hidden="true">
            <MegaphoneBurstBadge size={72} />
          </div>
          <div className="ww-called-header-text">
            <span className="ww-called-eyebrow">{CALLED_CONTENT.eyebrow}</span>
            <h1 className="ww-called-title">
              {CALLED_CONTENT.titlePrefix}
              <strong>{service.name}</strong> — <strong>{room}</strong>.
            </h1>
            <p className="ww-called-subtitle">
              {CALLED_CONTENT.subtitlePrefix}
              <strong>{ticketCode}</strong>
              {CALLED_CONTENT.subtitleSuffix}
            </p>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="ww-called-layout">
          {/* Left Column: Status Card + Safe Place Banner */}
          <div className="ww-called-left">
            <div className="ww-called-status-card">
              {/* Ticket Cutout Card */}
              <div className="ww-called-ticket-wrap">
                <TicketCard
                  ticketCode={ticketCode}
                  serviceName={service.name}
                  facilityName={facility.name}
                  serviceIcon={service.icon || "stethoscope"}
                />
              </div>

              {/* Serving Area Details Panel */}
              <div className="ww-called-details-panel">
                <div className="ww-called-detail-row">
                  <div className="ww-called-detail-icon theme-teal" aria-hidden="true">
                    <CommunityIcon size={20} />
                  </div>
                  <div className="ww-called-detail-text">
                    <span className="ww-called-detail-label">Service</span>
                    <span className="ww-called-detail-value">{service.name}</span>
                  </div>
                </div>

                <div className="ww-called-detail-row">
                  <div className="ww-called-detail-icon theme-blue" aria-hidden="true">
                    <BuildingIcon size={20} />
                  </div>
                  <div className="ww-called-detail-text">
                    <span className="ww-called-detail-label">Facility</span>
                    <span className="ww-called-detail-value">{facility.name}</span>
                  </div>
                </div>

                <div className="ww-called-detail-row">
                  <div className="ww-called-detail-icon theme-cyan" aria-hidden="true">
                    <MapPinIcon size={20} />
                  </div>
                  <div className="ww-called-detail-text">
                    <span className="ww-called-detail-label">Room</span>
                    <span className="ww-called-detail-value">{room}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Safe Notice Banner */}
            <div className="ww-called-safe-banner" role="status">
              <div className="ww-called-safe-left">
                <div className="ww-called-safe-icon" aria-hidden="true">
                  <CheckCircleIcon size={24} />
                </div>
                <div className="ww-called-safe-text">
                  <h4 className="ww-called-safe-title">
                    {CALLED_CONTENT.safeNotice.title}
                  </h4>
                  <p className="ww-called-safe-desc">
                    {CALLED_CONTENT.safeNotice.subtitle}
                  </p>
                </div>
              </div>
              <div className="ww-called-safe-leaves" aria-hidden="true">
                <BotanicalDecoration width={75} height={42} />
              </div>
            </div>
          </div>

          {/* Right Column: Quick Details & Helpful Tips */}
          <aside className="ww-called-right" aria-label="Quick details">
            <QuickInfoCard
              title={CALLED_CONTENT.quickDetailsTitle}
              service={service.name}
              facility={facility.name}
              ticketNumber={ticketCode}
              currentPosition="Now Serving"
              peopleAhead={0}
              estimatedWaitTime="Now ready"
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

export default CalledPage;
