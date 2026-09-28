import React from "react";
import { CONFIRM_QUEUE_CONTENT } from "../../constants/patientContent";

export function StepProgress({ currentStep = 2 }) {
  const steps = CONFIRM_QUEUE_CONTENT.steps;

  return (
    <nav className="ww-step-progress" aria-label="Queue registration progress">
      <ol className="ww-step-list">
        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <React.Fragment key={step.number}>
              <li
                className={`ww-step-item ${
                  isCompleted ? "completed" : isCurrent ? "active" : "upcoming"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <div className="ww-step-circle">
                  {isCompleted ? (
                    <span className="ww-step-check">✓</span>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span className="ww-step-label">{step.label}</span>
              </li>

              {idx < steps.length - 1 && (
                <div
                  className={`ww-step-line ${
                    step.number < currentStep ? "completed" : ""
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default StepProgress;
