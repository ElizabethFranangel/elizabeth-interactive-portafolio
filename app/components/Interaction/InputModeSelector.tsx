"use client";

import {
  useInteraction,
} from "./InteractionContext";

export default function InputModeSelector({
  variant = "home",
}: {
  variant?: "home" | "navbar";
}) {
  const {
    inputMode,
    setInputMode,
    setHandTrackingEnabled,
  } = useInteraction();

  const activateMouse = () => {
    setHandTrackingEnabled(false);
    setInputMode("mouse");
  };

  const activateHands = () => {
    setInputMode("hands");
    setHandTrackingEnabled(true);
  };

  return (
    <div
      className={`input-mode-selector input-mode-selector--${variant}`}
      role="group"
      aria-label="Interaction method"
    >
      <span className="input-mode-label">Control</span>
      <div className="input-mode-toggle">
      <button
        type="button"
        onClick={activateMouse}
        aria-pressed={inputMode === "mouse"}
        aria-label="Use mouse controls"
        data-hand-target
        data-hand-style="box"
      >
        <span aria-hidden="true">↖</span> Mouse
      </button>

      <button
        type="button"
        onClick={activateHands}
        aria-pressed={inputMode === "hands"}
        aria-label="Use hand tracking controls"
        data-hand-target
        data-hand-style="box"
      >
        <span aria-hidden="true">◇</span> Hands
      </button>
      </div>
    </div>
  );
}
