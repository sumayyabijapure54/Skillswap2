import React, { createContext, useContext, useEffect, useState } from 'react';

const CommunityContext = createContext(null);
const KEY = 'skillswap_community_v1';

const SEED_POSTS = [
  { id:'p1', type:'offer', author:{ name:'Maria Lopez', avatar:'https://i.pravatar.cc/150?img=32', initials:'ML' }, category:'photography', title:'Will teach portrait lighting for help with Spanish conversation', description:"I can walk you through natural-light portrait setups in exchange for regular Spanish conversation practice — I'm trying to get past intermediate.", tags:['Photography','Spanish','Swap'], createdAt: daysAgo(1) },
  { id:'p2', type:'request', author:{ name:'Owen Kim', avatar:'https://i.pravatar.cc/150?img=53', initials:'OK' }, category:'programming', title:'Looking for someone to review my first React project', description:"Built a small todo app following a tutorial and want honest feedback on structure before I keep going. Happy to trade UI feedback or copy editing.", tags:['React','Code Review'], createdAt: daysAgo(1) },
  { id:'p3', type:'offer', author:{ name:'Priya Sharma', avatar:'https://i.pravatar.cc/150?img=44', initials:'PS' }, category:'cooking', title:'Bread baking troubleshooting sessions, free this week', description:"Got a sourdough starter that won't rise, or a loaf that's always dense? I'll do 20-minute troubleshooting calls, no strings attached — just building my teaching reps.", tags:['Baking','Bread'], createdAt: daysAgo(2) },
  { id:'p4', type:'request', author:{ name:'Haruto Mori', avatar:'https://i.pravatar.cc/150?img=33', initials:'HM' }, category:'languages', title:'Want a conversation partner for IELTS speaking practice', description:"Test is in 5 weeks. Looking for 2x/week, 20-minute calls with someone patient enough to correct me mid-sentence.", tags:['English','IELTS'], createdAt: daysAgo(2) },
  { id:'p5', type:'offer', author:{ name:'David Smith', avatar:'https://i.pravatar.cc/150?img=13', initials:'DS' }, category:'business', title:'Free 30-min SEO audits for early-stage founders', description:"Running a handful of live audits this month to fill my calendar between client work. Bring your site, I'll bring Search Console.", tags:['SEO','Startups'], createdAt: daysAgo(3) },
  { id:'p6', type:'request', author:{ name:'Ines Vidal', avatar:'https://i.pravatar.cc/150?img=48', initials:'IV' }, category:'design', title:'Need eyes on my portfolio before I start applying', description:"3 case studies, mostly mobile app work. Would love feedback from anyone hiring or working as a product designer.", tags:['Portfolio','UI Design'], createdAt: daysAgo(4) },
  { id:'p7', type:'offer', author:{ name:'James Carter', avatar:'https://i.pravatar.cc/150?img=51', initials:'JC' }, category:'music', title:'Mixing feedback on your track, in exchange for a logo/cover art', description:"Send me a rough mix and I'll give you specific, actionable notes. Looking for someone who can design a quick single cover in return.", tags:['Mixing','Design Swap'], createdAt: daysAgo(5) },
  { id:'p8', type:'request', author:{ name:'Colin Farrell', avatar:'https://i.pravatar.cc/150?img=11', initials:'CF' }, category:'fitness', title:'Looking for a accountability partner for strength training', description:"Got a program, just need someone to check in with 2x/week so I actually stick to it through winter.", tags:['Strength','Accountability'], createdAt: daysAgo(6) }
];

function daysAgo(n){
  const d = new Date();
  d.setDate(d.getDate()-n);
  return d.toISOString();
}

function relativeTime(iso){
  const diffMs = Date.now() - new Date(iso).getTime();
  const hrs = Math.round(diffMs / 36e5);
  if(hrs < 1) return 'Just now';
  if(hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs/24);
  return `${days}d ago`;
}

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : SEED_POSTS;
  }catch{ return SEED_POSTS; }
}

export function CommunityProvider({ children }){
  const [posts, setPosts] = useState(load);

  useEffect(()=>{ localStorage.setItem(KEY, JSON.stringify(posts)); }, [posts]);

  const addPost = (post) => {
    const newPost = { id:`p-${Date.now()}`, createdAt:new Date().toISOString(), ...post };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  return (
    <CommunityContext.Provider value={{ posts, addPost, relativeTime }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity(){
  const ctx = useContext(CommunityContext);
  if(!ctx) throw new Error('useCommunity must be used inside <CommunityProvider>');
  return ctx;
}
