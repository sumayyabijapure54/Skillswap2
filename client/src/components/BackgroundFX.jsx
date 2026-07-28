import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Field() {
  const groupRef = useRef();
  const pointsGeoRef = useRef();
  const edgesGeoRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const scrollNorm = useRef(0);
  const { size } = useThree();

  const reduced = useMemo(
    () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    []
  );
  const COUNT = reduced ? 0 : (size.width < 700 ? 70 : 130);

  const { nodes, posArr, colorArr, edges, edgePosArr } = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        pos: new THREE.Vector3((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10),
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.25,
        amp: 0.25 + Math.random() * 0.5
      });
    }

    const posArr = new Float32Array(COUNT * 3);
    const colorArr = new Float32Array(COUNT * 3);
    const c1 = new THREE.Color(0x14f0b4);
    const c2 = new THREE.Color(0x9b7bff);
    nodes.forEach((n, i) => {
      posArr[i * 3] = n.pos.x; posArr[i * 3 + 1] = n.pos.y; posArr[i * 3 + 2] = n.pos.z;
      const mixed = c1.clone().lerp(c2, Math.random());
      colorArr[i * 3] = mixed.r; colorArr[i * 3 + 1] = mixed.g; colorArr[i * 3 + 2] = mixed.b;
    });

    const edges = [];
    const MAXDIST = 3.2;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < MAXDIST) edges.push([i, j]);
      }
    }
    const edgePosArr = new Float32Array(edges.length * 6);

    return { nodes, posArr, colorArr, edges, edgePosArr };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [COUNT]);

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollNorm.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useFrame((state) => {
    if (reduced || !nodes.length) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      posArr[i * 3] = n.pos.x;
      posArr[i * 3 + 1] = n.pos.y + Math.sin(t * n.speed + n.phase) * n.amp * 0.15;
      posArr[i * 3 + 2] = n.pos.z + Math.cos(t * n.speed * 0.7 + n.phase) * n.amp * 0.1;
    }
    if (pointsGeoRef.current) pointsGeoRef.current.attributes.position.needsUpdate = true;

    for (let e = 0; e < edges.length; e++) {
      const [i, j] = edges[e];
      edgePosArr[e * 6] = posArr[i * 3]; edgePosArr[e * 6 + 1] = posArr[i * 3 + 1]; edgePosArr[e * 6 + 2] = posArr[i * 3 + 2];
      edgePosArr[e * 6 + 3] = posArr[j * 3]; edgePosArr[e * 6 + 4] = posArr[j * 3 + 1]; edgePosArr[e * 6 + 5] = posArr[j * 3 + 2];
    }
    if (edgesGeoRef.current) edgesGeoRef.current.attributes.position.needsUpdate = true;

    groupRef.current.rotation.y = t * 0.02 + mouse.current.x * 0.06 + scrollNorm.current * 1.1;
    groupRef.current.rotation.x = mouse.current.y * 0.05 + scrollNorm.current * 0.25;
    state.camera.position.z = 9 - scrollNorm.current * 1.5;
  });

  if (!nodes.length) return null;

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry ref={pointsGeoRef}>
          <bufferAttribute attach="attributes-position" count={COUNT} array={posArr} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={COUNT} array={colorArr} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.85} />
      </points>
      <lineSegments>
        <bufferGeometry ref={edgesGeoRef}>
          <bufferAttribute attach="attributes-position" count={edges.length * 2} array={edgePosArr} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#14f0b4" transparent opacity={0.14} />
      </lineSegments>
    </group>
  );
}

// Fixed, full-viewport constellation field behind the whole app — a single
// shared Canvas so it never resets/flickers when routes change.
export default function BackgroundFX() {
  return (
    <>
      <Canvas
        className="bg-fx-canvas"
        camera={{ position: [0, 0, 9], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.75]}
      >
        <Field />
      </Canvas>
      <div id="bg-fx-fade"></div>
    </>
  );
}
