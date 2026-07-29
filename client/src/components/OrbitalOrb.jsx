import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// One ring: the ring outline, its orbiting nodes, and the connector arcs
// from center to each node all live in the same rotating group, so the
// arcs are just static local-space lines (0,0,0) -> node position — no
// per-frame world/local conversion needed, they rotate for free with the
// group.
function OrbitRing({ radius, tilt, count, color, speed }) {
  const spinRef = useRef();
  const arcMats = useRef([]);

  const nodePositions = useMemo(() => (
    Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2;
      return [Math.cos(a) * radius, 0, Math.sin(a) * radius];
    })
  ), [count, radius]);

  const ringPositions = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const pts = curve.getPoints(96);
    return new Float32Array(pts.flatMap((p) => [p.x, 0, p.y]));
  }, [radius]);

  useFrame((state, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += speed * 0.72 * delta;
    const t = state.clock.elapsedTime;
    arcMats.current.forEach((mat, i) => {
      if (mat) mat.opacity = 0.18 + 0.22 * Math.sin(t * 2 + i);
    });
  });

  return (
    <group rotation={[tilt, 0, 0]}>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={ringPositions.length / 3} array={ringPositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.22} />
      </line>

      <group ref={spinRef}>
        {nodePositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.052, 10, 10]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
        {nodePositions.map((pos, i) => {
          const arcPts = new Float32Array([0, 0, 0, ...pos]);
          return (
            <line key={`arc-${i}`}>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={2} array={arcPts} itemSize={3} />
              </bufferGeometry>
              <lineBasicMaterial ref={(el) => (arcMats.current[i] = el)} color={color} transparent opacity={0.3} />
            </line>
          );
        })}
      </group>
    </group>
  );
}

function Core({ mouse }) {
  const knotRef = useRef();
  const groupRef = useRef();
  const glowRef = useRef();

  useFrame((state, delta) => {
    knotRef.current.rotation.x += delta * 0.37;
    knotRef.current.rotation.y += delta * 0.5;
    groupRef.current.rotation.y += delta * 0.23;
    groupRef.current.rotation.x += (mouse.current.y * 0.22 - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.y += mouse.current.x * 0.0012;
    glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.08);
  });

  return (
    <group ref={groupRef}>
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[1.15, 0.34, 160, 12, 2, 3]} />
        <meshBasicMaterial color="#14f0b4" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color="#9b7bff" transparent opacity={0.06} />
      </mesh>
      <OrbitRing radius={2.55} tilt={0.55} count={9} color="#14f0b4" speed={0.35} />
      <OrbitRing radius={3.1} tilt={-0.8} count={6} color="#9b7bff" speed={-0.24} />
    </group>
  );
}

export default function OrbitalOrb() {
  const wrapRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  const onMouseMove = (e) => {
    const r = wrapRef.current.getBoundingClientRect();
    mouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    mouse.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };

  return (
    <div className="globe-wrap" ref={wrapRef} onMouseMove={onMouseMove}>
      <Canvas
        className="orb-canvas"
        camera={{ position: [0, 0, 6.4], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Core mouse={mouse} />
      </Canvas>

      <div className="float-chip" style={{ top: '2%', left: '2%' }}><span className="ic">{'</>'}</span>Coding</div>
      <div className="float-chip" style={{ top: '8%', right: '0%', animationDelay: '1s' }}><span className="ic">🎨</span>Design</div>
      <div className="float-chip" style={{ top: '44%', left: '-6%', animationDelay: '2s' }}><span className="ic">🎵</span>Music</div>
      <div className="float-chip" style={{ bottom: '20%', left: '2%', animationDelay: '3s' }}><span className="ic">📷</span>Photo</div>
      <div className="float-chip" style={{ top: '40%', right: '-4%', animationDelay: '1.6s' }}><span className="ic">🌐</span>Language</div>
      <div className="float-chip" style={{ bottom: '6%', right: '6%', animationDelay: '2.6s' }}><span className="ic">📈</span>Marketing</div>
      <div className="stat-float"><div className="n">10,000+</div><div className="l">Skills swapped</div></div>
    </div>
  );
}
