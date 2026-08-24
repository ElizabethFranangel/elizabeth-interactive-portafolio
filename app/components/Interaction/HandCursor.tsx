"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  useInteraction,
} from "./InteractionContext";

import styles from "./HandCursor.module.css";

const CONNECTION_COUNT = 4;

export default function HandCursor() {
  const cursorRef =
    useRef<HTMLDivElement>(
      null
    );

  const connectionRefs =
    useRef<
      Array<HTMLDivElement | null>
    >([]);

  const {
    pointerRef,
    synapseTargetsRef,
    inputMode,
    handTrackingEnabled,
    gestureStateRef,
  } = useInteraction();

  useEffect(() => {
    if (
      inputMode !== "hands" ||
      !handTrackingEnabled
    ) {
      return;
    }

    let animationFrameId = 0;

    let currentX =
      pointerRef.current.x;

    let currentY =
      pointerRef.current.y;

    const animate = () => {
      const cursor =
        cursorRef.current;

      if (!cursor) {
        return;
      }

      cursor.dataset.gesture = gestureStateRef.current.gesture;

      const targetX =
        pointerRef.current.x;

      const targetY =
        pointerRef.current.y;

      const smoothing =
        0.18;

      currentX +=
        (targetX - currentX) *
        smoothing;

      currentY +=
        (targetY - currentY) *
        smoothing;

      const screenX =
        currentX *
        window.innerWidth;

      const screenY =
        currentY *
        window.innerHeight;

      cursor.style.transform =
        `translate3d(${screenX}px, ${screenY}px, 0)`;

      const targets =
        synapseTargetsRef.current;

      for (
        let i = 0;
        i < CONNECTION_COUNT;
        i++
      ) {
        const connection =
          connectionRefs.current[i];

        if (!connection) {
          continue;
        }

        const target =
          targets[i];

        if (!target) {
          connection.style.opacity =
            "0";
          continue;
        }

        const targetScreenX =
          target.x *
          window.innerWidth;

        const targetScreenY =
          target.y *
          window.innerHeight;

        const dx =
          targetScreenX - screenX;

        const dy =
          targetScreenY - screenY;

        const distance =
          Math.sqrt(
            dx * dx +
              dy * dy
          );

        const angle =
          Math.atan2(
            dy,
            dx
          ) *
          (180 / Math.PI);

        const opacity =
          0.32 +
          target.strength *
            0.68;

        connection.style.width =
          `${distance}px`;

        connection.style.opacity =
          `${opacity}`;

        connection.style.transform =
          `translate(0, -50%) rotate(${angle}deg)`;

        connection.style.filter =
          `drop-shadow(0 0 ${4 + target.strength * 8}px rgba(182, 151, 134, 0.32))`;
      }

      animationFrameId =
        requestAnimationFrame(
          animate
        );
    };

    animate();

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );
    };
  }, [
    inputMode,
    handTrackingEnabled,
    pointerRef,
    synapseTargetsRef,
    gestureStateRef,
  ]);

  if (
    inputMode !== "hands" ||
    !handTrackingEnabled
  ) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
      data-gesture="idle"
      aria-hidden="true"
    >
      {Array.from({
        length:
          CONNECTION_COUNT,
      }).map(
        (_, index) => (
          <div
            key={index}
            ref={(element) => {
              connectionRefs.current[
                index
              ] = element;
            }}
            className={
              styles.connection
            }
          >
            <span
              className={
                styles.connectionNode
              }
            />
          </div>
        )
      )}

      <div
        className={
          styles.outerHalo
        }
      />

      <div
        className={styles.soma}
      >
        <div
          className={
            styles.somaCore
          }
        />
      </div>

      <span
        className={`${styles.microParticle} ${styles.microOne}`}
      />

      <span
        className={`${styles.microParticle} ${styles.microTwo}`}
      />

      <span
        className={`${styles.microParticle} ${styles.microThree}`}
      />
    </div>
  );
}
