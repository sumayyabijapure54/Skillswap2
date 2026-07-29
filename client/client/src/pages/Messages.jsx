import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { useUser } from '../context/UserContext.jsx';
import { getMentorById } from '../data/mentors.js';

export default function Messages(){
  const { conversations, getOrCreateConversation, sendMessage } = useUser();
  const [params] = useSearchParams();
  const mentorParam = params.get('mentor');

  const [activeId, setActiveId] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  const bottomRef = React.useRef(null);

  React.useEffect(()=>{
    if(mentorParam){
      const convo = getOrCreateConversation(mentorParam);
      setActiveId(convo.id);
    } else if(!activeId && conversations.length>0){
      setActiveId(conversations[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorParam]);

  React.useEffect(()=>{
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [activeId, conversations]);

  const active = conversations.find(c=>c.id===activeId) || conversations[0];
  const activeMentor = active ? getMentorById(active.mentorId) : null;

  const onSend = (e)=>{
    e.preventDefault();
    if(!draft.trim() || !active) return;
    sendMessage(active.id, draft.trim());
    setDraft('');
  };

  if(conversations.length===0){
    return (
      <DashboardLayout title="Messages" subtitle="Your conversations with mentors and members.">
        <div className="dash-empty">
          No conversations yet. Visit a <Link to="/explore">mentor's profile</Link> and hit Message to start one.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="chat-shell">
        <aside className="chat-list">
          <h4 style={{padding:'0 14px', marginBottom:'14px', fontSize:'13px'}}>Conversations</h4>
          {conversations.map(c=>{
            const m = getMentorById(c.mentorId);
            const last = c.messages[c.messages.length-1];
            return (
              <div key={c.id} className={`chat-list-item ${active?.id===c.id?'active':''}`} onClick={()=>setActiveId(c.id)}>
                <div className="dash-user-av" style={{width:'36px', height:'36px', fontSize:'12px'}}>{m?.initials}</div>
                <div className="chat-list-info">
                  <b>{m?.name || 'Member'}</b>
                  <span>{last ? last.text.slice(0,38)+(last.text.length>38?'…':'') : 'No messages yet'}</span>
                </div>
              </div>
            );
          })}
        </aside>

        <div className="chat-pane">
          {active ? (
            <>
              <div className="chat-pane-head">
                <div className="dash-user-av" style={{width:'34px', height:'34px', fontSize:'12px'}}>{activeMentor?.initials}</div>
                <div>
                  <b style={{fontSize:'13.5px'}}>{activeMentor?.name || 'Member'}</b>
                  <div style={{fontSize:'11px', color:'var(--muted)'}}>{activeMentor?.role}</div>
                </div>
                {activeMentor && <Link to={`/mentor/${activeMentor.id}`} className="btn-outline" style={{marginLeft:'auto', padding:'7px 14px', fontSize:'12px'}}>View profile</Link>}
              </div>

              <div className="chat-messages">
                {active.messages.length===0 && <div className="dash-empty" style={{margin:'20px'}}>Say hello 👋</div>}
                {active.messages.map(m=>(
                  <div key={m.id} className={`chat-bubble-row ${m.from==='me'?'me':''}`}>
                    <div className="chat-bubble">{m.text}</div>
                    <span className="chat-time">{m.time}</span>
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
