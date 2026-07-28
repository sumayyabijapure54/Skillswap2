import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Hero-only 3D piece — a faceted torus-knot core with two tilted orbit
// rings of skill-nodes and live connector arcs. Intentionally a different
// construction from the full-page BackgroundFX particle field.
export default function OrbitalOrb(){
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(()=>{
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if(!wrap || !canvas) return;

    const w = wrap.clientWidth, h = wrap.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 100);
    camera.position.z = 6.4;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setSize(w,h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.34, 160, 12, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({ color:0x14f0b4, wireframe:true, transparent:true, opacity:0.55 });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    coreGroup.add(knot);

    const coreGlow = new THREE.Mesh(new THREE.SphereGeometry(1.05,32,32), new THREE.MeshBasicMaterial({ color:0x9b7bff, transparent:true, opacity:0.06 }));
    coreGroup.add(coreGlow);

    const ringDefs = [
      { radius:2.55, tilt:0.55, count:9, color:0x14f0b4, speed:0.35 },
      { radius:3.1, tilt:-0.8, count:6, color:0x9b7bff, speed:-0.24 }
    ];
    const orbitGroups = [];
    ringDefs.forEach(def=>{
      const ringMat = new THREE.LineBasicMaterial({ color:def.color, transparent:true, opacity:0.22 });
      const ringGeo = new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0,0,def.radius,def.radius,0,Math.PI*2,false,0).getPoints(96).map(p=>new THREE.Vector3(p.x,0,p.y))
      );
      const ringLine = new THREE.LineLoop(ringGeo, ringMat);
      ringLine.rotation.x = def.tilt;
      coreGroup.add(ringLine);

      const og = new THREE.Group();
      og.rotation.x = def.tilt;
      const nodeMat = new THREE.MeshBasicMaterial({ color:def.color });
      const nodes = [];
      for(let i=0;i<def.count;i++){
        const a = (i/def.count)*Math.PI*2;
        const nodeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.052,10,10), nodeMat);
        nodeMesh.position.set(Math.cos(a)*def.radius,0,Math.sin(a)*def.radius);
        og.add(nodeMesh);
        nodes.push({ mesh:nodeMesh, a, r:def.radius });
      }
      coreGroup.add(og);
      orbitGroups.push({ group:og, nodes, speed:def.speed });
    });

    const arcMat = new THREE.LineBasicMaterial({ color:0x14f0b4, transparent:true, opacity:0.35 });
    const arcLines = [];
    for(let i=0;i<7;i++){
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]);
      const line = new THREE.Line(geo, arcMat.clone());
      coreGroup.add(line);
      arcLines.push(line);
    }

    let mouseX=0, mouseY=0, raf=0, t=0;
    const onMouseMove = (e)=>{
      const r = wrap.getBoundingClientRect();
      mouseX = ((e.clientX-r.left)/r.width-0.5)*2;
      mouseY = ((e.clientY-r.top)/r.height-0.5)*2;
    };
    const onResize = ()=>{
      const nw = wrap.clientWidth, nh = wrap.clientHeight;
      camera.aspect = nw/nh; camera.updateProjectionMatrix();
      renderer.setSize(nw,nh);
    };
    wrap.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    function animate(){
      raf = requestAnimationFrame(animate);
      t += 0.006;
      knot.rotation.x += 0.0022; knot.rotation.y += 0.003;
      coreGroup.rotation.y += 0.0014;
      coreGroup.rotation.x += (mouseY*0.22 - coreGroup.rotation.x)*0.04;
      coreGroup.rotation.y += (mouseX*0.12)*0.002;
      coreGlow.scale.setScalar(1+Math.sin(t*1.4)*0.08);

      orbitGroups.forEach(og=>{ og.group.rotation.y += og.speed*0.012; });

      arcLines.forEach((line,i)=>{
        const og = orbitGroups[i%orbitGroups.length];
        const node = og.nodes[i%og.nodes.length];
        const worldPos = new THREE.Vector3();
        node.mesh.getWorldPosition(worldPos);
        coreGroup.worldToLocal(worldPos);
        line.geometry.setFromPoints([new THREE.Vector3(0,0,0), worldPos]);
        line.material.opacity = 0.18+0.22*Math.sin(t*2+i);
      });

      renderer.render(scene,camera);
    }
    animate();

    return ()=>{
      cancelAnimationFrame(raf);
      wrap.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      knotGeo.dispose(); knotMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="globe-wrap" ref={wrapRef}>
      <canvas ref={canvasRef} className="orb-canvas" />
      <div className="float-chip" style={{top:'2%', left:'2%'}}><span className="ic">{'</>'}</span>Coding</div>
      <div className="float-chip" style={{top:'8%', right:'0%', animationDelay:'1s'}}><span className="ic">🎨</span>Design</div>
      <div className="float-chip" style={{top:'44%', left:'-6%', animationDelay:'2s'}}><span className="ic">🎵</span>Music</div>
      <div className="float-chip" style={{bottom:'20%', left:'2%', animationDelay:'3s'}}><span className="ic">📷</span>Photo</div>
      <div className="float-chip" style={{top:'40%', right:'-4%', animationDelay:'1.6s'}}><span className="ic">🌐</span>Language</div>
      <div className="float-chip" style={{bottom:'6%', right:'6%', animationDelay:'2.6s'}}><span className="ic">📈</span>Marketing</div>
      <div className="stat-float"><div className="n">10,000+</div><div className="l">Skills swapped</div></div>
    </div>
  );
}
