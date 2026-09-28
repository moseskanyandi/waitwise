import React from "react";
import { Link } from "react-router-dom";
import { BRAND, NAV_LINKS } from "../../constants/patientContent";
import waitwiseLogo from "../../assets/waitwise-logo.png";
import { GlobeIcon, ChevronDownIcon } from "../common/Icons";

export function PatientHeader() {
  return (
    <header className="ww-header">
      <div className="ww-header-inner">
        {/* Brand Logo & Tagline using supplied WaitWise logo asset */}
        <Link to="/" className="ww-brand" aria-label="WaitWise Home">
          <img
            src={waitwiseLogo}
            alt="WaitWise Logo"
            className="ww-brand-logo-img"
          />
          <div className="ww-brand-text">
            <span className="ww-brand-name">{BRAND.name}</span>
            <span className="ww-brand-tagline">{BRAND.tagline}</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="ww-nav" aria-label="Patient navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`ww-nav-link ${link.active ? "active" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Language Selector */}
        <button
          type="button"
          className="ww-lang-pill"
          aria-label="Language selection: English"
        >
          <GlobeIcon size={16} />
          <span>English</span>
          <ChevronDownIcon size={14} />
        </button>
      </div>
    </header>
  );
}

export default PatientHeader;
