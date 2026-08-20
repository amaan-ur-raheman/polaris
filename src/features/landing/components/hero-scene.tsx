"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere({
  position,
  scale,
  color,
  speed,
  distort,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  distort: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.1}
          metalness={0.9}
          distort={distort}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

function WireframeIcosahedron({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.4}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const count = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#60A5FA"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingRing({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.1 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.05, 16, 100]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function CameraRig() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.08) * 0.3;
    camera.position.y = Math.cos(t * 0.12) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#3B82F6" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#06B6D4" />

        {/* Main sphere */}
        <AnimatedSphere
          position={[0, 0, -2]}
          scale={1.8}
          color="#3B82F6"
          speed={0.4}
          distort={0.4}
        />

        {/* Accent spheres */}
        <AnimatedSphere
          position={[-3, 1, -3]}
          scale={0.5}
          color="#06B6D4"
          speed={0.6}
          distort={0.3}
        />
        <AnimatedSphere
          position={[3.5, -0.5, -4]}
          scale={0.4}
          color="#8B5CF6"
          speed={0.7}
          distort={0.25}
        />
        <AnimatedSphere
          position={[-2, -2, -2]}
          scale={0.3}
          color="#EC4899"
          speed={0.8}
          distort={0.2}
        />

        {/* Wireframe icosahedrons */}
        <WireframeIcosahedron
          position={[2.5, 1.5, -3]}
          scale={0.8}
          color="#3B82F6"
          speed={0.3}
        />
        <WireframeIcosahedron
          position={[-3, -1, -5]}
          scale={0.5}
          color="#06B6D4"
          speed={0.5}
        />

        {/* Floating rings */}
        <FloatingRing
          position={[1, 2, -4]}
          scale={0.6}
          color="#3B82F6"
          speed={0.4}
        />
        <FloatingRing
          position={[-2, 0.5, -3]}
          scale={0.4}
          color="#06B6D4"
          speed={0.6}
        />

        {/* Particles */}
        <ParticleField />

        {/* Sparkles */}
        <Sparkles
          count={80}
          scale={12}
          size={1.5}
          speed={0.3}
          color="#60A5FA"
          opacity={0.4}
        />

        {/* Camera */}
        <CameraRig />
      </Canvas>
    </div>
  );
}
