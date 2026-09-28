import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PatientHeader from "../../components/layout/PatientHeader";
import StepProgress from "../../components/patient/StepProgress";
import { CONFIRM_QUEUE_CONTENT } from "../../constants/patientContent";
import { DEFAULT_FACILITY_ID, INITIAL_SERVICES } from "../../constants/queueConstants";
import { getFacility, createQueueEntry, getServiceQueue } from "../../services/queueService.js";
import { getSelectedService, saveActiveTicket } from "../../utils/storage.js";
import { calculateQueuePosition } from "../../utils/queue.js";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StethoscopeIcon,
  FlaskIcon,
  PillIcon,
  XrayIcon,
  BuildingIcon,
  ClockIcon,
  TicketIcon,
  BellIcon,
  PhoneIcon,
  ShieldIcon,
  QuestionCircleIcon,
  BotanicalDecoration,
  CommunityIcon,
} from "../../components/common/Icons";

export function ConfirmQueuePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve selected service from navigation state or storage fallback
  const [service, setService] = useState(() => {
    return location.state?.service || getSelectedService() || INITIAL_SERVICES[0];
  });

  const [facility, setFacility] = useState({
    name: "Main Health Centre",
    location: "Lusaka",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queueMetrics, setQueueMetrics] = useState({
    position: 4,
    positionOrdinal: "4th in line",
    peopleAhead: 3,
    estimatedWaitText: "15 – 30 minutes",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const fac = await getFacility(DEFAULT_FACILITY_ID);
        if (isMounted && fac) {
          setFacility(fac);
        }
      } catch (err) {
        console.warn("Could not load facility details:", err);
      }

      try {
        const queueEntries = await getServiceQueue(DEFAULT_FACILITY_ID, service.id);
        const metrics = calculateQueuePosition(queueEntries, null);
        if (isMounted) {
          setQueueMetrics({
            position: metrics.position,
            positionOrdinal: `${metrics.positionOrdinal} in line`,
            peopleAhead: metrics.peopleAhead,
            estimatedWaitText: metrics.estimatedWaitText,
          });
        }
      } catch (err) {
        console.warn("Could not load dynamic queue position:", err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [service?.id]);

  const handleJoinQueue = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const ticketPrefix = service.code || "A";
      const result = await createQueueEntry({
        facilityId: DEFAULT_FACILITY_ID,
        serviceId: service.id,
        ticketPrefix,
      });

      const activeTicketData = {
        entryId: result.entryId || result.id,
        ticketCode: result.ticketCode,
        service,
        facility,
        createdAt: new Date().toISOString(),
        initialMetrics: queueMetrics,
      };

      // Persist active ticket locally for recovery
      saveActiveTicket(activeTicketData);

      // Navigate to Screen 4
      navigate("/ticket", { state: activeTicketData });
    } catch (err) {
      console.error("Error creating queue entry:", err);
      setIsSubmitting(false);
    }
  };

  const renderServiceIcon = (s) => {
    const code = (s?.code || "").toUpperCase();
    const id = (s?.id || "").toLowerCase();

    if (code === "B" || id.includes("lab")) return <FlaskIcon size={26} />;
    if (code === "C" || id.includes("pharm")) return <PillIcon size={26} />;
    if (code === "D" || id.includes("imag") || id.includes("xray")) return <XrayIcon size={26} />;
    return <StethoscopeIcon size={26} />;
  };

  const renderImportantIcon = (iconName) => {
    switch (iconName) {
      case "ticket":
        return <TicketIcon size={22} />;
      case "bell":
        return <BellIcon size={22} />;
      case "phone":
        return <PhoneIcon size={22} />;
      case "shield":
        return <ShieldIcon size={22} />;
      default:
        return null;
    }
  };

  return (
    <div className="ww-page-container">
      <PatientHeader />

      <main className="ww-main-content">
        {/* Top Bar: Back Link & 3-Step Indicator */}
        <div className="ww-confirm-top-bar">
          <Link to="/join" className="ww-back-link">
            <ArrowLeftIcon size={16} />
            <span>{CONFIRM_QUEUE_CONTENT.backLabel}</span>
          </Link>

          <StepProgress currentStep={2} />
        </div>

        {/* Two-Column Layout */}
        <div className="ww-confirm-layout">
          {/* Left Column */}
          <div className="ww-confirm-left">
            <span className="ww-page-tag">{CONFIRM_QUEUE_CONTENT.tag}</span>
            <h1 className="ww-confirm-title">{CONFIRM_QUEUE_CONTENT.title}</h1>
            <p className="ww-confirm-subtitle">
              {CONFIRM_QUEUE_CONTENT.subtitlePrefix} <strong>{service.name}</strong>.
            </p>

            {/* Selected Service Card */}
            <div className="ww-confirm-service-card">
              <div className="ww-confirm-service-header">
                <div className="ww-confirm-service-icon" aria-hidden="true">
                  {renderServiceIcon(service)}
                </div>
                <div className="ww-confirm-service-info">
                  <h2 className="ww-confirm-service-name">{service.name}</h2>
                  <p className="ww-confirm-service-desc">{service.description}</p>
                </div>
              </div>

              {/* Inner details row: Facility & Estimated Wait */}
              <div className="ww-confirm-details-panel">
                <div className="ww-confirm-detail-item">
                  <div className="ww-detail-icon-circle theme-blue" aria-hidden="true">
                    <BuildingIcon size={20} />
                  </div>
                  <div className="ww-detail-text">
                    <span className="ww-detail-label">Facility / Clinic</span>
                    <span className="ww-detail-value">{facility.name || "Main Health Centre"}</span>
                    {/* Only display address if present in Firestore; otherwise location */}
                    <span className="ww-detail-sub">
                      {facility.address || facility.location || "Lusaka"}
                    </span>
                  </div>
                </div>

                <div className="ww-confirm-detail-divider" aria-hidden="true" />

                <div className="ww-confirm-detail-item">
                  <div className="ww-detail-icon-circle theme-mint" aria-hidden="true">
                    <ClockIcon size={20} />
                  </div>
                  <div className="ww-detail-text">
                    <span className="ww-detail-label">Estimated wait time</span>
                    <span className="ww-detail-value">{queueMetrics.estimatedWaitText}</span>
                    <span className="ww-detail-sub">(may vary based on current queue)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information Section */}
            <div className="ww-important-info-section">
              <h3 className="ww-important-title">Important information</h3>
              <div className="ww-important-grid">
                {CONFIRM_QUEUE_CONTENT.importantInfo.map((item) => (
                  <div key={item.id} className="ww-important-card">
                    <div className="ww-important-icon-circle" aria-hidden="true">
                      {renderImportantIcon(item.icon)}
                    </div>
                    <h4 className="ww-important-card-title">{item.title}</h4>
                    <p className="ww-important-card-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help Link */}
            <div className="ww-confirm-support-link">
              <a href="#help" className="ww-support-link">
                <QuestionCircleIcon size={18} />
                <span>{CONFIRM_QUEUE_CONTENT.supportLink}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Queue Summary Card & Safe Notice */}
          <aside className="ww-confirm-right" aria-label="Queue Summary">
            <div className="ww-queue-summary-card">
              <h3 className="ww-summary-title">{CONFIRM_QUEUE_CONTENT.summary.title}</h3>

              <div className="ww-summary-items">
                <div className="ww-summary-row">
                  <div className="ww-summary-icon-circle" aria-hidden="true">
                    {renderServiceIcon(service)}
                  </div>
                  <div className="ww-summary-row-text">
                    <span className="ww-summary-label">Service</span>
                    <span className="ww-summary-value">{service.name}</span>
                  </div>
                </div>

                <div className="ww-summary-row">
                  <div className="ww-summary-icon-circle" aria-hidden="true">
                    <BuildingIcon size={20} />
                  </div>
                  <div className="ww-summary-row-text">
                    <span className="ww-summary-label">Facility</span>
                    <span className="ww-summary-value">{facility.name || "Main Health Centre"}</span>
                  </div>
                </div>

                <div className="ww-summary-row">
                  <div className="ww-summary-icon-circle" aria-hidden="true">
                    <ClockIcon size={20} />
                  </div>
                  <div className="ww-summary-row-text">
                    <span className="ww-summary-label">Estimated wait time</span>
                    <span className="ww-summary-value">{queueMetrics.estimatedWaitText}</span>
                  </div>
                </div>

                <div className="ww-summary-row">
                  <div className="ww-summary-icon-circle" aria-hidden="true">
                    <CommunityIcon size={20} />
                  </div>
                  <div className="ww-summary-row-text">
                    <span className="ww-summary-label">Current position</span>
                    <span className="ww-summary-value">{queueMetrics.positionOrdinal}</span>
                  </div>
                </div>

                <div className="ww-summary-row">
                  <div className="ww-summary-icon-circle" aria-hidden="true">
                    <CommunityIcon size={20} />
                  </div>
                  <div className="ww-summary-row-text">
                    <span className="ww-summary-label">People ahead</span>
                    <span className="ww-summary-value">{queueMetrics.peopleAhead}</span>
                  </div>
                </div>
              </div>

              {/* Primary Join Queue Button */}
              <button
                type="button"
                className="ww-join-queue-cta-btn"
                onClick={handleJoinQueue}
                disabled={isSubmitting}
                id="confirm-join-queue-button"
              >
                <span>{isSubmitting ? "Joining Queue..." : "Join Queue"}</span>
                <ArrowRightIcon size={18} />
              </button>

              <p className="ww-summary-disclaimer">
                By clicking this button, you agree to join the queue for {service.name} at{" "}
                {facility.name || "Main Health Centre"}.
              </p>
            </div>

            {/* Safe Notice Card */}
            <div className="ww-safe-info-card">
              <div className="ww-safe-card-header">
                <div className="ww-safe-icon-circle" aria-hidden="true">
                  <ShieldIcon size={22} />
                </div>
                <div className="ww-safe-card-text">
                  <h4 className="ww-safe-card-title">{CONFIRM_QUEUE_CONTENT.safeCard.title}</h4>
                  <p className="ww-safe-card-desc">{CONFIRM_QUEUE_CONTENT.safeCard.description}</p>
                </div>
              </div>
              <div className="ww-safe-card-leaves" aria-hidden="true">
                <BotanicalDecoration width={70} height={40} />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ConfirmQueuePage;
