"use client";

import {
  useEffect,
} from "react";

import {
  useInteraction,
} from "./InteractionContext";

export default function SectionNavigator() {
  const {
    nextSection,
    previousSection,
  } = useInteraction();

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "ArrowRight"
      ) {
        nextSection();
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        previousSection();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    nextSection,
    previousSection,
  ]);

  return null;
}
