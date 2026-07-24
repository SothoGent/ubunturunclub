import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Plane } from '@react-three/drei';
import * as THREE from 'three';

// --- Coffee Cup with steam ---
function CoffeeCup() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.15;
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[-1.5, 0, 0]}>
      {/* Cup body */}
      <Cylinder args={[0.7, 0.6, 0.9, 16]} position={[0, 0.45, 0]} color="#5c3d2e" />
      {/* Handle */}
      <Cylinder args={[0.1, 0.1, 0.35, 8]} position={[0.8, 0.55, 0]} rotation={[0, 0, Math.PI / 2]} color="#5c3d2e" />
      {/* Coffee top */}
      <Cylinder args={[0.6, 0.6, 0.06, 16]} position={[0, 0.9, 0]} color="#3d1f0a" />
      {/* Steam particles */}
      <Sphere args={[0.1]} position={[-0.2, 1.1, 0.1]} color="#fff" opacity={0.3} transparent />
      <Sphere args={[0.08]} position={[0.15, 1.2, -0.1]} color="#fff" opacity={0.25} transparent />
      <Sphere args={[0.06]} position={[0.0, 1.3, 0.15]} color="#fff" opacity={0.2} transparent />
    </group>
  );
}

// --- Apple Crumble Bar with floating animation ---
function CrumbleBar({ position, rotation, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], scale?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(clock.getElapsedTime() * 0.6 + position[0]) * 0.002;
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Box args={[0.9 * scale, 0.25 * scale, 0.5 * scale]} color="#d4a373" />
      <Box args={[0.8 * scale, 0.06 * scale, 0.4 * scale]} position={[0, 0.15 * scale, 0]} color="#b5835a" />
      <Sphere args={[0.07 * scale]} position={[0.25 * scale, 0.18 * scale, 0.12 * scale]} color="#8b5e3c" />
      <Sphere args={[0.06 * scale]} position={[-0.2 * scale, 0.18 * scale, -0.12 * scale]} color="#8b5e3c" />
      <Sphere args={[0.05 * scale]} position={[0.1 * scale, 0.18 * scale, -0.15 * scale]} color="#8b5e3c" />
    </group>
  );
}

// --- Main 3D Scene ---
export default function FloatingTreats() {
  const bars = [
    { pos: [1.8, 0.2, 0.8], rot: [0.2, 0.5, 0.1], scale: 1.2 },
    { pos: [2.0, -0.1, -0.6], rot: [-0.1, -0.3, 0.2], scale: 0.9 },
    { pos: [1.4, 0.4, -1.0], rot: [0.3, 0.8, -0.1], scale: 1.0 },
    { pos: [2.2, 0.0, 0.2], rot: [-0.2, 1.2, 0.0], scale: 1.1 },
  ];

 return (
  <div style={{ width: '100%', height: '100%', minHeight: '350px', background: 'var(--paper-2)' }}>
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--green)' }}>Loading treats...</div>}>
      <Canvas camera={{ position: [4, 2.5, 5], fov: 40 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, 3, -2]} intensity={0.5} />
          <directionalLight position={[0, 5, 0]} intensity={0.8} />

          <Plane args={[8, 8]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
            <shadowMaterial opacity={0.1} color="#000" />
          </Plane>

          <CoffeeCup />
          {bars.map((b, i) => (
            <CrumbleBar key={i} position={b.pos} rotation={b.rot} scale={b.scale} />
          ))}
        </Canvas>
      </Suspense>
    </div>
  );
}