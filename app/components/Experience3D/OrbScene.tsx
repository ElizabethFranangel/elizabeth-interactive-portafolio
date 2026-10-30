"use client";
/* eslint-disable react-hooks/immutability */

import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import * as THREE from "three";

import {
  useInteraction,
} from "../Interaction/InteractionContext";


/* =========================================================
   CONFIGURACIÓN GENERAL
   ========================================================= */

const PARTICLE_COUNT = 1800;
const WATERMARK_COUNT = 320;

type Theme = "light" | "dark";


/*
 * Centro visual del portal.
 */

const PORTAL_X_FACTOR = 0.255;


/*
 * Radio de fotografía
 * y esfera compacta.
 */

const PHOTO_RADIUS = 1.30;
const COMPACT_SPHERE_RADIUS = 1.30;


/*
 * Halo.
 */

const PHOTO_BG_RADIUS = 1.34;
const HALO_INNER_RADIUS = 1.30;
const HALO_OUTER_RADIUS = 1.33;


/*
 * Partículas delanteras.
 */

const WATERMARK_RADIUS = 1.27;


/*
 * Área protegida del rostro.
 */

const PHOTO_CORE_PROTECTION = 0.68;


/*
 * Sinapsis.
 */

const MAX_SYNAPSE_DISTANCE = 1.5;
const MAX_SYNAPSE_TARGETS = 4;

/*
 * Generador pseudoaleatorio determinista. Las partículas conservan una
 * distribución orgánica, pero sus datos son idénticos en cada render.
 */
function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function getHeroVisualLayout(
  viewport: { width: number; height: number },
  size: { width: number; height: number }
) {
  const visual = document.querySelector<HTMLElement>("[data-hero-visual]");

  if (!visual) {
    return {
      x: viewport.width * PORTAL_X_FACTOR,
      y: 0.28,
      scale: 0.8,
    };
  }

  const rect = visual.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const worldDiameter = (rect.width / size.width) * viewport.width;

  return {
    x: (centerX / size.width - 0.5) * viewport.width,
    y: -(centerY / size.height - 0.5) * viewport.height,
    scale:
      (worldDiameter / (PHOTO_RADIUS * 2)) *
      (size.width <= 800 ? 0.62 : 0.9),
  };
}

function getAboutVisualLayout(
  viewport: { width: number; height: number },
  size: { width: number; height: number }
) {
  const portrait = document.querySelector<HTMLElement>("[data-about-portrait]");

  if (!portrait) {
    return { x: 0, y: 0, scale: SECTION_PORTAL_SCALE };
  }

  const rect = portrait.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const worldDiameter = (rect.width / size.width) * viewport.width;

  return {
    x: (centerX / size.width - 0.5) * viewport.width,
    y: -(centerY / size.height - 0.5) * viewport.height,
    scale: worldDiameter / (PHOTO_RADIUS * 2),
  };
}


/* =========================================================
   CONFIGURACIÓN DEL PORTAL EN ABOUT
   ========================================================= */

/*
 * HOME:
 * fotografía en tamaño normal.
 *
 * ABOUT:
 * fotografía más pequeña,
 * más tenue y más arriba.
 *
 * RESEARCH EN ADELANTE:
 * fotografía invisible.
 */

const SECTION_PORTAL_SCALE = 0.50;
const SECTION_PORTAL_OFFSET_X = 0.12;
const SECTION_PORTAL_OFFSET_Y = 0.78;


/* =========================================================
   CALCULAR EXPANSIÓN SEGÚN PUNTERO
   ========================================================= */

function getExpansionFromPointerDistance(
  viewport: {
    width: number;
    height: number;
  },

  pointer: {
    x: number;
    y: number;
  },

  portalX: number,

  portalY: number
) {
  const worldPointerX =
    (pointer.x - 0.5) *
    viewport.width;

  const worldPointerY =
    -(pointer.y - 0.5) *
    viewport.height;

  const dx =
    worldPointerX -
    portalX;

  const dy =
    worldPointerY -
    portalY;

  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );

  return THREE.MathUtils.smoothstep(
    distance,
    0.85,
    3.50
  );
}


/* =========================================================
   PARTÍCULAS PRINCIPALES
   ========================================================= */

function ParticleUniverse({ theme }: { theme: Theme }) {
  const pointsRef =
    useRef<THREE.Points>(
      null
    );

  const materialRef =
    useRef<THREE.PointsMaterial>(
      null
    );

  const {
    viewport,
    size,
  } = useThree();

  const {
    pointerRef,
    inputMode,
    handTrackingEnabled,
    setSynapseTargets,
    currentSection,
  } = useInteraction();


  const compactCenterX =
    viewport.width < 5.5
      ? 0
      : viewport.width * PORTAL_X_FACTOR;

  const compactCenterY =
    viewport.width < 5.5
      ? -2.15
      : 0.28;

  const particleColor = useMemo(
    () => new THREE.Color(theme === "light" ? "#1E202B" : "#AC8E85"),
    [theme]
  );


  /* =======================================================
     POSICIONES LOCALES
     ======================================================= */

  const localSpherePositions =
    useMemo(
      () => {
        const random = createSeededRandom(0x51a7e);
        const positions =
          new Float32Array(
            PARTICLE_COUNT *
            3
          );

        for (
          let i = 0;
          i < PARTICLE_COUNT;
          i++
        ) {
          const theta =
            random() *
            Math.PI *
            2;

          const phi =
            Math.acos(
              2 *
                random() -
                1
            );

          const x =
            COMPACT_SPHERE_RADIUS *
            Math.sin(phi) *
            Math.cos(theta);

          const y =
            COMPACT_SPHERE_RADIUS *
            Math.sin(phi) *
            Math.sin(theta);

          const z =
            COMPACT_SPHERE_RADIUS *
            Math.cos(phi);

          positions[
            i * 3
          ] = x;

          positions[
            i * 3 + 1
          ] = y;

          positions[
            i * 3 + 2
          ] = z;
        }

        return positions;
      },
      []
    );


  /* =======================================================
     POSICIONES EXPANDIDAS
     ======================================================= */

  const expandedPositions =
    useMemo(
      () => {
        const random = createSeededRandom(0xe7a9d);
        const positions =
          new Float32Array(
            PARTICLE_COUNT *
            3
          );

        for (
          let i = 0;
          i < PARTICLE_COUNT;
          i++
        ) {
          let x = 0;
          let y = 0;

          let validPosition =
            false;

          while (
            !validPosition
          ) {
            x =
              (
                random() -
                0.5
              ) *
              viewport.width *
              1.1;

            y =
              (
                random() -
                0.5
              ) *
              viewport.height *
              1.1;

            const dx =
              x -
              compactCenterX;

            const dy =
              y -
              compactCenterY;

            const distanceToPhoto =
              Math.sqrt(
                dx * dx +
                dy * dy
              );

            const overText =
              x <
                -viewport.width *
                  0.10 &&
              random() <
                0.5;

            const overFaceCore =
              distanceToPhoto <
              PHOTO_CORE_PROTECTION;

            if (
              !overText &&
              !overFaceCore
            ) {
              validPosition =
                true;
            }
          }

          positions[
            i * 3
          ] = x;

          positions[
            i * 3 + 1
          ] = y;

          positions[
            i * 3 + 2
          ] =
            -0.35 +
            (
              random() -
              0.5
            ) *
              1.6;
        }

        return positions;
      },
      [
        viewport.width,
        viewport.height,
        compactCenterX,
        compactCenterY,
      ]
    );


  /* =======================================================
     POSICIONES ACTUALES
     ======================================================= */

  const currentPositions =
    useMemo(
      () =>
        new Float32Array(
          expandedPositions
        ),
      [
        expandedPositions,
      ]
    );


  /* =======================================================
     ANIMACIÓN
     ======================================================= */

  useFrame(
    (state) => {
      if (
        !pointsRef.current ||
        !materialRef.current
      ) {
        return;
      }


      const isHome =
        currentSection === 0;

      const visualLayout =
        getHeroVisualLayout(
          viewport,
          size
        );

      materialRef.current.color.lerp(particleColor, 0.045);


      /* =====================================================
         PARTÍCULAS SOLO EN HOME
         ===================================================== */

      const targetOpacity =
        isHome
          ? theme === "light"
            ? viewport.width < 5.5
              ? 0.22
              : 0.42
            : 0.72
          : 0;

      materialRef.current.opacity =
        THREE.MathUtils.lerp(
          materialRef.current.opacity,
          targetOpacity,
          0.08
        );


      const expansion =
        getExpansionFromPointerDistance(
          viewport,
          pointerRef.current,
          visualLayout.x,
          visualLayout.y
        );

      const time =
        state.clock.elapsedTime;


      /* =====================================================
         ROTACIÓN
         ===================================================== */

      const compactAmount =
        1 -
        expansion;

      const rotationY =
        time *
        0.16 *
        compactAmount;

      const rotationX =
        time *
        0.045 *
        compactAmount;

      const cosY =
        Math.cos(
          rotationY
        );

      const sinY =
        Math.sin(
          rotationY
        );

      const cosX =
        Math.cos(
          rotationX
        );

      const sinX =
        Math.sin(
          rotationX
        );


      /* =====================================================
         BUFFER
         ===================================================== */

      const geometry =
        pointsRef.current
          .geometry;

      const attribute =
        geometry.getAttribute(
          "position"
        ) as THREE.BufferAttribute;

      const positions =
        attribute.array as Float32Array;


      /* =====================================================
         POSICIÓN DE LA MANO
         ===================================================== */

      const cursorWorldX =
        (
          pointerRef.current.x -
          0.5
        ) *
        viewport.width;

      const cursorWorldY =
        -(
          pointerRef.current.y -
          0.5
        ) *
        viewport.height;


      /* =====================================================
         SINAPSIS
         ===================================================== */

      const nearestTargets: Array<{
        distance: number;
        x: number;
        y: number;
      }> = [];


      const registerNearestParticle =
        (
          x: number,
          y: number
        ) => {
          const dx =
            x -
            cursorWorldX;

          const dy =
            y -
            cursorWorldY;

          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );

          if (
            distance >
            MAX_SYNAPSE_DISTANCE
          ) {
            return;
          }

          const candidate = {
            distance,
            x,
            y,
          };

          if (
            nearestTargets.length <
            MAX_SYNAPSE_TARGETS
          ) {
            nearestTargets.push(
              candidate
            );

            nearestTargets.sort(
              (
                a,
                b
              ) =>
                a.distance -
                b.distance
            );

            return;
          }

          const farthest =
            nearestTargets[
              nearestTargets.length -
                1
            ];

          if (
            distance <
            farthest.distance
          ) {
            nearestTargets[
              nearestTargets.length -
                1
            ] =
              candidate;

            nearestTargets.sort(
              (
                a,
                b
              ) =>
                a.distance -
                b.distance
            );
          }
        };


      /* =====================================================
         ACTUALIZAR PARTÍCULAS
         ===================================================== */

      for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
      ) {
        const index =
          i * 3;


        /* -------------------------
           ESFERA COMPACTA
           ------------------------- */

        const originalX =
          localSpherePositions[
            index
          ];

        const originalY =
          localSpherePositions[
            index + 1
          ];

        const originalZ =
          localSpherePositions[
            index + 2
          ];


        const rotatedX =
          originalX *
            cosY -
          originalZ *
            sinY;

        const rotatedZ1 =
          originalX *
            sinY +
          originalZ *
            cosY;

        const rotatedY =
          originalY *
            cosX -
          rotatedZ1 *
            sinX;

        const rotatedZ =
          originalY *
            sinX +
          rotatedZ1 *
            cosX;


        const compactX =
          visualLayout.x +
          rotatedX * visualLayout.scale;

        const compactY =
          visualLayout.y +
          rotatedY * visualLayout.scale;

        const compactZ =
          rotatedZ * visualLayout.scale;


        /* -------------------------
           UNIVERSO EXPANDIDO
           ------------------------- */

        let expandedX =
          expandedPositions[
            index
          ];

        let expandedY =
          expandedPositions[
            index + 1
          ];

        let expandedZ =
          expandedPositions[
            index + 2
          ];


        const phase =
          i *
          0.137;


        expandedX +=
          Math.sin(
            time *
              0.50 +
              phase
          ) *
          0.035 *
          expansion;


        /*
         * CORREGIDO:
         * en tu archivo actual faltaba
         * cerrar correctamente Math.cos().
         */

        expandedY +=
          Math.cos(
            time *
              0.43 +
              phase *
                1.25
          ) *
          0.045 *
          expansion;


        expandedZ +=
          Math.sin(
            time *
              0.31 +
              phase
          ) *
          0.025 *
          expansion;


        /* -------------------------
           TRANSICIÓN
           ------------------------- */

        const targetX =
          THREE.MathUtils.lerp(
            compactX,
            expandedX,
            expansion
          );

        const targetY =
          THREE.MathUtils.lerp(
            compactY,
            expandedY,
            expansion
          );

        const targetZ =
          THREE.MathUtils.lerp(
            compactZ,
            expandedZ,
            expansion
          );


        const responseSpeed =
          0.055;


        currentPositions[
          index
        ] =
          THREE.MathUtils.lerp(
            currentPositions[
              index
            ],
            targetX,
            responseSpeed
          );


        currentPositions[
          index + 1
        ] =
          THREE.MathUtils.lerp(
            currentPositions[
              index + 1
            ],
            targetY,
            responseSpeed
          );


        currentPositions[
          index + 2
        ] =
          THREE.MathUtils.lerp(
            currentPositions[
              index + 2
            ],
            targetZ,
            responseSpeed
          );


        positions[
          index
        ] =
          currentPositions[
            index
          ];

        positions[
          index + 1
        ] =
          currentPositions[
            index + 1
          ];

        positions[
          index + 2
        ] =
          currentPositions[
            index + 2
          ];


        /*
         * La sinapsis de partículas
         * también queda limitada a Home.
         */

        if (
          isHome &&
          inputMode === "hands" &&
          handTrackingEnabled
        ) {
          registerNearestParticle(
            currentPositions[
              index
            ],
            currentPositions[
              index + 1
            ]
          );
        }
      }


      /* =====================================================
         ENVIAR SINAPSIS
         ===================================================== */

      if (
        isHome &&
        inputMode === "hands" &&
        handTrackingEnabled
      ) {
        const targets =
          nearestTargets.map(
            (
              target
            ) => ({
              x:
                0.5 +
                target.x /
                  viewport.width,

              y:
                0.5 -
                target.y /
                  viewport.height,

              strength:
                THREE.MathUtils.clamp(
                  1 -
                    target.distance /
                      MAX_SYNAPSE_DISTANCE,
                  0,
                  1
                ),
            })
          );

        setSynapseTargets(
          targets
        );
      } else {
        setSynapseTargets(
          []
        );
      }


      attribute.needsUpdate =
        true;
    }
  );


  /* =======================================================
     RENDER PARTÍCULAS PRINCIPALES
     ======================================================= */

  return (
    <points
      ref={pointsRef}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            currentPositions,
            3,
          ]}
        />
      </bufferGeometry>

      <pointsMaterial
        ref={materialRef}
        color="#1E202B"
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.84}
        depthWrite={false}
      />
    </points>
  );
}


/* =========================================================
   FOTO / PORTAL
   ========================================================= */

export function PhotoPortal({ theme }: { theme: Theme }) {
  const {
    viewport,
    size,
  } = useThree();

  const {
    pointerRef,
    currentSection,
  } = useInteraction();


  const portalX =
    viewport.width < 5.5
      ? 0
      : viewport.width * PORTAL_X_FACTOR;

  const portalY =
    viewport.width < 5.5
      ? -2.15
      : 0.28;

  const haloColor = useMemo(
    () => new THREE.Color(theme === "light" ? "#691420" : "#AC8E85"),
    [theme]
  );

  const photoBackgroundColor = useMemo(
    () => new THREE.Color(theme === "light" ? "#818362" : "#1E202B"),
    [theme]
  );


  /* =======================================================
     REFERENCIAS
     ======================================================= */

  const groupRef =
    useRef<THREE.Group>(
      null
    );

  const photoMaterialRef =
    useRef<THREE.MeshBasicMaterial>(
      null
    );

  const haloMaterialRef =
    useRef<THREE.MeshBasicMaterial>(
      null
    );

  const backgroundMaterialRef =
    useRef<THREE.MeshBasicMaterial>(
      null
    );


  /* =======================================================
     TEXTURA
     ======================================================= */

  const photoTexture =
    useLoader(
      THREE.TextureLoader,
      `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/elizabeth-photo.jpg`
    );


  useEffect(
    () => {
      photoTexture.colorSpace =
        THREE.SRGBColorSpace;

      photoTexture.offset.set(
        0,
        0
      );

      photoTexture.repeat.set(
        1,
        1
      );

      photoTexture.needsUpdate =
        true;
    },
    [
      photoTexture,
    ]
  );


  /* =======================================================
     ANIMACIÓN
     ======================================================= */

  useFrame(
    (state) => {
      if (
        !groupRef.current ||
        !photoMaterialRef.current ||
        !haloMaterialRef.current ||
        !backgroundMaterialRef.current
      ) {
        return;
      }


      const visualLayout =
        getHeroVisualLayout(
          viewport,
          size
        );

      const aboutLayout =
        getAboutVisualLayout(
          viewport,
          size
        );

      const expansion =
        getExpansionFromPointerDistance(
          viewport,
          pointerRef.current,
          visualLayout.x,
          visualLayout.y
        );

      haloMaterialRef.current.color.lerp(haloColor, 0.05);
      backgroundMaterialRef.current.color.lerp(photoBackgroundColor, 0.05);


      /* =====================================================
         ESTADO DE SECCIÓN
         ===================================================== */

      const isHome =
        currentSection === 0;

      const isAbout =
        currentSection === 1;


      /* =====================================================
         CONFIGURACIÓN POR SECCIÓN
         ===================================================== */

      const sectionScale =
        isHome
          ? visualLayout.scale
          : isAbout
            ? aboutLayout.scale
            : 0.35;


      const sectionOpacity =
        isHome
          ? 1
          : isAbout
            ? 1
            : 0;


      const sectionOffsetX =
        isHome
          ? 0
          : isAbout
            ? 0
            : 0.5;


      const sectionOffsetY =
        isHome
          ? 0
          : isAbout
            ? 0
            : 1;


      /* =====================================================
         OPACIDAD
         ===================================================== */

      photoMaterialRef.current.opacity =
        THREE.MathUtils.lerp(
          0.24,
          0.96,
          expansion
        ) *
        sectionOpacity;


      haloMaterialRef.current.opacity =
        THREE.MathUtils.lerp(
          0.11,
          0.34,
          expansion
        ) *
        sectionOpacity;


      backgroundMaterialRef.current.opacity =
        THREE.MathUtils.lerp(
          0.03,
          0.07,
          expansion
        ) *
        sectionOpacity;


      /* =====================================================
         RESPIRACIÓN
         ===================================================== */

      const pulse =
        1 +
        Math.sin(
          state.clock.elapsedTime *
            1.15
        ) *
          0.004;


      /* =====================================================
         ESCALA
         ===================================================== */

      const targetScale =
        pulse *
        sectionScale;


      const smoothScale =
        THREE.MathUtils.lerp(
          groupRef.current.scale.x,
          targetScale,
          0.06
        );


      groupRef.current.scale.setScalar(
        smoothScale
      );


      /* =====================================================
         POSICIÓN X
         ===================================================== */

      const targetPortalX =
        (isAbout ? aboutLayout.x : visualLayout.x) + sectionOffsetX;


      groupRef.current.position.x =
        THREE.MathUtils.lerp(
          groupRef.current.position.x,
          targetPortalX,
          0.06
        );


      /* =====================================================
         POSICIÓN Y
         ===================================================== */

      const targetPortalY =
        (isAbout ? aboutLayout.y : visualLayout.y) + sectionOffsetY;


      groupRef.current.position.y =
        THREE.MathUtils.lerp(
          groupRef.current.position.y,
          targetPortalY,
          0.06
        );
    }
  );


  /* =======================================================
     RENDER FOTO
     ======================================================= */

  return (
    <group
      ref={groupRef}
      position={[
        portalX,
        portalY,
        0,
      ]}
      renderOrder={20}
    >

      {/* ===================================================
          FONDO
          =================================================== */}

      <mesh
        position={[
          0,
          0,
          -0.04,
        ]}
      >
        <circleGeometry
          args={[
            PHOTO_BG_RADIUS,
            128,
          ]}
        />

        <meshBasicMaterial
          ref={
            backgroundMaterialRef
          }
          color="#818362"
          transparent
          opacity={0.03}
          depthWrite={false}
        />
      </mesh>


      {/* ===================================================
          FOTOGRAFÍA
          =================================================== */}

      <mesh
        position={[
          0,
          0,
          0,
        ]}
      >
        <circleGeometry
          args={[
            PHOTO_RADIUS,
            128,
          ]}
        />

        <meshBasicMaterial
          ref={
            photoMaterialRef
          }
          map={
            photoTexture
          }
          transparent
          opacity={0.96}
          depthWrite={false}
        />
      </mesh>


      {/* ===================================================
          HALO
          =================================================== */}

      <mesh
        position={[
          0,
          0,
          0.03,
        ]}
      >
        <ringGeometry
          args={[
            HALO_INNER_RADIUS,
            HALO_OUTER_RADIUS,
            128,
          ]}
        />

        <meshBasicMaterial
          ref={
            haloMaterialRef
          }
          color="#691420"
          transparent
          opacity={0.34}
          depthWrite={false}
        />
      </mesh>

    </group>
  );
}


/* =========================================================
   PARTÍCULAS DELANTERAS
   ========================================================= */

/*
 * Estas partículas pertenecen visualmente
 * al portal de Home.
 *
 * En About, Research y demás secciones
 * desaparecen.
 */

function ForegroundWatermarkParticles({ theme }: { theme: Theme }) {
  const pointsRef =
    useRef<THREE.Points>(
      null
    );

  const materialRef =
    useRef<THREE.PointsMaterial>(
      null
    );

  const {
    viewport,
    size,
  } = useThree();

  const {
    pointerRef,
    currentSection,
  } = useInteraction();

  const particleColor = useMemo(
    () => new THREE.Color(theme === "light" ? "#818362" : "#F1F1E8"),
    [theme]
  );


  const portalX =
    viewport.width < 5.5
      ? 0
      : viewport.width * PORTAL_X_FACTOR;

  const portalY =
    viewport.width < 5.5
      ? -2.15
      : 0.28;


  /* =======================================================
     ESTADO DE SECCIÓN
     ======================================================= */

  const isHome =
    currentSection === 0;


  /*
   * Solo Home tiene partículas.
   */

  const targetSectionScale =
    isHome
      ? 1
      : 0.50;


  const targetSectionOpacity =
    isHome
      ? 1
      : 0;


  const targetSectionOffsetX =
    isHome
      ? 0
      : SECTION_PORTAL_OFFSET_X;


  const targetSectionOffsetY =
    isHome
      ? 0
      : SECTION_PORTAL_OFFSET_Y;


  /* =======================================================
     VALORES ACTUALES
     ======================================================= */

  const currentScaleRef =
    useRef(1);

  const currentOffsetXRef =
    useRef(0);

  const currentOffsetYRef =
    useRef(0);

  const currentOpacityRef =
    useRef(1);


  /* =======================================================
     SEMILLAS
     ======================================================= */

  const seeds =
    useMemo(
      () => {
        const random = createSeededRandom(0xf04e6);
        const data: Array<{
          x: number;
          y: number;
          z: number;
          phase: number;
          speed: number;
        }> = [];


        for (
          let i = 0;
          i < WATERMARK_COUNT;
          i++
        ) {
          const angle =
            random() *
            Math.PI *
            2;


          const radius =
            Math.sqrt(
              random()
            ) *
            WATERMARK_RADIUS;


          data.push({
            x:
              Math.cos(
                angle
              ) *
              radius,

            y:
              Math.sin(
                angle
              ) *
              radius,

            z:
              0.58 +
              random() *
                0.08,

            phase:
              random() *
              Math.PI *
              2,

            speed:
              0.20 +
              random() *
                0.35,
          });
        }


        return data;
      },
      []
    );


  /* =======================================================
     POSICIONES INICIALES
     ======================================================= */

  const positions =
    useMemo(
      () => {
        const array =
          new Float32Array(
            WATERMARK_COUNT *
            3
          );


        for (
          let i = 0;
          i < WATERMARK_COUNT;
          i++
        ) {
          const index =
            i *
            3;


          array[
            index
          ] =
            portalX +
            seeds[i].x;


          array[
            index + 1
          ] =
            portalY +
            seeds[i].y;


          array[
            index + 2
          ] =
            seeds[i].z;
        }


        return array;
      },
      [
        portalX,
        portalY,
        seeds,
      ]
    );


  /* =======================================================
     ANIMACIÓN
     ======================================================= */

  useFrame(
    (state) => {
      if (
        !pointsRef.current ||
        !materialRef.current
      ) {
        return;
      }

      materialRef.current.color.lerp(particleColor, 0.045);

      const visualLayout =
        getHeroVisualLayout(
          viewport,
          size
        );

      const expansion =
        getExpansionFromPointerDistance(
          viewport,
          pointerRef.current,
          visualLayout.x,
          visualLayout.y
        );


      /* =====================================================
         TRANSICIÓN DE ESCALA
         ===================================================== */

      currentScaleRef.current =
        THREE.MathUtils.lerp(
          currentScaleRef.current,
          targetSectionScale,
          0.06
        );


      /* =====================================================
         TRANSICIÓN X
         ===================================================== */

      currentOffsetXRef.current =
        THREE.MathUtils.lerp(
          currentOffsetXRef.current,
          targetSectionOffsetX,
          0.06
        );


      /* =====================================================
         TRANSICIÓN Y
         ===================================================== */

      currentOffsetYRef.current =
        THREE.MathUtils.lerp(
          currentOffsetYRef.current,
          targetSectionOffsetY,
          0.06
        );


      /* =====================================================
         TRANSICIÓN DE OPACIDAD
         ===================================================== */

      currentOpacityRef.current =
        THREE.MathUtils.lerp(
          currentOpacityRef.current,
          targetSectionOpacity,
          0.08
        );


      const currentScale =
        currentScaleRef.current *
        visualLayout.scale;


      const currentPortalX =
        visualLayout.x +
        currentOffsetXRef.current;


      const currentPortalY =
        visualLayout.y +
        currentOffsetYRef.current;


      /* =====================================================
         OPACIDAD
         ===================================================== */

      materialRef.current.opacity =
        THREE.MathUtils.lerp(
          theme === "light" ? (viewport.width < 5.5 ? 0.04 : 0.08) : 0.14,
          theme === "light" ? (viewport.width < 5.5 ? 0.10 : 0.18) : 0.30,
          expansion
        ) *
        currentOpacityRef.current;


      /* =====================================================
         BUFFER
         ===================================================== */

      const geometry =
        pointsRef.current
          .geometry;


      const attribute =
        geometry.getAttribute(
          "position"
        ) as THREE.BufferAttribute;


      const array = attribute.array as Float32Array;


      const time = state.clock.elapsedTime;


      /* =====================================================
         ACTUALIZAR PARTÍCULAS
         ===================================================== */

      for ( let i = 0; i < WATERMARK_COUNT; i++ ) {
        const index = i * 3;

        const seed = seeds[i];
        const driftX = Math.sin( time * seed.speed + seed.phase ) * 0.026;
        const driftY = Math.cos( time * seed.speed * 0.82 + seed.phase ) * 0.031;
        /* -------------------------
           X
           ------------------------- */
        array[ index ] = currentPortalX + ( seed.x + driftX ) * currentScale;
        /* -------------------------
           Y
           ------------------------- */
        array[ index + 1 ] = currentPortalY + ( seed.y + driftY ) * currentScale;
        /* -------------------------
           Z
           ------------------------- */
        array[ index + 2 ] = seed.z;
      }


      attribute.needsUpdate =
        true;
    }
  );


  /* =======================================================
     RENDER PARTÍCULAS DELANTERAS
     ======================================================= */

  return (
    <points
      ref={pointsRef}
      renderOrder={100}
      frustumCulled={false}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[ positions, 3, ]}
        />
      </bufferGeometry>

      <pointsMaterial
        ref={ materialRef }
        color="#818362"
        size={0.024}
        sizeAttenuation
        transparent
        opacity={0.34}
        depthWrite={false}
        depthTest={false}
        blending={ THREE.AdditiveBlending }
      />
    </points>
  );
}


/* =========================================================
   ESCENA
   ========================================================= */

function Scene({ theme }: { theme: Theme }) {
  return (
    <>
      <ParticleUniverse theme={theme} />
      <PhotoPortal theme={theme} />
      <ForegroundWatermarkParticles theme={theme} />
    </>
  );
}


/* =========================================================
   CANVAS
   ========================================================= */

export default function OrbScene({ theme }: { theme: Theme }) {
  return (
    <Canvas
      camera={{
        position: [ 0, 0, 5.6, ],
        fov: 42,
      }}

      dpr={[ 1, 2, ]}
      gl={{ antialias: true, alpha: true, }}
    >
      <Scene theme={theme} />
    </Canvas>
  );
}
