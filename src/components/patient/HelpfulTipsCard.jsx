import React from "react";
import {
  LightbulbIcon,
  PhoneRingIcon,
  WifiIcon,
  CalendarClockIcon,
} from "../common/Icons";

export function HelpfulTipsCard({ isScreen5 = false }) {
  const tip1Title = isScreen5 ? "Keep your phone on" : "Keep your phone nearby";

  return (
    <div className="ww-helpful-tips-card">
      <div className="ww-helpful-tips-header">
        <div className="ww-helpful-tips-icon" aria-hidden="true">
          <LightbulbIcon size={20} />
        </div>
        <h3 className="ww-helpful-tips-title">Helpful tips</h3>
      </div>

      <div className="ww-helpful-tips-list">
        {/* Tip 1 */}
        <div className="ww-tip-item">
          <div className="ww-tip-icon-circle" aria-hidden="true">
            <PhoneRingIcon size={18} />
          </div>
          <div className="ww-tip-content">
            <h4 className="ww-tip-title">{tip1Title}</h4>
            <p className="ww-tip-desc">
              You'll get a notification when it's almost your turn.
            </p>
          </div>
        </div>

        {/* Tip 2 */}
        <div className="ww-tip-item">
          <div className="ww-tip-icon-circle" aria-hidden="true">
            <WifiIcon size={18} />
          </div>
          <div className="ww-tip-content">
            <h4 className="ww-tip-title">No internet? No problem.</h4>
            <p className="ww-tip-desc">
              Your ticket is saved and will still be valid when you reconnect.
            </p>
          </div>
        </div>

        {/* Tip 3 */}
        <div className="ww-tip-item">
          <div className="ww-tip-icon-circle" aria-hidden="true">
            <CalendarClockIcon size={18} />
          </div>
          <div className="ww-tip-content">
            <h4 className="ww-tip-title">Need to leave?</h4>
            <p className="ww-tip-desc">
              You can return and track your queue at any time using your ticket number.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpfulTipsCard;
