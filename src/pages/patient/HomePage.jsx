import React from "react";
import { Link } from "react-router-dom";
import PatientHeader from "../../components/layout/PatientHeader";
import PatientFooterBanner from "../../components/layout/PatientFooterBanner";
import { HOME_CONTENT } from "../../constants/patientContent";
import heroImg from "../../assets/hero-image.jpg";
import {
  UserPlusIcon,
  TicketIcon,
  ArrowRightIcon,
  ClockIcon,
  ShieldIcon,
  HeartPulseIcon,
  CommunityIcon,
} from "../../components/common/Icons";

export function HomePage() {
  const { heroBadge, heroSubtitle, actionCards, features } = HOME_CONTENT;

  // Render correct icon for each of the 4 features
  const renderFeatureIcon = (iconName) => {
    switch (iconName) {
      case "clock":
        return <ClockIcon size={24} />;
      case "shield":
        return <ShieldIcon size={24} />;
      case "heart-pulse":
        return <HeartPulseIcon size={24} />;
      case "users":
        return <CommunityIcon size={26} />;
      default:
        return null;
    }
  };

  return (
    <div className="ww-page-container">
      {/* Header */}
      <PatientHeader />

      <main className="ww-main-content">
        {/* Hero Section */}
        <section className="ww-hero" aria-labelledby="hero-title">
          <div className="ww-hero-content">
            <span className="ww-hero-badge">{heroBadge}</span>
            <h1 id="hero-title" className="ww-hero-title">
              Quality care, <br />
              <span className="ww-hero-title-accent">made simpler.</span>
            </h1>
            <p className="ww-hero-subtitle">{heroSubtitle}</p>

            {/* Action Cards */}
            <div className="ww-hero-actions">
              {/* Primary Action Card: Join a Queue */}
              <Link
                to={actionCards.join.path}
                className="ww-action-card ww-action-card-primary"
                id="join-queue-button"
              >
                <div className="ww-action-card-left">
                  <div className="ww-action-icon-circle" aria-hidden="true">
                    <UserPlusIcon size={24} />
                  </div>
                  <div className="ww-action-card-text">
                    <span className="ww-action-title">
                      {actionCards.join.title}
                    </span>
                    <span className="ww-action-subtitle">
                      {actionCards.join.subtitle}
                    </span>
                  </div>
                </div>
                <div className="ww-action-arrow-btn" aria-hidden="true">
                  <ArrowRightIcon size={18} />
                </div>
              </Link>

              {/* Secondary Action Card: Track My Queue */}
              <Link
                to={actionCards.track.path}
                className="ww-action-card ww-action-card-secondary"
                id="track-queue-button"
              >
                <div className="ww-action-card-left">
                  <div className="ww-action-icon-circle" aria-hidden="true">
                    <TicketIcon size={24} />
                  </div>
                  <div className="ww-action-card-text">
                    <span className="ww-action-title">
                      {actionCards.track.title}
                    </span>
                    <span className="ww-action-subtitle">
                      {actionCards.track.subtitle}
                    </span>
                  </div>
                </div>
                <div className="ww-action-arrow-btn" aria-hidden="true">
                  <ArrowRightIcon size={18} />
                </div>
              </Link>
            </div>
          </div>

          {/* Hero Visual using exact supplied hero-image.jpg */}
          <div className="ww-hero-visual">
            <div className="ww-hero-image-wrap">
              <img
                src={heroImg}
                alt="Patient smiling while checking queue on smartphone in modern clinic"
                className="ww-hero-img"
              />
            </div>
          </div>
        </section>

        {/* 4 Feature Columns */}
        <section
          className="ww-features-row"
          aria-label="WaitWise key advantages"
        >
          {features.map((feature, idx) => (
            <div key={feature.id} className="ww-feature-col">
              <div className="ww-feature-card">
                <div
                  className={`ww-feature-icon-badge ww-badge-${feature.badgeColor}`}
                  aria-hidden="true"
                >
                  {renderFeatureIcon(feature.icon)}
                </div>
                <h2 className="ww-feature-title">{feature.title}</h2>
                <p className="ww-feature-desc">{feature.description}</p>
              </div>
              {idx < features.length - 1 && (
                <div className="ww-feature-divider" aria-hidden="true" />
              )}
            </div>
          ))}
        </section>

        {/* Bottom Reassurance Banner */}
        <PatientFooterBanner />
      </main>
    </div>
  );
}

export default HomePage;
