import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function AccountSettings(){
  const navigate = useNavigate();
  const { profile, isAdmin, settings, updateProfile, updateSettings, toggleConnectedAccount, changePassword, deleteAccount } = useUser();
  const toast = useToast();

  const [email, setEmail] = React.useState(profile.email);
  const [pw, setPw] = React.useState({ current:'', next:'', confirm:'' });
  const [pwStatus, setPwStatus] = React.useState(null);
  const [pwError, setPwError] = React.useState('');
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);

  const saveEmail = (e)=>{ e.preventDefault(); updateProfile({ email }); toast.success('Email address updated.'); };

  const submitPw = async (e)=>{
    e.preventDefault();
    setPwError(''); setPwStatus(null);
    if(pw.next.length<8){ setPwError('New password must be at least 8 characters.'); return; }
    if(pw.next!==pw.confirm){ setPwError("New passwords don't match."); return; }
    const res = await changePassword(pw);
    if(res.ok){ setPwStatus('Password updated.'); setPw({ current:'', next:'', confirm:'' }); toast.success('Password updated.'); }
    else { toast.error(res.error || 'Could not update password.'); }
  };

  const doDelete = async ()=>{
    const res = await deleteAccount();
    if(res.ok) navigate('/');
  };

  return (
    <DashboardLayout title="Account Settings" subtitle="Manage your login, notifications, and connected accounts.">
      <div className="col-card" style={{maxWidth:'560px', marginBottom:'20px'}}>
        <h3>Email address</h3>
        <form onSubmit={saveEmail} style={{display:'flex', gap:'10px', marginTop:'10px'}}>
          <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{flex:1}} />
          <button type="submit" className="btn-outline">Save</button>
        </form>
        {isAdmin && <div className="form-hint" style={{marginTop:'10px', color:'var(--accent)'}}>✦ This account has admin access.</div>}
      </div>

      <div className="col-card" style={{maxWidth:'560px', marginBottom:'20px'}}>
        <h3>Change password</h3>
        <form onSubmit={submitPw}>
          <div className="form-group" style={{marginTop:'10px'}}>
            <label className="form-label">Current password</label>
            <input className="form-input" type="password" value={pw.current} onChange={e=>setPw(p=>({ ...p, current:e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">New password</label>
            <input className="form-input" type="password" value={pw.next} onChange={e=>setPw(p=>({ ...p, next:e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm new password</label>
            <input className="form-input" type="password" value={pw.confirm} onChange={e=>setPw(p=>({ ...p, confirm:e.target.value }))} />
          </div>
          {pwError && <div className="form-error">{pwError}</div>}
          {pwStatus && <div className="form-hint" style={{color:'var(--accent)'}}>{pwStatus}</div>}
          <button type="submit" className="btn-outline">Update password</button>
        </form>
      </div>

      <div className="col-card" style={{maxWidth:'560px', marginBottom:'20px'}}>
        <h3>Notification preferences</h3>
        <div className="settings-toggle-list">
          <label className="settings-toggle">
            <div><b>Email notifications</b><span>Session reminders, messages, and match recommendations</span></div>
            <input type="checkbox" checked={settings.emailNotifs} onChange={()=>updateSettings({ emailNotifs:!settings.emailNotifs })} />
          </label>
          <label className="settings-toggle">
            <div><b>Push notifications</b><span>Real-time alerts in your browser</span></div>
            <input type="checkbox" checked={settings.pushNotifs} onChange={()=>updateSettings({ pushNotifs:!settings.pushNotifs })} />
          </label>
          <label className="settings-toggle">
            <div><b>SMS notifications</b><span>Text reminders before a booked session</span></div>
            <input type="checkbox" checked={settings.smsNotifs} onChange={()=>updateSettings({ smsNotifs:!settings.smsNotifs })} />
          </label>
        </div>
      </div>

      <div className="col-card" style={{maxWidth:'560px', marginBottom:'20px'}}>
        <h3>Connected accounts</h3>
        <div className="settings-toggle-list">
          <label className="settings-toggle">
            <div><b>Google</b><span>{settings.connectedGoogle ? 'Connected' : 'Not connected'}</span></div>
            <button type="button" className="btn-outline" onClick={()=>toggleConnectedAccount('Google')}>{settings.connectedGoogle ? 'Disconnect' : 'Connect'}</button>
          </label>
          <label className="settings-toggle">
            <div><b>GitHub</b><span>{settings.connectedGithub ? 'Connected' : 'Not connected'}</span></div>
            <button type="button" className="btn-outline" onClick={()=>toggleConnectedAccount('Github')}>{settings.connectedGithub ? 'Disconnect' : 'Connect'}</button>
          </label>
        </div>
      </div>

      <div className="col-card danger-zone" style={{maxWidth:'560px'}}>
        <h3>Danger zone</h3>
        <p className="desc">Permanently delete your account and all associated data. This can't be undone.</p>
        {!confirmingDelete ? (
          <button className="btn-outline" style={{borderColor:'var(--danger)', color:'var(--danger)'}} onClick={()=>setConfirmingDelete(true)}>Delete account</button>
        ) : (
          <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
            <span style={{fontSize:'12.5px', color:'var(--danger)'}}>Are you sure?</span>
            <button className="btn-solid" style={{background:'var(--danger)', boxShadow:'none'}} onClick={doDelete}>Yes, delete everything</button>
            <button className="btn-ghost-lg" onClick={()=>setConfirmingDelete(false)}>Cancel</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
