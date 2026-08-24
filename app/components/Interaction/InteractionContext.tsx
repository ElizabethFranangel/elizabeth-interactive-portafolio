"use client";

import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GestureState } from "./handGestures";

/* =========================================================
   TIPOS
   ========================================================= */

export type InputMode =
  | "mouse"
  | "hands";

export type InteractionPointer = {
  x: number;
  y: number;
};

export type SynapseTarget = {
  /*
   * Coordenadas normalizadas de pantalla.
   *
   * x:
   * 0 = izquierda
   * 1 = derecha
   *
   * y:
   * 0 = arriba
   * 1 = abajo
   */
  x: number;
  y: number;

  /*
   * Intensidad visual de la conexión.
   *
   * 0 = débil
   * 1 = fuerte
   */
  strength: number;
};

type InteractionState = {
  /* =======================================================
     PUNTERO GLOBAL
     ======================================================= */

  pointerRef:
    RefObject<InteractionPointer>;
 
  setPointer: ( x: number, y: number) => void;


  /* =======================================================
     OBJETIVOS DE SINAPSIS
     ======================================================= */

  synapseTargetsRef: RefObject< SynapseTarget[] >;
  setSynapseTargets: ( targets: SynapseTarget[] ) => void;


  /* =======================================================
     EXPANSIÓN
     ======================================================= */

  expansion: number;
  setExpansion: (value: number ) => void;


  /* =======================================================
     NAVEGACIÓN
     ======================================================= */

  currentSection: number;

  setCurrentSection: ( value: number ) => void;
  nextSection: () => void;
  previousSection: () => void;

  /* =======================================================
     MÉTODO DE INTERACCIÓN
     ======================================================= */

  inputMode: InputMode;

  setInputMode: ( mode: InputMode ) => void;

  /* =======================================================
     HAND TRACKING
     ======================================================= */

  handTrackingEnabled: boolean;

  setHandTrackingEnabled: ( enabled: boolean ) => void;
  gestureStateRef: RefObject<GestureState>;
  setGestureState: (state: GestureState) => void;
};


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const SECTION_COUNT = 7;

/* =========================================================
   CONTEXTO
   ========================================================= */

const InteractionContext = createContext< InteractionState | undefined >(undefined);


/* =========================================================
   PROVIDER
   ========================================================= */

export function InteractionProvider({
  children,
}: {
  children:
    ReactNode;
}) {

  /* =======================================================
     PUNTERO
     ======================================================= */

  /*
   * Usamos useRef porque esta posición
   * puede cambiar muchas veces por segundo
   * mediante mouse o cámara.
   *
   * Así evitamos renders de React
   * en cada frame.
   */

  const pointerRef = useRef<InteractionPointer>({ x: 0.5, y: 0.5, });


  /*
   * Actualiza la posición del puntero
   * asegurándonos de mantener valores
   * entre 0 y 1.
   */

  const setPointer = useCallback(
      (
        x: number,
        y: number
      ) => {
        pointerRef
          .current.x = Math.min( 1, Math.max( 0, x ) );

        pointerRef
          .current.y = Math.min( 1, Math.max( 0, y ));
      },
      []
    );


  /* =======================================================
     SINAPSIS
     ======================================================= */

  /*
   * Solo guardamos hasta
   * cuatro partículas candidatas.
   *
   * OrbScene las actualiza
   * en cada frame.
   *
   * HandCursor las consulta
   * sin provocar renders.
   */

  const synapseTargetsRef = useRef< SynapseTarget[] >([]);


  const setSynapseTargets = useCallback(
      (
        targets: SynapseTarget[] 
      ) => {
        synapseTargetsRef .current = targets.slice( 0, 4 );
      },
      []
    );


  /* =======================================================
     EXPANSIÓN
     ======================================================= */

  const [ expansion, setExpansionState, ] = useState( 1 );
  const setExpansion = useCallback(
      (
        value: number
      ) => {
        const safeValue =
          Math.min(
            1,
            Math.max(
              0,
              value
            )
          );

        setExpansionState(
          safeValue
        );
      },
      []
    );


  /* =======================================================
     SECCIÓN ACTUAL
     ======================================================= */

  const [
    currentSection,
    setCurrentSectionState,
  ] = useState(
    0
  );


  const setCurrentSection =
    useCallback(
      (
        value: number
      ) => {
        const safeValue =
          Math.min(
            SECTION_COUNT -
              1,
            Math.max(
              0,
              value
            )
          );

        setCurrentSectionState(
          safeValue
        );
      },
      []
    );


  const nextSection =
    useCallback(
      () => {
        setCurrentSectionState(
          (
            current
          ) =>
            Math.min(
              SECTION_COUNT -
                1,
              current + 1
            )
        );
      },
      []
    );


  const previousSection =
    useCallback(
      () => {
        setCurrentSectionState(
          (
            current
          ) =>
            Math.max(
              0,
              current - 1
            )
        );
      },
      []
    );


  /* =======================================================
     MÉTODO DE ENTRADA
     ======================================================= */

  const [
    inputMode,
    setInputMode,
  ] =
    useState<InputMode>(
      "mouse"
    );

  const gestureStateRef = useRef<GestureState>({
    gesture: "idle",
    confidence: 0,
    timestamp: 0,
    pinchRatio: Infinity,
  });
  const setGestureState = useCallback((state: GestureState) => {
    gestureStateRef.current = state;
  }, []);


  /* =======================================================
     HAND TRACKING
     ======================================================= */

  const [
    handTrackingEnabled,
    setHandTrackingEnabled,
  ] =
    useState(
      false
    );


  /* =======================================================
     VALUE
     ======================================================= */

  const value =
    useMemo(
      () => ({
        /* Puntero */
        pointerRef,
        setPointer,

        /* Sinapsis */
        synapseTargetsRef,
        setSynapseTargets,

        /* Expansión */
        expansion,
        setExpansion,

        /* Navegación */
        currentSection,
        setCurrentSection,
        nextSection,
        previousSection,

        /* Método de entrada */
        inputMode,
        setInputMode,

        /* Cámara */
        handTrackingEnabled,
        setHandTrackingEnabled,
        gestureStateRef,
        setGestureState,
      }),
      [
        expansion,
        currentSection,
        inputMode,
        handTrackingEnabled,
        setPointer,
        setSynapseTargets,
        setExpansion,
        setCurrentSection,
        nextSection,
        previousSection,
        setGestureState,
      ]
    );


  /* =======================================================
     PROVIDER
     ======================================================= */

  return (
    <InteractionContext.Provider
      value={
        value
      }
    >
      {children}
    </InteractionContext.Provider>
  );
}


/* =========================================================
   HOOK
   ========================================================= */

export function useInteraction() {
  const context =
    useContext(
      InteractionContext
    );

  if (
    !context
  ) {
    throw new Error(
      "useInteraction must be used inside InteractionProvider"
    );
  }

  return context;
}
