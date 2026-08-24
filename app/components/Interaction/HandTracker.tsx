"use client";

import { useEffect, useRef } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useInteraction } from "./InteractionContext";
import { classifyHandGesture, GESTURE_CONFIG, HAND_DEBUG, type HandGesture } from "./handGestures";

type SwipeStart = { x: number; y: number; time: number };

const XNNPACK_INFO_MESSAGE =
  "Created TensorFlow Lite XNNPACK delegate for CPU";

function suppressXnnpackInfo() {
  const methods = ["error", "warn", "info", "log"] as const;
  const originals = new Map<(typeof methods)[number], (...args: unknown[]) => void>();
  const wrappers = new Map<(typeof methods)[number], (...args: unknown[]) => void>();

  methods.forEach((method) => {
    const original = console[method].bind(console) as (...args: unknown[]) => void;
    const wrapper = (...args: unknown[]) => {
      const message = args.map((argument) => String(argument)).join(" ");
      if (!message.includes(XNNPACK_INFO_MESSAGE)) original(...args);
    };

    originals.set(method, original);
    wrappers.set(method, wrapper);
    console[method] = wrapper;
  });

  return () => {
    methods.forEach((method) => {
      if (console[method] === wrappers.get(method)) {
        console[method] = originals.get(method)!;
      }
    });
  };
}

function nearestVisibleControl(selector: string, handY: number) {
  return Array.from(document.querySelectorAll<HTMLElement>(selector))
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
    })
    .sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return Math.abs(ar.top + ar.height / 2 - handY) - Math.abs(br.top + br.height / 2 - handY);
    })[0];
}

export default function HandTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { inputMode, handTrackingEnabled, setPointer, setGestureState, nextSection, previousSection } = useInteraction();

  useEffect(() => {
    if (inputMode !== "hands" || !handTrackingEnabled) {
      setGestureState({ gesture: "idle", confidence: 0, timestamp: performance.now(), pinchRatio: Infinity });
      return;
    }

    let stream: MediaStream | null = null;
    let landmarker: HandLandmarker | null = null;
    let frameId = 0;
    let cancelled = false;
    let stableGesture: HandGesture = "idle";
    let candidateGesture: HandGesture = "idle";
    let candidateSince = 0;
    let pinchSince: number | null = null;
    let pinchConfirmed = false;
    let pinchTarget: HTMLElement | null = null;
    let lastPinch = 0;
    let swipeStart: SwipeStart | null = null;
    let lastSwipe = 0;
    let lastDebug = 0;
    const timeouts = new Set<number>();
    const restoreConsole = suppressXnnpackInfo();

    const publish = (gesture: HandGesture, confidence: number, pinchRatio: number, now: number) => {
      setGestureState({ gesture, confidence, timestamp: now, pinchRatio });
    };

    const resetTracking = (now: number) => {
      stableGesture = "idle";
      candidateGesture = "idle";
      candidateSince = now;
      pinchSince = null;
      pinchConfirmed = false;
      pinchTarget = null;
      swipeStart = null;
      document.querySelector<HTMLElement>("[data-hand-target].hand-hover-active")?.classList.remove("hand-hover-active");
      publish("idle", 0, Infinity, now);
    };

    const confirmPinch = (now: number) => {
      if (pinchConfirmed || now - lastPinch < GESTURE_CONFIG.pinchCooldownMs) return;
      pinchConfirmed = true;
      lastPinch = now;
      const target = pinchTarget;
      if (!target) return;
      target.classList.add("hand-pinch-active");
      target.click();
      const timeout = window.setTimeout(() => {
        target.classList.remove("hand-pinch-active");
        timeouts.delete(timeout);
      }, 420);
      timeouts.add(timeout);
    };

    const processSwipe = (x: number, y: number, now: number) => {
      if (now - lastSwipe < GESTURE_CONFIG.swipeCooldownMs) return;
      if (!swipeStart) {
        swipeStart = { x, y, time: now };
        return;
      }
      const dx = x - swipeStart.x;
      const dy = y - swipeStart.y;
      const elapsed = now - swipeStart.time;
      if (elapsed > GESTURE_CONFIG.swipeMaxDurationMs) {
        swipeStart = { x, y, time: now };
        return;
      }
      const horizontal = Math.abs(dx) >= GESTURE_CONFIG.swipeMinDistance && Math.abs(dx) > Math.abs(dy) * GESTURE_CONFIG.directionRatio;
      const vertical = Math.abs(dy) >= GESTURE_CONFIG.swipeMinDistance && Math.abs(dy) > Math.abs(dx) * GESTURE_CONFIG.directionRatio;
      if (!horizontal && !vertical) return;

      if (vertical) {
        if (dy < 0) nextSection(); else previousSection();
      } else {
        nearestVisibleControl(dx > 0 ? "[data-hand-next]" : "[data-hand-prev]", y * innerHeight)?.click();
      }
      lastSwipe = now;
      swipeStart = null;
      if (HAND_DEBUG) console.debug("Hand swipe", { dx, dy, direction: horizontal ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up") });
    };

    const initialize = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
        if (cancelled) return;
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task" },
          runningMode: "VIDEO", numHands: 1,
          minHandDetectionConfidence: 0.6, minHandPresenceConfidence: 0.6, minTrackingConfidence: 0.6,
        });
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }, audio: false });
        if (cancelled || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const detect = () => {
          if (cancelled || !landmarker || !videoRef.current) return;
          const now = performance.now();
          if (videoRef.current.readyState >= 2) {
            const detectionResult = landmarker.detectForVideo(videoRef.current, now);
            const landmarks = detectionResult.landmarks[0];
            if (!landmarks) resetTracking(now);
            else {
              const result = classifyHandGesture(landmarks);
              if (result.gesture !== candidateGesture) {
                candidateGesture = result.gesture;
                candidateSince = now;
              }
              if (result.gesture === "pinch") stableGesture = "pinch";
              else if (candidateGesture !== stableGesture && now - candidateSince >= GESTURE_CONFIG.stabilizationMs) stableGesture = candidateGesture;

              const x = 1 - landmarks[8].x;
              const y = landmarks[8].y;
              publish(stableGesture, result.confidence, result.pinchRatio, now);
              if (stableGesture === "point" && result.gesture === "point") setPointer(x, y);

              if (stableGesture === "pinch" && result.gesture === "pinch") {
                swipeStart = null;
                if (pinchSince === null) {
                  pinchSince = now;
                  // Lock the intended element at pinch start so small pose
                  // changes during confirmation cannot redirect the click.
                  pinchTarget = document.querySelector<HTMLElement>(
                    "[data-hand-target].hand-hover-active",
                  );
                }
                if (now - pinchSince >= GESTURE_CONFIG.pinchHoldMs) confirmPinch(now);
              } else {
                if (result.pinchRatio >= GESTURE_CONFIG.pinchReleaseRatio) {
                  pinchSince = null;
                  pinchConfirmed = false;
                  pinchTarget = null;
                }
                if (stableGesture === "navigate" && result.gesture === "navigate") processSwipe(x, y, now);
                else swipeStart = null;
              }
              if (HAND_DEBUG && now - lastDebug >= GESTURE_CONFIG.debugIntervalMs) {
                lastDebug = now;
                console.debug("Hand gesture", { gesture: stableGesture, pinchRatio: result.pinchRatio, confidence: result.confidence });
              }
            }
          }
          frameId = requestAnimationFrame(detect);
        };
        detect();
      } catch (error) {
        console.error("Hand tracking error:", error);
        resetTracking(performance.now());
      }
    };

    initialize();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
      landmarker?.close();
      timeouts.forEach((timeout) => clearTimeout(timeout));
      restoreConsole();
      document.querySelectorAll(".hand-pinch-active, .hand-hover-active").forEach((element) => element.classList.remove("hand-pinch-active", "hand-hover-active"));
      resetTracking(performance.now());
    };
  }, [handTrackingEnabled, inputMode, nextSection, previousSection, setGestureState, setPointer]);

  return <video ref={videoRef} playsInline muted style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} />;
}
