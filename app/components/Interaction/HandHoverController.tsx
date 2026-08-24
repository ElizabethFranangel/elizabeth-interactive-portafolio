"use client";

import {
  useEffect,
} from "react";

import {
  useInteraction,
} from "./InteractionContext";

export default function HandHoverController() {
  const {
    pointerRef,
    inputMode,
    handTrackingEnabled,
    gestureStateRef,
  } = useInteraction();

  useEffect(() => {
    /*
     * Este controlador solamente funciona
     * cuando estamos usando las manos.
     */
    if (
      inputMode !== "hands" ||
      !handTrackingEnabled
    ) {
      return;
    }

    let animationFrameId = 0;

    let previousTarget:
      HTMLElement | null =
      null;

    const detectHover = () => {
      if (gestureStateRef.current.gesture !== "point") {
        if (gestureStateRef.current.gesture !== "pinch") {
          previousTarget?.classList.remove("hand-hover-active");
          previousTarget = null;
        }
        animationFrameId = requestAnimationFrame(detectHover);
        return;
      }
      /*
       * Convertimos nuestra posición
       * normalizada de la mano:
       *
       * 0...1
       *
       * a píxeles de pantalla.
       */

      const handX =
        pointerRef.current.x *
        window.innerWidth;

      const handY =
        pointerRef.current.y *
        window.innerHeight;

      /*
       * Buscamos únicamente elementos
       * que nosotros hayamos marcado
       * explícitamente como interactivos.
       */

      const elements =
        document.querySelectorAll<HTMLElement>(
          "[data-hand-target]"
        );

      let closestElement:
        HTMLElement | null =
        null;

      let closestDistance =
        Infinity;

      /*
       * No queremos exigir que la mano
       * esté exactamente encima del texto.
       *
       * Este radio crea una pequeña
       * zona de proximidad.
       */
      const ACTIVATION_DISTANCE =
        42;

      for (const element of Array.from(elements)) {
          const rect =
            element.getBoundingClientRect();

          if (
            rect.bottom < 0 ||
            rect.top > window.innerHeight ||
            rect.right < 0 ||
            rect.left > window.innerWidth
          ) {
            continue;
          }

          /*
           * Centro del elemento.
           */
          const dx =
            handX < rect.left
              ? rect.left - handX
              : handX > rect.right
                ? handX - rect.right
                : 0;

          const dy =
            handY < rect.top
              ? rect.top - handY
              : handY > rect.bottom
                ? handY - rect.bottom
                : 0;

          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );

          /*
           * Nos quedamos solamente
           * con el elemento más cercano.
           */
          if (
            distance <
              ACTIVATION_DISTANCE &&
            distance <
              closestDistance
          ) {
            closestDistance =
              distance;

            closestElement =
              element;
          }
      }

      /*
       * Si cambiamos de elemento,
       * apagamos el anterior.
       */

      if (
        previousTarget &&
        previousTarget !==
          closestElement
      ) {
        previousTarget.classList.remove(
          "hand-hover-active"
        );
      }

      /*
       * Encendemos el nuevo.
       */

      if (
        closestElement &&
        previousTarget !==
          closestElement
      ) {
        closestElement.classList.add(
          "hand-hover-active"
        );
      }

      previousTarget =
        closestElement;

      animationFrameId =
        requestAnimationFrame(
          detectHover
        );
    };

    detectHover();

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      /*
       * Limpieza por si cambiamos
       * nuevamente a Mouse.
       */

      previousTarget?.classList.remove(
        "hand-hover-active"
      );
    };
  }, [
    inputMode,
    handTrackingEnabled,
    pointerRef,
    gestureStateRef,
  ]);

  return null;
}
