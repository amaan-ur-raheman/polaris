"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function FloatingCodeBlock({
  position,
  rotation,
  scale,
  speed,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.002 * speed;
    meshRef.current.rotation.y += 0.003 * speed;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 0.6, 0.1]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#3B82F6"
        emissive="#1E40AF"
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
        distort={0.2}
        speed={2}
      />
    </mesh>
  );
}

function FloatingSphere({
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
    meshRef.current.position.x =
      position[0] + Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.5;
    meshRef.current.position.y =
      position[1] + Math.cos(state.clock.elapsedTime * 0.4 * speed) * 0.3;
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.9}
          distort={0.3}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

function WireframeTorus({
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
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.6}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
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
        size={0.02}
        color="#60A5FA"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function MouseTracker() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Subtle camera movement based on time
    camera.position.x = Math.sin(t * 0.1) * 0.5;
    camera.position.y = Math.cos(t * 0.15) * 0.3;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3B82F6" />

        {/* Main floating code blocks */}
        <FloatingCodeBlock
          position={[-2.5, 0.5, -1]}
          rotation={[0.3, 0.5, 0]}
          scale={1.2}
          speed={0.8}
        />
        <FloatingCodeBlock
          position={[2, -0.5, -2]}
          rotation={[-0.2, 0.8, 0.1]}
          scale={0.9}
          speed={1.2}
        />
        <FloatingCodeBlock
          position={[0, 1.5, -3]}
          rotation={[0.5, 0.3, -0.2]}
          scale={0.7}
          speed={0.6}
        />

        {/* Accent spheres */}
        <FloatingSphere
          position={[-3, -1, -2]}
          scale={0.4}
          color="#06B6D4"
          speed={0.7}
        />
        <FloatingSphere
          position={[3, 1, -3]}
          scale={0.3}
          color="#8B5CF6"
          speed={0.9}
        />
        <FloatingSphere
          position={[0, -2, -1]}
          scale={0.25}
          color="#EC4899"
          speed={1.1}
        />

        {/* Wireframe torus */}
        <WireframeTorus
          position={[2.5, 0, -4]}
          scale={0.6}
          color="#3B82F6"
          speed={0.5}
        />
        <WireframeTorus
          position={[-2, 1.5, -5]}
          scale={0.4}
          color="#06B6D4"
          speed={0.7}
        />

        {/* Particle field */}
        <ParticleField />

        {/* Sparkles */}
        <Sparkles
          count={100}
          scale={10}
          size={2}
          speed={0.4}
          color="#60A5FA"
          opacity={0.5}
        />

        {/* Camera tracking */}
        <MouseTracker />
      </Canvas>
    </div>
  );
}
