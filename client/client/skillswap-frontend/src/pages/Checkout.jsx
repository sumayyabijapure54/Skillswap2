import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { getMentorById } from '../data/mentors.js';

export default function Checkout(){
  const location = useLocation();
  const navigate = useNavigate();
  const { wallet, payAndBookSession } = useUser();
  const order = location.state;

  const [method, setMethod] = React.useState('card');
  const [card, setCard] = React.useState({ number:'', expiry:'', cvc:'' });
  const [errors, setErrors] = React.useState({});
  const [processing, setProcessing] = React.useState(false);

  if(!order){
    return (
      <DashboardLayout>
        <div className="dash-empty">
          No pending order — <Link to="/book-session">book a session</Link> to check out.
        </div>
      </DashboardLayout>
    );
  }

  const mentor = getMentorById(order.mentorId);
  const canPayWallet = wallet.balance >= order.price;

  const onPay = (e)=>{
    e.preventDefault();
    const errs = {};
    if(method==='card'){
      if(!/^\d{12,19}$/.test(card.number.replace(/\s/g,''))) errs.number = 'Enter a valid card number.';
      if(!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.expiry = 'MM/YY';
      if(!/^\d{3,4}$/.test(card.cvc)) errs.cvc = 'CVC';
    }
    setErrors(errs);
    if(Object.keys(errs).length) return;

    setProcessing(true);
    setTimeout(()=>{
      const result = payAndBookSession({ ...order, method });
      setProcessing(false);
      if(result.ok) navigate(`/session/${result.bookingId}`);
      else setErrors({ form: result.error });
    }, 600);
  };

  return (
    <DashboardLayout title="Checkout" subtitle="Confirm and pay for your session.">
      <div className="two-col-dash" style={{alignItems:'flex-start'}}>
        <form className="col-card" onSubmit={onPay}>
          <h3>Payment method</h3>
          <div className="role-grid" style={{gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px'}}>
            <div className={`role-card ${method==='card'?'selected':''}`} onClick={()=>setMethod('card')} style={{padding:'16px'}}>
              <b style={{fontSize:'14px'}}>💳 Card</b>
              <span style={{fontSize:'12px'}}>Visa, Mastercard, Amex</span>
            </div>
            <div className={`role-card ${method==='wallet'?'selected':''}`} onClick={()=>canPayWallet && setMethod('wallet')} style={{padding:'16px', opacity: canPayWallet?1:0.5, cursor: canPayWallet?'pointer':'not-allowed'}}>
              <b style={{fontSize:'14px'}}>◎ Wallet</b>
              <span style={{fontSize:'12px'}}>Balance: ${wallet.balance.toFixed(2)}{!canPayWallet && ' — not enough'}</span>
            </div>
          </div>

          {method==='card' ? (
            <>
              <div className="form-group">
                <label className="form-label">Card number</label>
                <input className={`form-input ${errors.number?'err':''}`} type="text" placeholder="4242 4242 4242 4242" value={card.number} onChange={e=>setCard(c=>({ ...c, number:e.target.value }))} />
                {errors.number && <div className="form-error">{errors.number}</div>}
              </div>
              <div className="form-group" style={{display:'flex', gap:'12px'}}>
                <div style={{flex:1}}>
                  <label className="form-label">Expiry</label>
                  <input className={`form-input ${errors.expiry?'err':''}`} type="text" placeholder="MM/YY" value={card.expiry} onChange={e=>setCard(c=>({ ...c, expiry:e.target.value }))} />
                  {errors.expiry && <div className="form-error">{errors.expiry}</div>}
                </div>
                <div style={{flex:1}}>
                  <label className="form-label">CVC</label>
                  <input className={`form-input ${errors.cvc?'err':''}`} type="text" placeholder="123" value={card.cvc} onChange={e=>setCard(c=>({ ...c, cvc:e.target.value }))} />
                  {errors.cvc && <div className="form-error">{errors.cvc}</div>}
                </div>
              </div>
              <div className="form-hint">This is a demo checkout — no real card is charged.</div>
            </>
          ) : (
            <div className="dash-empty" style={{textAlign:'left'}}>
              ${order.price.toFixed(2)} will be deducted from your wallet balance immediately.
            </div>
          )}

          {errors.form && <div className="form-error" style={{marginTop:'10px'}}>{errors.form}</div>}

          <button type="submit" className="btn-primary-lg btn-full" style={{marginTop:'16px'}} disabled={processing}>
            {processing ? 'Processing…' : `Pay $${order.price.toFixed(2)} →`}
          </button>
        </form>

        <div className="col-card" style={{alignSelf:'flex-start'}}>
          <h3>Order summary</h3>
          <ul style={{listStyle:'none', marginTop:'10px'}}>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Mentor <b style={{color:'var(--text)'}}>{mentor?.name}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Session <b style={{color:'var(--text)'}}>{order.sessionType}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>When <b style={{color:'var(--text)'}}>{order.day}, {order.time}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'12px 0 0', fontSize:'14px'}}>Total <b style={{color:'var(--accent)'}}>${order.price.toFixed(2)}</b></li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
