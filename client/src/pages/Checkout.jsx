import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { api } from '../lib/api.js';
import { openRazorpayCheckout } from '../lib/razorpay.js';

export default function Checkout(){
  const location = useLocation();
  const navigate = useNavigate();
  const { wallet, profile, refreshWallet } = useUser();
  const order = location.state;

  const [method, setMethod] = React.useState('wallet');
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState('');

  if(!order){
    return (
      <DashboardLayout>
        <div className="dash-empty">
          No pending order — <Link to="/book-session">book a session</Link> to check out.
        </div>
      </DashboardLayout>
    );
  }

  const canPayWallet = wallet.balance >= order.price;

  const payWithWallet = async () => {
    const { booking } = await api.post('/api/bookings/checkout', {
      skillId: order.skillId,
      scheduledAt: order.scheduledAt,
      durationMinutes: order.durationMinutes,
      sessionType: order.sessionType,
      price: order.price,
      method: 'wallet'
    });
    await refreshWallet();
    return booking;
  };

  const payWithRazorpay = () => new Promise((resolve, reject) => {
    api.post('/api/bookings/checkout/razorpay/create-order', {
      skillId: order.skillId,
      scheduledAt: order.scheduledAt,
      durationMinutes: order.durationMinutes,
      sessionType: order.sessionType,
      price: order.price
    }).then(razorpayOrder => {
      openRazorpayCheckout({
        order: razorpayOrder,
        user: profile,
        description: `${order.sessionType} with ${order.mentorName}`,
        onSuccess: async (response) => {
          try{
            const { booking } = await api.post('/api/bookings/checkout/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            resolve(booking);
          }catch(err){ reject(err); }
        },
        onFailure: (err) => reject(err)
      });
    }).catch(reject);
  });

  const onPay = async (e)=>{
    e.preventDefault();
    setError('');
    setProcessing(true);
    try{
      const booking = method==='wallet' ? await payWithWallet() : await payWithRazorpay();
      navigate(`/session/${booking.id}`);
    }catch(err){
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout title="Checkout" subtitle="Confirm and pay for your session.">
      <div className="two-col-dash" style={{alignItems:'flex-start'}}>
        <form className="col-card" onSubmit={onPay}>
          <h3>Payment method</h3>
          <div className="role-grid" style={{gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'18px'}}>
            <div className={`role-card ${method==='wallet'?'selected':''}`} onClick={()=>setMethod('wallet')} style={{padding:'16px', opacity: canPayWallet ? 1 : 0.5}}>
              <b style={{fontSize:'14px'}}>Wallet</b>
              <span style={{fontSize:'12px', display:'block'}}>Balance: ${wallet.balance.toFixed(2)}</span>
              {!canPayWallet && <span style={{fontSize:'11px', color:'var(--danger)'}}>Insufficient balance</span>}
            </div>
            <div className={`role-card ${method==='card'?'selected':''}`} onClick={()=>setMethod('card')} style={{padding:'16px'}}>
              <b style={{fontSize:'14px'}}>Card / UPI</b>
              <span style={{fontSize:'12px', display:'block'}}>Pay via Razorpay</span>
            </div>
          </div>

          {method==='card' && (
            <div className="desc" style={{marginBottom:'12px'}}>You'll be taken to Razorpay's secure checkout to complete payment.</div>
          )}

          {error && <div className="field-error" style={{marginBottom:'12px'}}>{error}</div>}

          <button type="submit" className="btn-primary-lg btn-full" disabled={processing || (method==='wallet' && !canPayWallet)}>
            {processing ? 'Processing…' : `Pay $${order.price} →`}
          </button>
        </form>

        <div className="col-card" style={{alignSelf:'flex-start'}}>
          <h3>Order summary</h3>
          <ul style={{listStyle:'none'}}>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Mentor <b style={{color:'var(--text)'}}>{order.mentorName}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Skill <b style={{color:'var(--text)'}}>{order.skillTitle}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>Type <b style={{color:'var(--text)'}}>{order.sessionType}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>When <b style={{color:'var(--text)'}}>{new Date(order.scheduledAt).toLocaleString(undefined, { dateStyle:'medium', timeStyle:'short' })}</b></li>
            <li style={{display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:'12.5px', color:'var(--muted)'}}>Price <b style={{color:'var(--text)'}}>${order.price}</b></li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
