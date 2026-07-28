import React, { useEffect, useRef, useState } from 'react';

export default function Counter({ target, suffix = '' }){
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(()=>{
    const el = ref.current;
    if(!el) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting && !started.current){
          started.current = true;
          const step = Math.max(1, Math.ceil(target/50));
          let cur = 0;
          const tick = ()=>{
            cur += step;
            if(cur >= target){ setValue(target); }
            else { setValue(cur); requestAnimationFrame(tick); }
          };
          tick();
          io.unobserve(el);
        }
      });
    }, { threshold:0.4 });
    io.observe(el);
    return ()=>io.disconnect();
  }, [target]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}
