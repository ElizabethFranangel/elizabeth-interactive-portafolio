import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type HandGesture = "idle" | "point" | "pinch" | "navigate" | "pause";

export interface GestureState {
  gesture: HandGesture;
  confidence: number;
  timestamp: number;
  pinchRatio: number;
}

export const HAND_DEBUG = false;

export const GESTURE_CONFIG = {
  stabilizationMs: 110,
  pinchHoldMs: 150,
  pinchCooldownMs: 420,
  pinchRatioThreshold: 0.38,
  pinchReleaseRatio: 0.52,
  swipeMinDistance: 0.14,
  swipeMaxDurationMs: 850,
  swipeCooldownMs: 700,
  directionRatio: 1.45,
  smoothing: 0.18,
  debugIntervalMs: 220,
} as const;

const distance = (a: NormalizedLandmark, b: NormalizedLandmark) =>
  Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));

const fingerExtended = (
  landmarks: NormalizedLandmark[],
  tip: number,
  pip: number,
  mcp: number,
) =>
  distance(landmarks[tip], landmarks[0]) >
  distance(landmarks[pip], landmarks[0]) * 1.08 &&
  distance(landmarks[tip], landmarks[mcp]) >
  distance(landmarks[pip], landmarks[mcp]) * 1.12;

export function classifyHandGesture(landmarks: NormalizedLandmark[]) {
  const palmScale = Math.max(
    distance(landmarks[0], landmarks[9]),
    distance(landmarks[5], landmarks[17]),
    0.001,
  );
  const pinchRatio = distance(landmarks[4], landmarks[8]) / palmScale;
  const extended = [
    fingerExtended(landmarks, 8, 6, 5),
    fingerExtended(landmarks, 12, 10, 9),
    fingerExtended(landmarks, 16, 14, 13),
    fingerExtended(landmarks, 20, 18, 17),
  ];
  const extendedCount = extended.filter(Boolean).length;
  const pinchIsIntentional =
    pinchRatio <= GESTURE_CONFIG.pinchRatioThreshold &&
    distance(landmarks[8], landmarks[0]) > palmScale * 1.08;

  // An opposed thumb/index away from the palm is an intentional pinch,
  // even when the other fingers are naturally curled. A compact hand stays pause.
  if (pinchIsIntentional) {
    return { gesture: "pinch" as const, confidence: 0.95, pinchRatio };
  }
  if (extendedCount === 0) return { gesture: "pause" as const, confidence: 0.9, pinchRatio };
  if (extendedCount === 4) return { gesture: "navigate" as const, confidence: 0.92, pinchRatio };
  if (extended[0] && !extended[2] && !extended[3] && !extended[1]) {
    return { gesture: "point" as const, confidence: 0.9, pinchRatio };
  }
  return { gesture: "idle" as const, confidence: 0.45, pinchRatio };
}
