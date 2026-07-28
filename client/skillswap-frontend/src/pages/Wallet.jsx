import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';

const TOPUP_AMOUNTS = [10, 25, 50, 100];

export default function Wallet(){
  const { wallet, transactions, topUpWallet } = useUser();
  const [custom, setCustom] = React.useState('');
  const [justAdded, setJustAdded] = React.useState(null);

  const walletTx = transactions.filter(t=>t.type==='topup' || (t.type==='session_payment' && t.method==='wallet') || (t.type==='refund'));

  const doTopUp = (amount)=>{
    if(!amount || amount<=0) return;
    topUpWallet(amount);
    setJustAdded(amount);
    setCustom('');
    setTimeout(()=>setJustAdded(null), 2500);
  };

  return (
    <DashboardLayout title="Wallet" subtitle="Your SkillSwap credit balance, used for faster checkout on sessions.">
      <div className="two-col-dash" style={{alignItems:'flex-start'}}>
        <div>
          <div className="wallet-balance-card">
            <span>Current balance</span>
            <b>${wallet.balance.toFixed(2)}</b>
            {justAdded && <div className="wallet-toast">+${justAdded.toFixed(2)} added ✓</div>}
          </div>

          <div className="col-card">
            <h3>Add credit</h3>
            <div className="desc">Top up your wallet to pay for sessions instantly at checkout.</div>
            <div className="tag-pills">
              {TOPUP_AMOUNTS.map(a=>(
                <span key={a} onClick={()=>doTopUp(a)}>+${a}</span>
              ))}
            </div>
            <div style={{display:'flex', gap:'10px', marginTop:'14px'}}>
              <input className="form-input" type="number" min="1" placeholder="Custom amount" value={custom} onChange={e=>setCustom(e.target.value)} />
              <button className="btn-solid" onClick={()=>doTopUp(Number(custom))}>Add</button>
            </div>
          </div>
        </div>

        <div className="col-card" style={{alignSelf:'flex-start'}}>
          <h3>Recent wallet activity</h3>
          {walletTx.length===0 ? (
            <div className="dash-empty">No wallet activity yet.</div>
          ) : (
            <ul style={{listStyle:'none', marginTop:'10px'}}>
              {walletTx.slice(0,6).map(t=>(
                <li key={t.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:'12.5px', color:'var(--muted)'}}>
                  <span>{t.description}</span>
                  <b style={{color: t.amount>0 ? 'var(--accent)' : 'var(--text)'}}>{t.amount>0?'+':''}${t.amount.toFixed(2)}</b>
                </li>
              ))}
            </ul>
          )}
          <Link to="/payments" className="linklike" style={{display:'inline-block', marginTop:'14px'}}>View full payment history →</Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
