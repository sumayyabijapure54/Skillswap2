import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { api } from '../lib/api.js';
import { getSocket } from '../lib/socket.js';

function timeLabel(iso){
  return new Date(iso).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
}

export default function Messages(){
  const { profile } = useUser();
  const [params] = useSearchParams();
  const userParam = params.get('user');

  const [conversations, setConversations] = React.useState([]);
  const [loadingList, setLoadingList] = React.useState(true);
  const [activeId, setActiveId] = React.useState(userParam || null);
  const [thread, setThread] = React.useState(null); // { messages, otherUser }
  const [draft, setDraft] = React.useState('');
  const bottomRef = React.useRef(null);

  const loadConversations = React.useCallback(() => {
    api.get('/api/messages/conversations')
      .then(data => {
        const list = data.conversations || [];
        setConversations(list);
        if (!activeId && list.length>0) setActiveId(list[0].userId);
      })
      .catch(()=>{})
      .finally(()=>setLoadingList(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(()=>{ loadConversations(); }, [loadConversations]);

  React.useEffect(()=>{
    if (userParam) setActiveId(userParam);
  }, [userParam]);

  React.useEffect(()=>{
    if (!activeId) { setThread(null); return; }
    let alive = true;
    api.get(`/api/messages/${activeId}`)
      .then(data => { if (alive) setThread(data); })
      .catch(()=>{ if (alive) setThread(null); });
    return () => { alive = false; };
  }, [activeId]);

  // Live incoming messages — the backend pushes `message:new` over
  // socket.io the moment either side sends one (see
  // server/src/controllers/messagesController.js).
  React.useEffect(()=>{
    const socket = getSocket();
    if (!socket) return undefined;

    const onMessage = (message) => {
      const otherId = message.from === profile.id ? message.to : message.from;
      setThread(t => (t && otherId === activeId) ? { ...t, messages: [...t.messages, message] } : t);
      loadConversations();
    };
    socket.on('message:new', onMessage);
    return () => socket.off('message:new', onMessage);
  }, [activeId, profile.id, loadConversations]);

  React.useEffect(()=>{
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [thread]);

  const onSend = async (e)=>{
    e.preventDefault();
    const text = draft.trim();
    if(!text || !activeId) return;
    setDraft('');
    try{
      const data = await api.post(`/api/messages/${activeId}`, { text });
      setThread(t => t ? { ...t, messages: [...t.messages, data.message] } : t);
      loadConversations();
    }catch{ /* best-effort */ }
  };

  if (loadingList) {
    return <DashboardLayout title="Messages" subtitle="Your conversations with mentors and members."><div className="dash-empty">Loading conversations…</div></DashboardLayout>;
  }

  if (conversations.length===0 && !userParam){
    return (
      <DashboardLayout title="Messages" subtitle="Your conversations with mentors and members.">
        <div className="dash-empty">
          No conversations yet. Visit a <Link to="/explore">mentor's profile</Link> and hit Message to start one.
        </div>
      </DashboardLayout>
    );
  }

  const activeConvo = conversations.find(c=>c.userId===activeId);
  const otherUser = thread?.otherUser || activeConvo;

  return (
    <DashboardLayout>
      <div className="chat-shell">
        <aside className="chat-list">
          <h4 style={{padding:'0 14px', marginBottom:'14px', fontSize:'13px'}}>Conversations</h4>
          {conversations.map(c=>(
            <div key={c.userId} className={`chat-list-item ${activeId===c.userId?'active':''}`} onClick={()=>setActiveId(c.userId)}>
              <div className="dash-user-av" style={{width:'36px', height:'36px', fontSize:'12px'}}>{c.initials}</div>
              <div className="chat-list-info">
                <b>{c.name}</b>
                <span>{c.lastMessage ? c.lastMessage.slice(0,38)+(c.lastMessage.length>38?'…':'') : 'No messages yet'}</span>
              </div>
              {c.unread>0 && <span className="chat-unread-badge">{c.unread}</span>}
            </div>
          ))}
        </aside>

        <div className="chat-pane">
          {activeId && otherUser ? (
            <>
              <div className="chat-pane-head">
                <div className="dash-user-av" style={{width:'34px', height:'34px', fontSize:'12px'}}>{otherUser.initials}</div>
                <div>
                  <b style={{fontSize:'13.5px'}}>{otherUser.name}</b>
                </div>
              </div>

              <div className="chat-messages">
                {(!thread || thread.messages.length===0) && <div className="dash-empty" style={{margin:'20px'}}>Say hello 👋</div>}
                {thread?.messages.map(m=>(
                  <div key={m.id} className={`chat-bubble-row ${m.from===profile.id?'me':''}`}>
                    <div className="chat-bubble">{m.text}</div>
                    <span className="chat-time">{timeLabel(m.createdAt)}</span>
                  </div>
                ))}
                <div ref={bottomRef}></div>
              </div>

              <form className="chat-input-row" onSubmit={onSend}>
                <input type="text" placeholder="Type a message…" value={draft} onChange={e=>setDraft(e.target.value)} />
                <button type="submit" className="btn-solid">Send</button>
              </form>
            </>
          ) : (
            <div className="dash-empty" style={{margin:'40px'}}>Select a conversation to start chatting.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
