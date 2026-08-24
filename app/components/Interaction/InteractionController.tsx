"use client";

import {
  useEffect,
} from "react";

import {
  useInteraction,
} from "./InteractionContext";

export default function InteractionController() {
  const {
    inputMode,
    setPointer,
  } = useInteraction();

  useEffect(() => {
    if (
      inputMode !== "mouse"
    ) {
      return;
    }

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      const x =
        event.clientX /
        window.innerWidth;

      const y =
        event.clientY /
        window.innerHeight;

      setPointer(
        x,
        y
      );
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, [
    inputMode,
    setPointer,
  ]);

  useEffect(() => {
    if (inputMode !== "mouse") {
      document
        .querySelectorAll(".hand-hover-active")
        .forEach((element) => element.classList.remove("hand-hover-active"));
      return;
    }

    const pendingAnimations =
      new Set<number>();

    let hoveredTarget:
      HTMLElement | null =
      null;

    const findTarget = (
      eventTarget: EventTarget | null
    ) =>
      (eventTarget as Element | null)?.closest<HTMLElement>(
        "[data-hand-target]"
      ) ?? null;

    const handlePointerOver = (
      event: MouseEvent
    ) => {
      const target =
        findTarget(event.target);

      if (
        target === hoveredTarget
      ) {
        return;
      }

      hoveredTarget?.classList.remove(
        "hand-hover-active"
      );

      hoveredTarget = target;

      hoveredTarget?.classList.add(
        "hand-hover-active"
      );
    };

    const handlePointerOut = (
      event: MouseEvent
    ) => {
      if (
        !hoveredTarget
      ) {
        return;
      }

      const nextTarget =
        findTarget(event.relatedTarget);

      if (
        nextTarget === hoveredTarget
      ) {
        return;
      }

      hoveredTarget.classList.remove(
        "hand-hover-active"
      );

      hoveredTarget = null;
    };

    const handlePointerDown = (
      event: MouseEvent
    ) => {
      const target =
        (event.target as Element | null)?.closest<HTMLElement>(
          "[data-hand-target]"
        );

      if (!target) {
        return;
      }

      target.classList.remove(
        "hand-pinch-active"
      );

      // Reinicia la animación aunque se hagan clics consecutivos.
      void target.offsetWidth;

      target.classList.add(
        "hand-pinch-active"
      );

      const timeoutId =
        window.setTimeout(
          () => {
            target.classList.remove(
              "hand-pinch-active"
            );

            pendingAnimations.delete(
              timeoutId
            );
          },
          420
        );

      pendingAnimations.add(
        timeoutId
      );
    };

    window.addEventListener(
      "mousedown",
      handlePointerDown
    );

    window.addEventListener(
      "mouseover",
      handlePointerOver
    );

    window.addEventListener(
      "mouseout",
      handlePointerOut
    );

    return () => {
      window.removeEventListener(
        "mousedown",
        handlePointerDown
      );

      window.removeEventListener(
        "mouseover",
        handlePointerOver
      );

      window.removeEventListener(
        "mouseout",
        handlePointerOut
      );

      hoveredTarget?.classList.remove(
        "hand-hover-active"
      );

      pendingAnimations.forEach(
        (timeoutId) => {
          window.clearTimeout(
            timeoutId
          );
        }
      );

      document
        .querySelectorAll(
          ".hand-pinch-active"
        )
        .forEach((element) => {
          element.classList.remove(
            "hand-pinch-active"
          );
        });
    };
  }, [inputMode]);

  return null;
}
