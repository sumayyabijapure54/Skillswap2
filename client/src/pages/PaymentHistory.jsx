import React from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { api } from '../lib/api.js';
import { SkeletonRow } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useToast } from '../context/ToastContext.jsx';

const TYPE_LABEL = { topup:'Wallet top-up', session_payment:'Session payment', refund:'Refund' };
const TYPE_FILTERS = [
  { key:'all', label:'All' },
  { key:'session_payment', label:'Sessions' },
  { key:'topup', label:'Top-ups' },
  { key:'refund', label:'Refunds' }
];

export default function PaymentHistory(){
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all');
  const toast = useToast();

  React.useEffect(()=>{
    api.get('/api/wallet/transactions')
      .then(data => setTransactions(data.transactions || []))
      .catch(()=>{ toast.error('Could not load your transactions — please refresh to try again.'); })
      .finally(()=>setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = filter==='all' ? transactions : transactions.filter(t=>t.type===filter);
  const sorted = [...filtered].sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <DashboardLayout title="Payment History" subtitle="Every transaction on your account — top-ups, session payments, and refunds.">
      <div className="tag-pills" style={{marginBottom:'22px'}}>
        {TYPE_FILTERS.map(f=>(
          <span key={f.key} onClick={()=>setFilter(f.key)} style={filter===f.key?{color:'var(--accent)', borderColor:'var(--accent)'}:{}}>{f.label}</span>
        ))}
      </div>

      {loading ? (
        <div className="invoice-table">
          <div className="invoice-row invoice-head">
            <span>Description</span><span>Method</span><span>Date</span><span>Amount</span>
          </div>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : sorted.length===0 ? (
        <EmptyState icon="💳" title="No transactions" text="Nothing in this category yet." />
      ) : (
        <div className="invoice-table">
          <div className="invoice-row invoice-head">
            <span>Description</span><span>Method</span><span>Date</span><span>Amount</span>
          </div>
          {sorted.map(t=>(
            <div className="invoice-row" key={t.id}>
              <span>
                <b>{TYPE_LABEL[t.type] || t.type}</b>
                <div style={{fontSize:'11.5px', color:'var(--muted)'}}>{t.description}</div>
              </span>
              <span style={{textTransform:'capitalize'}}>{t.method}</span>
              <span>{new Date(t.createdAt).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' })}</span>
              <span style={{color: t.amount>0 ? 'var(--accent)' : 'var(--text)', fontWeight:700}}>{t.amount>0?'+':''}${t.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
