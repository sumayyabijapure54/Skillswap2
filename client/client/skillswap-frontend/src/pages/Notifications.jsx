import React from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';

const TYPE_ICON = { booking:'📅', message:'💬', recommendation:'✦', system:'🔔' };
const FILTERS = ['all', 'booking', 'message', 'recommendation', 'system'];

export default function Notifications(){
  const { notifications, markNotifRead, markAllNotifsRead } = useUser();
  const [filter, setFilter] = React.useState('all');

  const filtered = filter==='all' ? notifications : notifications.filter(n=>n.type===filter);
  const unreadCount = notifications.filter(n=>!n.read).length;

  return (
    <DashboardLayout title="Notifications" subtitle="Every alert in one place — bookings, messages, and recommendations.">
      <div className="notif-toolbar">
        <div className="tag-pills" style={{marginBottom:0}}>
          {FILTERS.map(f=>(
            <span key={f} onClick={()=>setFilter(f)} style={filter===f?{color:'var(--accent)', borderColor:'var(--accent)'}:{}}>{f[0].toUpperCase()+f.slice(1)}</span>
          ))}
        </div>
        {unreadCount>0 && <button className="linklike" onClick={markAllNotifsRead}>Mark all as read ({unreadCount})</button>}
      </div>

      {filtered.length===0 ? (
        <div className="dash-empty">No notifications in this category.</div>
      ) : (
        <div className="notif-list">
          {filtered.map(n=>(
            <div className={`notif-item ${n.read?'':'unread'}`} key={n.id} onClick={()=>markNotifRead(n.id)}>
              <div className="notif-ic">{TYPE_ICON[n.type] || '🔔'}</div>
              <div className="notif-body">
                <p>{n.text}</p>
                <span>{n.time}</span>
              </div>
              {!n.read && <div className="notif-dot"></div>}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
