import React, { useRef } from 'react';

export default function TiltCard({ as:Tag = 'div', className = '', children, ...rest }){
  const ref = useRef(null);

  const onMouseMove = (e)=>{
    const el = ref.current;
    if(!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y/r.height)-0.5)*-6, ry = ((x/r.width)-0.5)*6;
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  };
  const onMouseLeave = ()=>{
    if(ref.current) ref.current.style.transform = 'none';
  };

  return (
    <Tag ref={ref} className={className} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} {...rest}>
      {children}
    </Tag>
  );
}
