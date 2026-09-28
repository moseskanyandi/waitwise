import React from "react";
import { HeartOutlineIcon } from "../common/Icons";

export function TakeCareCard({
  title = "Take care!",
  description = "Remember to follow any advice given by the healthcare team.",
}) {
  return (
    <div className="ww-take-care-card">
      <div className="ww-take-care-header">
        <div className="ww-take-care-icon" aria-hidden="true">
          <HeartOutlineIcon size={18} />
        </div>
        <h3 className="ww-take-care-title">{title}</h3>
      </div>
      <p className="ww-take-care-desc">{description}</p>
    </div>
  );
}

export default TakeCareCard;
