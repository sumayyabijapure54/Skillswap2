import React, { useRef } from 'react';

export default function OtpInput({ length = 6, value, onChange, error }){
  const refs = useRef([]);

  const setDigit = (i, digit)=>{
    const chars = value.split('');
    chars[i] = digit;
    onChange(chars.join('').slice(0, length));
  };

  const handleChange = (i, e)=>{
    const raw = e.target.value.replace(/\D/g, '');
    if(!raw){ setDigit(i, ''); return; }
    const digit = raw[raw.length-1];
    setDigit(i, digit);
    if(i < length-1) refs.current[i+1]?.focus();
  };

  const handleKeyDown = (i, e)=>{
    if(e.key === 'Backspace' && !value[i] && i > 0){
      refs.current[i-1]?.focus();
    }
  };

  const handlePaste = (e)=>{
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if(text){
      e.preventDefault();
      onChange(text.padEnd(value.length, ''));
      const nextIdx = Math.min(text.length, length-1);
      refs.current[nextIdx]?.focus();
    }
  };

  return (
    <div className="otp-row">
      {Array.from({ length }).map((_, i)=>(
        <input
          key={i}
          ref={el=>refs.current[i]=el}
          className={`otp-box ${error?'err':''}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e=>handleChange(i, e)}
          onKeyDown={e=>handleKeyDown(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
