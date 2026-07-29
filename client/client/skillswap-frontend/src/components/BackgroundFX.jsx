import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Fixed, full-viewport "constellation field" that sits behind the entire
// app — every route shares this single canvas so the 3D layer never
// resets or flickers when navigating between pages.
export default function BackgroundFX(){
  const canvasRef = useRef(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;

    let w = window.innerWidth, h = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w/h, 0.1, 100);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setSize(w,h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const field = new THREE.Group();
    scene.add(field);

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const COUNT = reduced ? 0 : (w < 700 ? 70 : 130);
    const nodes = [];
    for(let i=0;i<COUNT;i++){
      nodes.push({
        pos: new THREE.Vector3((Math.random()-0.5)*16,(Math.random()-0.5)*16,(Math.random()-0.5)*10),
        phase: Math.random()*Math.PI*2,
        speed: 0.15+Math.random()*0.25,
        amp: 0.25+Math.random()*0.5
      });
    }

    const posArr = new Float32Array(COUNT*3);
    const colorArr = new Float32Array(COUNT*3);
    const c1 = new THREE.Color(0x14f0b4), c2 = new THREE.Color(0x9b7bff);
    nodes.forEach((n,i)=>{
      posArr[i*3]=n.pos.x; posArr[i*3+1]=n.pos.y; posArr[i*3+2]=n.pos.z;
      const mixed = c1.clone().lerp(c2, Math.random());
      colorArr[i*3]=mixed.r; colorArr[i*3+1]=mixed.g; colorArr[i*3+2]=mixed.b;
    });
    const ptsGeo = new THREE.BufferGeometry();
    ptsGeo.setAttribute('position', new THREE.BufferAttribute(posArr,3));
    ptsGeo.setAttribute('color', new THREE.BufferAttribute(colorArr,3));
    const ptsMat = new THREE.PointsMaterial({ size:0.06, vertexColors:true, transparent:true, opacity:0.85 });
    field.add(new THREE.Points(ptsGeo, ptsMat));

    const edges = [];
    const MAXDIST = 3.2;
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        if(nodes[i].pos.distanceTo(nodes[j].pos) < MAXDIST){ edges.push([i,j]); }
      }
    }
    const edgePos = new Float32Array(edges.length*6);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos,3));
    const edgeMat = new THREE.LineBasicMaterial({ color:0x14f0b4, transparent:true, opacity:0.14 });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    field.add(edgeLines);

    let mouseX=0, mouseY=0, scrollNorm=0, raf=0, t=0;

    const onMouseMove = (e)=>{
      mouseX = (e.clientX/window.innerWidth-0.5)*2;
      mouseY = (e.clientY/window.innerHeight-0.5)*2;
    };
    const onScroll = ()=>{
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollNorm = max>0 ? window.scrollY/max : 0;
    };
    const onResize = ()=>{
      w = window.innerWidth; h = window.innerHeight;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w,h);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onResize);

    function animate(){
      raf = requestAnimationFrame(animate);
      if(reduced){ renderer.render(scene,camera); return; }
      t += 0.01;

      for(let i=0;i<nodes.length;i++){
        const n = nodes[i];
        posArr[i*3]   = n.pos.x;
        posArr[i*3+1] = n.pos.y + Math.sin(t*n.speed+n.phase)*n.amp*0.15;
        posArr[i*3+2] = n.pos.z + Math.cos(t*n.speed*0.7+n.phase)*n.amp*0.1;
      }
      ptsGeo.attributes.position.needsUpdate = true;

      for(let e=0;e<edges.length;e++){
        const [i,j] = edges[e];
        edgePos[e*6]=posArr[i*3];   edgePos[e*6+1]=posArr[i*3+1]; edgePos[e*6+2]=posArr[i*3+2];
        edgePos[e*6+3]=posArr[j*3]; edgePos[e*6+4]=posArr[j*3+1]; edgePos[e*6+5]=posArr[j*3+2];
      }
      edgeGeo.attributes.position.needsUpdate = true;

      field.rotation.y = t*0.02 + mouseX*0.06 + scrollNorm*1.1;
      field.rotation.x = mouseY*0.05 + scrollNorm*0.25;
      camera.position.z = 9 - scrollNorm*1.5;

      renderer.render(scene,camera);
    }
    animate();

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ptsGeo.dispose(); edgeGeo.dispose();
      ptsMat.dispose(); edgeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="bg-fx-canvas" />
      <div id="bg-fx-fade"></div>
    </>
  );
}
