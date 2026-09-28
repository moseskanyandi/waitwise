import React from "react";

export function QueueProgressDots({ currentPosition = 4, showPassedCheckmark = false }) {
  const steps = [1, 2, 3, 4, 5, 6, 7, "8+"];

  return (
    <div className="ww-queue-dots-wrapper" aria-label={`Queue timeline: step ${currentPosition} of 8`}>
      <div className="ww-queue-dots-line" aria-hidden="true" />
      <div className="ww-queue-dots-container">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isPassedOrActive = stepNumber <= currentPosition;
          const isPassed = stepNumber < currentPosition;
          const isCurrent = stepNumber === currentPosition;

          return (
            <div
              key={step}
              className={`ww-queue-dot ${
                isCurrent
                  ? "active current"
                  : isPassedOrActive
                  ? "active passed"
                  : "inactive"
              }`}
            >
              <span>{showPassedCheckmark && isPassed ? "✓" : step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QueueProgressDots;
