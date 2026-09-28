import React from "react";
import { HOME_CONTENT } from "../../constants/patientContent";
import { HeartOutlineIcon, BotanicalDecoration } from "../common/Icons";

export function PatientFooterBanner() {
  const { title, subtitle } = HOME_CONTENT.reassuranceBanner;

  return (
    <div className="ww-reassurance-banner" role="complementary">
      <div className="ww-reassurance-left">
        <div className="ww-reassurance-icon">
          <HeartOutlineIcon size={24} />
        </div>
        <div className="ww-reassurance-divider" aria-hidden="true" />
        <div className="ww-reassurance-text">
          <span className="ww-reassurance-title">{title}</span>
          <span className="ww-reassurance-subtitle">{subtitle}</span>
        </div>
      </div>
      <div className="ww-reassurance-leaves" aria-hidden="true">
        <BotanicalDecoration width={90} height={46} />
      </div>
    </div>
  );
}

export default PatientFooterBanner;
