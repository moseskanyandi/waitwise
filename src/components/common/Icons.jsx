import React from "react";

export function GlobeIcon({ className = "", size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "", size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "", size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function UserPlusIcon({ className = "", size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="7" r="4" />
      <path d="M3 20c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6" />
      <line x1="19" y1="11" x2="19" y2="17" />
      <line x1="16" y1="14" x2="22" y2="14" />
    </svg>
  );
}

export function TicketIcon({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.5 8.5a2.5 2.5 0 0 1 2.5-2.5h12a2.5 2.5 0 0 1 2.5 2.5v1a2 2 0 0 0 0 4v1a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5v-1a2 2 0 0 0 0-4v-1z" transform="rotate(-30 12 12)" />
      <line x1="10" y1="9" x2="14" y2="15" strokeDasharray="2 2" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "", size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ClockIcon({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 12" />
    </svg>
  );
}

export function ShieldIcon({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function HeartPulseIcon({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.5 13.572L12 21l-7.5-7.428A5 5 0 1 1 12 7.006a5 5 0 1 1 7.5 6.572" />
      <path d="M7.5 12.5h2.5l1.5-3 2 6 1.5-3h2.5" />
    </svg>
  );
}

export function CommunityIcon({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="11" r="3.8" />
      <path d="M9.5 24.5c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <circle cx="9" cy="12" r="3.2" />
      <path d="M4 23.5c0-2.8 2.2-5 5-5" />
      <circle cx="23" cy="12" r="3.2" />
      <path d="M23 18.5c2.8 0 5 2.2 5 5" />
    </svg>
  );
}

export function StethoscopeIcon({ className = "", size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.5 3v5a5.5 5.5 0 0 0 11 0V3" />
      <path d="M4.5 3h2" />
      <path d="M13.5 3h2" />
      <path d="M10 13.5v3.5a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3v-1" />
      <circle cx="17" cy="15" r="2" />
    </svg>
  );
}

export function FlaskIcon({ className = "", size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 2v4.5L4.2 18a2 2 0 0 0 1.8 2.8h12a2 2 0 0 0 1.8-2.8L14 6.5V2" />
      <line x1="8.5" y1="2" x2="15.5" y2="2" />
      <line x1="6.5" y1="14" x2="17.5" y2="14" />
    </svg>
  );
}

export function PillIcon({ className = "", size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.5 20.5l-6-6a5 5 0 0 1 7-7l6 6a5 5 0 0 1-7 7z" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
    </svg>
  );
}

export function XrayIcon({ className = "", size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="12" y1="6" x2="12" y2="18" />
      <path d="M8 8c2 1 6 1 8 0" />
      <path d="M7.5 11c2.5 1 6.5 1 9 0" />
      <path d="M8 14c2 1 6 1 8 0" />
    </svg>
  );
}

export function BuildingIcon({ className = "", size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <line x1="8" y1="6" x2="10" y2="6" />
      <line x1="14" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="10" y2="10" />
      <line x1="14" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="10" y2="14" />
      <line x1="14" y1="14" x2="16" y2="14" />
    </svg>
  );
}

export function BellIcon({ className = "", size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function PhoneIcon({ className = "", size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

export function PhoneRingIcon({ className = "", size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M10 6h4" />
      <circle cx="12" cy="17" r="1" />
      <path d="M21 7a4 4 0 0 1 0 6" />
      <path d="M3 7a4 4 0 0 0 0 6" />
    </svg>
  );
}

export function WifiIcon({ className = "", size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

export function CalendarClockIcon({ className = "", size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="17.5" cy="17.5" r="4.5" />
      <polyline points="17.5 15.5 17.5 17.5 19 17.5" />
    </svg>
  );
}

export function LightbulbIcon({ className = "", size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-7 7c0 2.6 1.4 4.8 3.5 6h7c2.1-1.2 3.5-3.4 3.5-6a7 7 0 0 0-7-7z" />
    </svg>
  );
}

export function SyncIcon({ className = "", size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21.5 2v6h-6" />
      <path d="M21.34 15.57a9 9 0 1 1-.57-8.38l6.73-5.19" />
    </svg>
  );
}

export function InfoIcon({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function QuestionCircleIcon({ className = "", size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function CheckBurstBadge({ className = "", size = 68 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Mint background circle */}
      <circle cx="34" cy="36" r="28" fill="#D6F5EE" />
      {/* Outer border ring */}
      <circle cx="34" cy="36" r="28" stroke="#A7E8DC" strokeWidth="1.5" />
      {/* Checkmark */}
      <path
        d="M24 36.5L31 43.5L44 29"
        stroke="#00828A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 3 radiant burst dash lines on top-right */}
      <line x1="49" y1="17" x2="55" y2="12" stroke="#00828A" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="43" y1="13" x2="44" y2="6" stroke="#00828A" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="23" x2="63" y2="23" stroke="#00828A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function PhoneNotificationGraphic({ className = "", width = 90, height = 75 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 90 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Mint circle glow behind */}
      <circle cx="50" cy="38" r="30" fill="#E3F6F5" />
      {/* Smartphone frame */}
      <rect
        x="32"
        y="12"
        width="34"
        height="52"
        rx="6"
        fill="#009688"
        stroke="#00828A"
        strokeWidth="2"
      />
      {/* Screen area */}
      <rect x="35" y="16" width="28" height="40" rx="3" fill="#E8FAF8" />
      {/* Home indicator bar */}
      <rect x="44" y="58" width="10" height="2" rx="1" fill="#FFFFFF" />
      {/* Bell icon inside screen */}
      <path
        d="M49 26a4 4 0 0 0-4 4c0 4.5-2 5.5-2 5.5h12s-2-1-2-5.5a4 4 0 0 0-4-4z"
        fill="#00828A"
      />
      <circle cx="49" cy="38" r="1.5" fill="#00828A" />
      {/* Sound broadcast waves on sides */}
      <line x1="22" y1="32" x2="26" y2="34" stroke="#00828A" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="40" x2="25" y2="40" stroke="#00828A" strokeWidth="2" strokeLinecap="round" />
      <line x1="72" y1="32" x2="68" y2="34" stroke="#00828A" strokeWidth="2" strokeLinecap="round" />
      <line x1="74" y1="40" x2="69" y2="40" stroke="#00828A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HeartOutlineIcon({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function BotanicalDecoration({ className = "", width = 96, height = 54 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 96 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 54C42 42 22 36 10 32C12 45 32 52 50 54Z"
        fill="#80DFD7"
        fillOpacity="0.7"
      />
      <path
        d="M50 54C47 38 45 26 42 16C37 26 42 42 50 54Z"
        fill="#88E6DD"
        fillOpacity="0.8"
      />
      <path
        d="M50 54C54 38 64 22 70 12C68 28 60 44 50 54Z"
        fill="#75D9D0"
        fillOpacity="0.75"
      />
      <path
        d="M50 54C62 46 78 38 92 34C86 46 68 52 50 54Z"
        fill="#93ECE3"
        fillOpacity="0.7"
      />
    </svg>
  );
}

export function MegaphoneBurstBadge({ className = "", size = 68 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Mint background circle */}
      <circle cx="34" cy="36" r="28" fill="#D6F5EE" />
      {/* Outer border ring */}
      <circle cx="34" cy="36" r="28" stroke="#A7E8DC" strokeWidth="1.5" />
      {/* Megaphone / Bullhorn body */}
      <path
        d="M23 31H26L34 26V44L26 39H23C21.9 39 21 38.1 21 37V33C21 31.9 21.9 31 23 31Z"
        fill="#0a5c53"
        stroke="#0a5c53"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Megaphone handle */}
      <path
        d="M26 39L27 46H29L28 39"
        stroke="#0a5c53"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Sound waves emitted from megaphone */}
      <path
        d="M38 31C39.5 32.5 40.5 34.2 40.5 35C40.5 35.8 39.5 37.5 38 39"
        stroke="#0a5c53"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M42 27C44.5 29.5 46 32.2 46 35C46 37.8 44.5 40.5 42 43"
        stroke="#0a5c53"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* 3 radiant burst dash lines on top-right */}
      <line x1="49" y1="17" x2="55" y2="12" stroke="#0a5c53" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="43" y1="13" x2="44" y2="6" stroke="#0a5c53" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="23" x2="63" y2="23" stroke="#0a5c53" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function MapPinIcon({ className = "", size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function DocumentIcon({ className = "", size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function MessageCircleIcon({ className = "", size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="14" x2="13" y2="14" />
    </svg>
  );
}

export function StarIcon({ className = "", size = 16, filled = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function CheckCircleIcon({ className = "", size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
