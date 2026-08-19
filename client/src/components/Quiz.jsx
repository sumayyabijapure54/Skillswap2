import React from 'react';

export default function Quiz({ quiz, onComplete }){
  const [answers, setAnswers] = React.useState(Array(quiz.length).fill(null));
  const [submitted, setSubmitted] = React.useState(false);

  if (!quiz.length) {
    return (
      <div className="quiz-body">
        <p className="desc" style={{ margin: 0 }}>This checkpoint quiz couldn't load its questions. Please refresh the page.</p>
      </div>
    );
  }

  const allAnswered = answers.every(a=>a!==null);
  const score = submitted ? answers.filter((a,i)=>a===quiz[i].correct).length : 0;

  const pick = (qIdx, optIdx)=>{
    if(submitted) return;
    setAnswers(prev => prev.map((a,i)=> i===qIdx ? optIdx : a));
  };

  const onSubmit = ()=>{
    if(!allAnswered) return;
    setSubmitted(true);
  };

  if(submitted){
    const passed = score >= Math.ceil(quiz.length*0.6);
    return (
      <div className="quiz-result">
        <div className="quiz-result-icon">{passed ? '✓' : '↻'}</div>
        <h3>{passed ? 'Nice work!' : 'Almost there'}</h3>
        <p>You scored <b style={{color:'var(--text)'}}>{score}/{quiz.length}</b> {passed ? '— checkpoint passed.' : '— review the material and try again anytime.'}</p>
        <div className="quiz-review">
          {quiz.map((q,i)=>(
            <div className="quiz-review-item" key={i}>
              <span className={answers[i]===q.correct ? 'right' : 'wrong'}>{answers[i]===q.correct ? '✓' : '✗'}</span>
              <div>
                <b>{q.q}</b>
                <div style={{fontSize:'12px', color:'var(--muted)'}}>Correct answer: {q.options[q.correct]}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary-lg" style={{marginTop:'16px'}} onClick={()=>onComplete(score, quiz.length)}>Continue →</button>
      </div>
    );
  }

  return (
    <div className="quiz-body">
      {quiz.map((q, qi)=>(
        <div className="quiz-question" key={qi}>
          <b>{qi+1}. {q.q}</b>
          <div className="quiz-options">
            {q.options.map((opt, oi)=>(
              <label className={`quiz-option ${answers[qi]===oi?'selected':''}`} key={oi}>
                <input type="radio" name={`q${qi}`} checked={answers[qi]===oi} onChange={()=>pick(qi, oi)} />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button className="btn-primary-lg" disabled={!allAnswered} style={!allAnswered?{opacity:0.45, cursor:'not-allowed'}:{}} onClick={onSubmit}>
        Submit answers →
      </button>
    </div>
  );
}
