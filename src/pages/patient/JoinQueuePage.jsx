import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PatientHeader from "../../components/layout/PatientHeader";
import { JOIN_QUEUE_CONTENT } from "../../constants/patientContent";
import { DEFAULT_FACILITY_ID } from "../../constants/queueConstants";
import { getServices } from "../../services/queueService";
import { saveSelectedService } from "../../utils/storage";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StethoscopeIcon,
  FlaskIcon,
  PillIcon,
  XrayIcon,
  InfoIcon,
  BotanicalDecoration,
} from "../../components/common/Icons";
import heroImage2 from "../../assets/hero-image-2.jpg";

export function JoinQueuePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState("general-consultation");

  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        const data = await getServices(DEFAULT_FACILITY_ID);
        if (isMounted) {
          setServices(data || []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
        if (isMounted) setLoading(false);
      }
    }
    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectService = (service) => {
    setSelectedServiceId(service.id);
    saveSelectedService(service);
    navigate("/confirm", { state: { service } });
  };

  const renderServiceIcon = (service) => {
    const code = (service.code || "").toUpperCase();
    const id = (service.id || "").toLowerCase();

    if (code === "B" || id.includes("lab")) {
      return <FlaskIcon size={26} />;
    }
    if (code === "C" || id.includes("pharm")) {
      return <PillIcon size={26} />;
    }
    if (code === "D" || id.includes("imag") || id.includes("xray") || id.includes("x-ray")) {
      return <XrayIcon size={26} />;
    }
    return <StethoscopeIcon size={26} />;
  };

  const getThemeClass = (service) => {
    const code = (service.code || "").toUpperCase();
    const id = (service.id || "").toLowerCase();

    if (code === "B" || id.includes("lab")) return "theme-blue";
    if (code === "C" || id.includes("pharm")) return "theme-purple";
    if (code === "D" || id.includes("imag") || id.includes("xray")) return "theme-cyan";
    return "theme-teal";
  };

  return (
    <div className="ww-page-container">
      <PatientHeader />

      <main className="ww-main-content">
        {/* Back Link */}
        <div className="ww-back-nav">
          <Link to="/" className="ww-back-link">
            <ArrowLeftIcon size={16} />
            <span>{JOIN_QUEUE_CONTENT.backLabel}</span>
          </Link>
        </div>

        {/* Hero / Header row */}
        <div className="ww-join-header">
          <div className="ww-join-header-text">
            <span className="ww-page-tag">{JOIN_QUEUE_CONTENT.tag}</span>
            <h1 className="ww-join-title">
              Select the service <br />
              you need.
            </h1>
            <p className="ww-join-subtitle">{JOIN_QUEUE_CONTENT.subtitle}</p>
          </div>
          <div className="ww-join-header-image" aria-hidden="true">
            <div className="ww-join-image-aura" />
            <img src={heroImage2} alt="" className="ww-join-hero-img" />
          </div>
        </div>

        {/* Service Cards Grid */}
        <section className="ww-services-grid" aria-label="Available healthcare services">
          {loading ? (
            <div className="ww-loading-state">Loading available services...</div>
          ) : (
            services.map((service) => {
              const isSelected = selectedServiceId === service.id;
              const theme = getThemeClass(service);

              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className={`ww-service-card ${theme} ${isSelected ? "selected" : ""}`}
                  aria-pressed={isSelected}
                  id={`service-${service.id}`}
                >
                  <div className="ww-service-icon-circle" aria-hidden="true">
                    {renderServiceIcon(service)}
                  </div>
                  <h2 className="ww-service-name">{service.name}</h2>
                  <p className="ww-service-desc">{service.description}</p>
                  <div className="ww-service-arrow-btn" aria-hidden="true">
                    <ArrowRightIcon size={16} />
                  </div>
                </button>
              );
            })
          )}
        </section>

        {/* Need Help Banner */}
        <div className="ww-need-help-banner" role="complementary">
          <div className="ww-need-help-left">
            <div className="ww-need-help-icon" aria-hidden="true">
              <InfoIcon size={24} />
            </div>
            <div className="ww-need-help-divider" aria-hidden="true" />
            <div className="ww-need-help-text">
              <span className="ww-need-help-title">
                {JOIN_QUEUE_CONTENT.needHelp.title}
              </span>
              <span className="ww-need-help-subtitle">
                {JOIN_QUEUE_CONTENT.needHelp.subtitle}
              </span>
            </div>
          </div>
          <div className="ww-need-help-leaves" aria-hidden="true">
            <BotanicalDecoration width={88} height={46} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default JoinQueuePage;
