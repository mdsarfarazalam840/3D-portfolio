import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Line,
  MeshDistortMaterial,
  PerspectiveCamera,
  Sparkles,
  Stars,
} from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import type { Group } from "three";

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
  const { size, pointer } = useThree();
  const isCompact = size.width < 960;
  const sceneOffsetX = isCompact ? 1.15 : 4.6;
  const sceneScale = isCompact ? 0.74 : 1;

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

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const root = state.scene.getObjectByName("scene-root") as Group | null;
    const inner = state.scene.getObjectByName("inner-gimbal") as Group | null;
    const satellites = state.scene.getObjectByName("satellite-ring") as Group | null;

    if (!root || !inner || !satellites) {
      return;
    }

    const pointerInfluenceX = reducedMotion ? 0 : pointer.x * 0.18;
    const pointerInfluenceY = reducedMotion ? 0 : pointer.y * 0.12;

    root.rotation.y = reducedMotion ? 0.3 : elapsed * 0.12 + pointerInfluenceX;
    root.rotation.x = reducedMotion ? -0.1 : pointerInfluenceY;

    inner.rotation.x = reducedMotion ? 0.55 : elapsed * 0.32;
    inner.rotation.y = reducedMotion ? 0.8 : elapsed * 0.54;

    satellites.rotation.z = reducedMotion ? 0.2 : elapsed * -0.18;
    satellites.rotation.x = reducedMotion ? 0.55 : 0.42 + Math.sin(elapsed * 0.45) * 0.1;
  });

  return (
    <>
      <color attach="background" args={["#060d19"]} />
      <fog attach="fog" args={["#060d19", 13, 34]} />
      <ambientLight intensity={0.85} />
      <directionalLight color="#9ce9ff" intensity={3} position={[6, 7, 4]} />
      <pointLight color="#4cd9ff" intensity={24} position={[sceneOffsetX + 2.5, 2.8, 3]} />
      <pointLight color="#ff985f" intensity={20} position={[sceneOffsetX - 2.8, -1.7, 3.2]} />
      <PerspectiveCamera makeDefault position={[0, 1.1, 11.2]} fov={36} />

      <Stars radius={90} depth={46} count={reducedMotion ? 800 : 1600} factor={4} fade speed={reducedMotion ? 0 : 0.35} />
      <Sparkles
        count={reducedMotion ? 30 : 80}
        size={2.8}
        speed={reducedMotion ? 0 : 0.28}
        opacity={0.48}
        scale={[18, 10, 14]}
        color="#99ebff"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[sceneOffsetX + 0.4, -3.15, -0.2]}>
        <circleGeometry args={[8.8, 96]} />
        <meshStandardMaterial color="#071423" emissive="#0c223d" emissiveIntensity={0.9} metalness={0.85} roughness={0.2} />
      </mesh>

      <group name="scene-root" position={[sceneOffsetX, -0.12, 0]} scale={sceneScale}>
        <group rotation={[1.08, 0.2, 0]}>
          {[3.2, 4.15, 5.15].map((radius, index) => (
            <mesh key={radius} rotation={[0, 0, index * 0.5]}>
              <torusGeometry args={[radius, index === 1 ? 0.08 : 0.045, 20, 180]} />
              <meshStandardMaterial
                color={index === 1 ? "#ffb27c" : "#7ae6ff"}
                emissive={index === 1 ? "#ff8a42" : "#1ec7ff"}
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
          <SatelliteNode position={[3.4, 1.7, -1.8]} color="#80ebff" speed={1.4} reducedMotion={reducedMotion} />
          <SatelliteNode position={[-3, 1.2, -2.2]} color="#ffb57a" speed={1.2} reducedMotion={reducedMotion} />
          <SatelliteNode position={[1.2, -2.1, 1.1]} color="#d8fbff" scale={0.9} speed={1.6} reducedMotion={reducedMotion} />
          <SatelliteNode position={[-1.7, 2.7, 0.6]} color="#71dfff" scale={0.82} speed={1.3} reducedMotion={reducedMotion} />
        </group>

        <group name="inner-gimbal">
          <mesh>
            <icosahedronGeometry args={[1.45, 10]} />
            <MeshDistortMaterial
              color="#b7f8ff"
              emissive="#4dd0ff"
              emissiveIntensity={1.9}
              metalness={0.72}
              roughness={0.14}
              speed={reducedMotion ? 0 : 1.5}
              distort={reducedMotion ? 0.08 : 0.2}
            />
          </mesh>
          <mesh rotation={[0.8, 0.2, 0]} scale={1.42}>
            <octahedronGeometry args={[1.32, 2]} />
            <meshStandardMaterial color="#062335" emissive="#163f60" emissiveIntensity={0.8} wireframe />
          </mesh>
        </group>
      </group>

      {beams.map((points, index) => (
        <Line
          key={index}
          points={points as [number, number, number][]}
          color={index === 1 ? "#ff9d6c" : "#7ee5ff"}
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
    <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
      <SceneContent />
    </Canvas>
  );
}
