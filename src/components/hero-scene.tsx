import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Line,
  MeshDistortMaterial,
  PerspectiveCamera,
  Sparkles,
  Stars,
} from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Vector3 } from "three";
import type { Group } from "three";

type ThemeColors = {
  fog: string;
  primary: string;
  secondary: string;
  accent: string;
  emissivePrimary: string;
  emissiveSecondary: string;
  beam: string;
  beamAlt: string;
};

function getThemeColors(hour: number): ThemeColors {
  if (hour >= 6 && hour < 12) {
    // Morning - soft cyan/teal
    return {
      fog: "#0a1a1f",
      primary: "#7ae6ff",
      secondary: "#ffb27c",
      accent: "#d8fbff",
      emissivePrimary: "#1ec7ff",
      emissiveSecondary: "#ff8a42",
      beam: "#7ee5ff",
      beamAlt: "#ff9d6c",
    };
  } else if (hour >= 12 && hour < 17) {
    // Afternoon - bright cyan/white
    return {
      fog: "#060d19",
      primary: "#80ebff",
      secondary: "#ffb57a",
      accent: "#d8fbff",
      emissivePrimary: "#1ec7ff",
      emissiveSecondary: "#ff8a42",
      beam: "#7ee5ff",
      beamAlt: "#ff9d6c",
    };
  } else if (hour >= 17 && hour < 20) {
    // Sunset - warm orange/pink
    return {
      fog: "#1a0d12",
      primary: "#ff9d7a",
      secondary: "#ff6b8a",
      accent: "#ffd8e6",
      emissivePrimary: "#ff7a5a",
      emissiveSecondary: "#ff4a6a",
      beam: "#ff9d7a",
      beamAlt: "#ff6b8a",
    };
  } else {
    // Night - deep blue/purple
    return {
      fog: "#060614",
      primary: "#7ae6ff",
      secondary: "#b57aff",
      accent: "#d8e6ff",
      emissivePrimary: "#1ec7ff",
      emissiveSecondary: "#9945ff",
      beam: "#7ee5ff",
      beamAlt: "#b57aff",
    };
  }
}

function useBackgroundTheme() {
  const [theme, setTheme] = useState<ThemeColors>(() => getThemeColors(new Date().getHours()));

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      setTheme(getThemeColors(hour));
    };

    const interval = setInterval(updateTheme, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return theme;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

type SatelliteProps = {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed: number;
  reducedMotion: boolean;
};

function SatelliteNode({ position, color, scale = 1, speed, reducedMotion }: SatelliteProps) {
  return (
    <Float speed={reducedMotion ? 0 : speed} rotationIntensity={reducedMotion ? 0 : 1.1} floatIntensity={reducedMotion ? 0 : 1.1}>
      <group position={position} scale={scale}>
        <mesh>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.65} metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh scale={1.95}>
          <torusGeometry args={[0.24, 0.012, 10, 48]} />
          <meshStandardMaterial color="#dffbff" emissive={color} emissiveIntensity={0.9} metalness={1} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

function SceneContent() {
  const reducedMotion = useReducedMotion();
  const theme = useBackgroundTheme();
  const { size, pointer } = useThree();
  const isMedium = size.width >= 720 && size.width < 960;
  const isCompact = size.width < 720;
  const sceneOffsetX = isCompact ? 1.15 : isMedium ? 2.8 : 4.6;
  const sceneScale = isCompact ? 0.74 : isMedium ? 0.85 : 1;

  const currentPointer = useRef<Vector3>(new Vector3(0, 0, 0));
  const targetPointer = useRef<Vector3>(new Vector3(0, 0, 0));

  const beams = useMemo(
    () => [
      [
        [sceneOffsetX - 4.6, -1.7, -4.5],
        [sceneOffsetX - 1.6, 0.8, -1.6],
        [sceneOffsetX + 0.3, 0.1, 0],
      ],
      [
        [sceneOffsetX + 5.8, -1.5, -4.2],
        [sceneOffsetX + 2.1, 2.2, -1],
        [sceneOffsetX + 0.3, 0.1, 0],
      ],
      [
        [sceneOffsetX - 0.6, 4.2, -4.8],
        [sceneOffsetX + 1.5, 2.5, -1.9],
        [sceneOffsetX + 3.7, 1.8, -3.6],
      ],
    ],
    [sceneOffsetX],
  );

  useEffect(() => {
    currentPointer.current.set(pointer.x, pointer.y, 0);
    targetPointer.current.set(pointer.x, pointer.y, 0);
  }, [pointer]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const root = state.scene.getObjectByName("scene-root") as Group | null;
    const inner = state.scene.getObjectByName("inner-gimbal") as Group | null;
    const satellites = state.scene.getObjectByName("satellite-ring") as Group | null;

    if (!root || !inner || !satellites) {
      return;
    }

    targetPointer.current.set(pointer.x, pointer.y, 0);

    if (!reducedMotion) {
      currentPointer.current.x = gsap.utils.interpolate(currentPointer.current.x, targetPointer.current.x, 0.08);
      currentPointer.current.y = gsap.utils.interpolate(currentPointer.current.y, targetPointer.current.y, 0.08);
    }

    const smoothPointerX = reducedMotion ? 0 : currentPointer.current.x * 0.6;
    const smoothPointerY = reducedMotion ? 0 : currentPointer.current.y * 0.4;

    root.rotation.y = reducedMotion ? 0.3 : elapsed * 0.12 + smoothPointerX;
    root.rotation.x = reducedMotion ? -0.1 : smoothPointerY;

    inner.rotation.x = reducedMotion ? 0.55 : elapsed * 0.32;
    inner.rotation.y = reducedMotion ? 0.8 : elapsed * 0.54;

    satellites.rotation.z = reducedMotion ? 0.2 : elapsed * -0.18;
    satellites.rotation.x = reducedMotion ? 0.55 : 0.42 + Math.sin(elapsed * 0.45) * 0.1;
  });

  return (
    <>
      <fog attach="fog" args={[theme.fog, 13, 34]} />
      <ambientLight intensity={0.85} />
      <directionalLight color={theme.primary} intensity={3} position={[6, 7, 4]} />
      <pointLight color={theme.primary} intensity={24} position={[sceneOffsetX + 2.5, 2.8, 3]} />
      <pointLight color={theme.secondary} intensity={20} position={[sceneOffsetX - 2.8, -1.7, 3.2]} />
      <PerspectiveCamera makeDefault position={[0, 1.1, 11.2]} fov={36} />

      <Stars radius={90} depth={46} count={reducedMotion ? 800 : 1600} factor={4} fade speed={reducedMotion ? 0 : 0.35} />
      <Sparkles
        count={reducedMotion ? 40 : 150}
        size={4}
        speed={reducedMotion ? 0 : 0.35}
        opacity={0.7}
        scale={[20, 12, 16]}
        color={theme.primary}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[sceneOffsetX + 0.4, -3.15, -0.2]}>
        <circleGeometry args={[8.8, 96]} />
        <meshStandardMaterial color="#071423" emissive={theme.emissivePrimary} emissiveIntensity={0.9} metalness={0.85} roughness={0.2} />
      </mesh>

      <group name="scene-root" position={[sceneOffsetX, -0.12, 0]} scale={sceneScale}>
        <group rotation={[1.08, 0.2, 0]}>
          {[3.2, 4.15, 5.15].map((radius, index) => (
            <mesh key={radius} rotation={[0, 0, index * 0.5]}>
              <torusGeometry args={[radius, index === 1 ? 0.08 : 0.045, 20, 180]} />
              <meshStandardMaterial
                color={index === 1 ? theme.secondary : theme.primary}
                emissive={index === 1 ? theme.emissiveSecondary : theme.emissivePrimary}
                emissiveIntensity={index === 1 ? 1.85 : 1.55}
                metalness={1}
                roughness={0.12}
                transparent
                opacity={index === 1 ? 0.9 : 0.75}
              />
            </mesh>
          ))}
        </group>

        <group name="satellite-ring">
          <SatelliteNode position={[3.4, 1.7, -1.8]} color={theme.primary} speed={1.4} reducedMotion={reducedMotion} />
          <SatelliteNode position={[-3, 1.2, -2.2]} color={theme.secondary} speed={1.2} reducedMotion={reducedMotion} />
          <SatelliteNode position={[1.2, -2.1, 1.1]} color={theme.accent} scale={0.9} speed={1.6} reducedMotion={reducedMotion} />
          <SatelliteNode position={[-1.7, 2.7, 0.6]} color={theme.primary} scale={0.82} speed={1.3} reducedMotion={reducedMotion} />
        </group>

        <group name="inner-gimbal">
          <mesh>
            <icosahedronGeometry args={[1.45, 10]} />
            <MeshDistortMaterial
              color={theme.accent}
              emissive={theme.emissivePrimary}
              emissiveIntensity={1.9}
              metalness={0.72}
              roughness={0.14}
              speed={reducedMotion ? 0 : 1.5}
              distort={reducedMotion ? 0.08 : 0.2}
            />
          </mesh>
          <mesh rotation={[0.8, 0.2, 0]} scale={1.42}>
            <octahedronGeometry args={[1.32, 2]} />
            <meshStandardMaterial color="#062335" emissive={theme.emissivePrimary} emissiveIntensity={0.8} wireframe />
          </mesh>
        </group>
      </group>

      {beams.map((points, index) => (
        <Line
          key={index}
          points={points as [number, number, number][]}
          color={index === 1 ? theme.beamAlt : theme.beam}
          lineWidth={1.25}
          transparent
          opacity={0.58}
        />
      ))}
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, 1.8]} gl={{ antialias: true }}>
      <SceneContent />
    </Canvas>
  );
}
