import { generatedSkills } from './skills.generated.js';
import { videoForIndex } from './videoSources.js';

export const categories = [
  { key:'programming', label:'Programming', icon:'</>' },
  { key:'ai-ml', label:'AI & Machine Learning', icon:'🤖' },
  { key:'web-development', label:'Web Development', icon:'🖥️' },
  { key:'mobile-development', label:'Mobile Development', icon:'📱' },
  { key:'design', label:'UI/UX Design', icon:'🎨' },
  { key:'graphic-design', label:'Graphic Design', icon:'🖌️' },
  { key:'video-editing', label:'Video Editing', icon:'🎬' },
  { key:'marketing', label:'Marketing', icon:'📣' },
  { key:'business', label:'Business', icon:'💼' },
  { key:'finance', label:'Finance', icon:'💰' },
  { key:'languages', label:'Language Learning', icon:'🌐' },
  { key:'music', label:'Music', icon:'🎵' },
  { key:'photography', label:'Photography', icon:'📷' },
  { key:'cooking', label:'Cooking', icon:'🍳' },
  { key:'fitness', label:'Fitness', icon:'🏋' }
];

export const levels = ['Beginner', 'Intermediate', 'Advanced'];

const flagshipSkills = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    category: 'programming',
    level: 'Beginner',
    rating: 4.9,
    students: 3120,
    duration: '6h 40m',
    description: 'Build modern, component-driven interfaces with React. Learn hooks, state, props, and how to structure real projects from scratch.',
    mentor: { id:'alex-johnson', name:'Alex Johnson', initials:'AJ', role:'Full Stack Developer', rating:4.9, reviews:320  },
    prerequisites: ['Basic HTML & CSS', 'Fundamentals of JavaScript (ES6+)', 'A code editor installed (VS Code recommended)'],
    tags: ['React', 'JavaScript', 'Frontend'],
    previewVideoUrl: videoForIndex(0),
    lessons: [
      { id:1, title:'Why React? Component thinking', duration:'12 min', type:'Video', videoUrl: videoForIndex(1) },
      { id:2, title:'JSX and rendering elements', duration:'18 min', type:'Video', videoUrl: videoForIndex(2) },
      { id:3, title:'Props and component composition', duration:'22 min', type:'Video', videoUrl: videoForIndex(3) },
      { id:4, title:'State with useState', duration:'20 min', type:'Video', videoUrl: videoForIndex(4) },
      { id:5, title:'Side effects with useEffect', duration:'24 min', type:'Video', videoUrl: videoForIndex(0) },
      { id:6, title:'Checkpoint quiz', duration:'10 min', type:'Quiz', quiz:[
        { q:'What does JSX compile down to?', options:['HTML strings','React.createElement() calls','Web Components','CSS-in-JS'], correct:1 },
        { q:'Which hook lets a component "remember" a value between renders?', options:['useEffect','useContext','useState','useMemo only'], correct:2 },
        { q:'When does a useEffect with an empty dependency array [] run?', options:['On every render','Only once, after the first render','Never','Only on unmount'], correct:1 }
      ] },
      { id:7, title:'Building a small project', duration:'34 min', type:'Video', videoUrl: videoForIndex(1) }
    ]
  },
  {
    id: 'figma-ui-design',
    title: 'UI Design in Figma',
    category: 'design',
    level: 'Beginner',
    rating: 4.8,
    students: 2210,
    duration: '5h 10m',
    description: 'Go from blank canvas to polished, responsive UI screens in Figma — covering auto layout, components, and design systems.',
    mentor: { id:'sarah-williams', name:'Sarah Williams', initials:'SW', role:'UI/UX Designer', rating:4.8, reviews:280  },
    prerequisites: ['A free Figma account', 'No prior design experience required'],
    tags: ['Figma', 'UI Design', 'Prototyping'],
    previewVideoUrl: videoForIndex(10),
    lessons: [
      { id:1, title:'Figma workspace tour', duration:'10 min', type:'Video', videoUrl: videoForIndex(1) },
      { id:2, title:'Frames, layers, and grids', duration:'16 min', type:'Video', videoUrl: videoForIndex(2) },
      { id:3, title:'Auto layout essentials', duration:'20 min', type:'Video', videoUrl: videoForIndex(3) },
      { id:4, title:'Building a component library', duration:'26 min', type:'Video', videoUrl: videoForIndex(4) },
      { id:5, title:'Checkpoint quiz', duration:'8 min', type:'Quiz', quiz:[
        { q:'What is Auto Layout used for in Figma?', options:['Adding animations','Making frames resize responsively around their content','Exporting to code','Version history'], correct:1 },
        { q:'What is the main benefit of building a component library?', options:['It makes files smaller','Consistent, reusable UI pieces across a design','It disables prototyping','It auto-generates copy'], correct:1 },
        { q:'What does "handoff" typically refer to?', options:['Renaming a file','Passing finished designs to developers with specs/assets','Deleting old versions','Merging two frames'], correct:1 }
      ] },
      { id:6, title:'Prototyping and handoff', duration:'18 min', type:'Video', videoUrl: videoForIndex(6) }
    ]
  },
  {
    id: 'seo-fundamentals',
    title: 'SEO & Growth Marketing',
    category: 'business',
    level: 'Intermediate',
    rating: 4.9,
    students: 4100,
    duration: '4h 30m',
    description: 'Learn practical, up-to-date SEO tactics and how to read analytics dashboards to drive real organic growth.',
    mentor: { id:'david-smith', name:'David Smith', initials:'DS', role:'Digital Marketer', rating:4.9, reviews:410  },
    prerequisites: ['A live website or blog (optional but helpful)', 'A Google account for Analytics/Search Console'],
    tags: ['SEO', 'Google Ads', 'Analytics'],
    previewVideoUrl: videoForIndex(11),
    lessons: [
      { id:1, title:'How search engines rank pages', duration:'14 min', type:'Video', videoUrl: videoForIndex(1) },
      { id:2, title:'Keyword research workflow', duration:'22 min', type:'Video', videoUrl: videoForIndex(2) },
      { id:3, title:'On-page optimization', duration:'20 min', type:'Video', videoUrl: videoForIndex(3) },
      { id:4, title:'Reading Search Console data', duration:'18 min', type:'Video', videoUrl: videoForIndex(4) },
      { id:5, title:'Checkpoint quiz', duration:'9 min', type:'Quiz', quiz:[
        { q:'What does "organic" traffic mean?', options:['Paid ad clicks','Unpaid visits from search engine results', 'Social media traffic only', 'Email newsletter clicks'], correct:1 },
        { q:'Which tool would you check to see what search queries bring people to your site?', options:['Google Search Console','Photoshop','Figma','Slack'], correct:0 },
        { q:'What is "on-page optimization" mainly about?', options:['Buying backlinks','Improving elements on your own page (titles, content, structure)','Running Facebook ads','Server uptime'], correct:1 }
      ] }
    ]
  },
  {
    id: 'conversational-english',
    title: 'Conversational English (IELTS Prep)',
    category: 'languages',
    level: 'Intermediate',
    rating: 4.8,
    students: 1980,
    duration: '7h 20m',
    description: 'Sharpen fluency, grammar, and exam technique for IELTS speaking and writing sections with structured practice drills.',
    mentor: { id:'emma-brown', name:'Emma Brown', initials:'EB', role:'English Tutor', rating:4.8, reviews:220  },
    prerequisites: ['Comfortable with basic English conversation', 'A quiet space for speaking practice'],
    tags: ['English', 'Grammar', 'IELTS'],
    previewVideoUrl: videoForIndex(12),
    lessons: [
      { id:1, title:'IELTS speaking format overview', duration:'10 min', type:'Video', videoUrl: videoForIndex(1) },
      { id:2, title:'Common grammar pitfalls', duration:'18 min', type:'Video', videoUrl: videoForIndex(2) },
      { id:3, title:'Building fluent answers', duration:'22 min', type:'Video', videoUrl: videoForIndex(3) },
      { id:4, title:'Practice test 1', duration:'30 min', type:'Video', videoUrl: videoForIndex(4) },
      { id:5, title:'Checkpoint quiz', duration:'10 min', type:'Quiz', quiz:[
        { q:'What most commonly costs IELTS speaking candidates points?', options:['Perfect grammar','Hesitation and filler words','Speaking too slowly on purpose','Using a British accent'], correct:1 },
        { q:"What is a good strategy when you don't know a word mid-sentence?", options:['Stop talking entirely','Paraphrase around it and keep going','Switch to your native language','Ask to restart the test'], correct:1 },
        { q:'How many parts does the IELTS Speaking test typically have?', options:['1','2','3','5'], correct:2 }
      ] }
    ]
  },
  {
    id: 'music-production-basics',
    title: 'Music Production Basics',
    category: 'music',
    level: 'Beginner',
    rating: 4.7,
    students: 1540,
    duration: '5h 50m',
    description: 'Get hands-on with a DAW, learn beat-making fundamentals, mixing basics, and how to finish your first track.',
    mentor: { id:'james-carter', name:'James Carter', initials:'JC', role:'Music Producer', rating:4.7, reviews:165  },
    prerequisites: ['Any DAW installed (FL Studio, Ableton, or GarageBand)', 'Headphones or studio monitors'],
    tags: ['Production', 'Mixing', 'Beat-making'],
    previewVideoUrl: videoForIndex(13),
    lessons: [
      { id:1, title:'DAW basics and workflow', duration:'16 min', type:'Video', videoUrl: videoForIndex(1) },
      { id:2, title:'Programming your first beat', duration:'24 min', type:'Video', videoUrl: videoForIndex(2) },
      { id:3, title:'Layering melody and bass', duration:'20 min', type:'Video', videoUrl: videoForIndex(3) },
      { id:4, title:'Intro to mixing', duration:'22 min', type:'Video', videoUrl: videoForIndex(4) },
      { id:5, title:'Checkpoint quiz', duration:'8 min', type:'Quiz', quiz:[
        { q:'What does DAW stand for?', options:['Digital Audio Workstation','Direct Audio Wire','Dynamic Amplitude Wave','Dual Audio Width'], correct:0 },
        { q:'What is sidechain compression commonly used for?', options:['Making a track louder overall','Ducking one sound (e.g. bass) when another (e.g. kick) hits','Adding reverb','Recording vocals'], correct:1 },
        { q:'Why does the lesson recommend teaching inside whatever DAW you already use?', options:['All DAWs are identical','Fundamentals of mixing transfer regardless of software','You must switch software to learn properly','Free DAWs don\'t support mixing'], correct:1 }
      ] }
    ]
  },
  {
    id: 'portrait-photography',
    title: 'Portrait Photography',
    category: 'photography',
    level: 'Beginner',
    rating: 4.8,
    students: 1120,
    duration: '4h 05m',
    description: 'Master natural light, composition, and posing direction to shoot confident, professional-feeling portraits.',
    mentor: { id:'maria-lopez', name:'Maria Lopez', initials:'ML', role:'Portrait Photographer', rating:4.8, reviews:140  },
    prerequisites: ['Any camera (DSLR, mirrorless, or phone)', 'A willing subject to practice with'],
    tags: ['Portrait', 'Lighting', 'Composition'],
    previewVideoUrl: videoForIndex(14),
    lessons: [
      { id:1, title:'Understanding natural light', duration:'14 min', type:'Video', videoUrl: videoForIndex(1) },
      { id:2, title:'Composition and framing', duration:'16 min', type:'Video', videoUrl: videoForIndex(2) },
      { id:3, title:'Directing your subject', duration:'20 min', type:'Video', videoUrl: videoForIndex(3) },
      { id:4, title:'Checkpoint quiz', duration:'7 min', type:'Quiz', quiz:[
        { q:'What is generally the most flattering light for portraits?', options:['Harsh midday sun','Soft, diffused natural light','Direct on-camera flash','No light at all'], correct:1 },
        { q:'What does "directing your subject" mainly involve?', options:['Ignoring the subject entirely','Giving clear, simple posing and expression guidance','Only shooting candids','Editing after the fact'], correct:1 },
        { q:'Which is a composition technique mentioned for framing?', options:['Rule of thirds','Rule of fifths','Golden gate ratio','None of these'], correct:0 }
      ] }
    ]
  },
  {
    id: 'home-baking',
    title: 'Home Baking Essentials',
    category: 'cooking',
    level: 'Beginner',
    rating: 4.9,
    students: 2670,
    duration: '3h 45m',
    description: 'Build real baking intuition — measuring, mixing methods, and oven behavior — through five foundational recipes.',
    mentor: { id:'priya-sharma', name:'Priya Sharma', initials:'PS', role:'Home Baker & Instructor', rating:4.9, reviews:305  },
    prerequisites: ['A basic home oven', 'Standard baking tools (bowls, whisk, pans)'],
    tags: ['Baking', 'Recipes', 'Technique'],
    previewVideoUrl: videoForIndex(15),
    lessons: [
      { id:1, title:'Baking science 101', duration:'12 min', type:'Video', videoUrl: videoForIndex(1) },
      { id:2, title:'Your first loaf of bread', duration:'26 min', type:'Video', videoUrl: videoForIndex(2) },
      { id:3, title:'Cookies and cakes', duration:'22 min', type:'Video', videoUrl: videoForIndex(3) },
      { id:4, title:'Checkpoint quiz', duration:'8 min', type:'Quiz', quiz:[
        { q:'Why does baking rely more on precise measuring than general cooking?', options:['It doesn\'t, they\'re the same','Baking is a more exact chemical process','Ovens are always accurate','Flour never affects texture'], correct:1 },
        { q:'What is a common cause of a dense loaf of bread?', options:['Too much kneading only','Under-proofing (not enough rise time)','Using a bowl instead of a pan','Too little salt'], correct:1 },
        { q:'What does the lesson say is the goal of "baking science 101"?', options:['Memorizing recipes exactly','Building real intuition for why techniques work','Skipping measurements entirely','Only using pre-made mixes'], correct:1 }
      ] }
    ]
  },
  {
    id: 'strength-training-101',
    title: 'Strength Training 101',
    category: 'fitness',
    level: 'Beginner',
    rating: 4.7,
    students: 1890,
    duration: '4h 15m',
    description: 'Learn correct form for the core compound lifts and how to build a simple, sustainable weekly training split.',
    mentor: { id:'daniel-smith', name:'Daniel Smith', initials:'DS', role:'Certified Trainer', rating:4.7, reviews:190  },
    prerequisites: ['Access to a gym or basic home equipment', 'Doctor clearance if returning from injury'],
    tags: ['Strength', 'Form', 'Programming'],
    previewVideoUrl: videoForIndex(16),
    lessons: [
      { id:1, title:'Squat, hinge, push, pull, carry', duration:'16 min', type:'Video', videoUrl: videoForIndex(1) },
      { id:2, title:'Squat and deadlift form', duration:'24 min', type:'Video', videoUrl: videoForIndex(2) },
      { id:3, title:'Building your first split', duration:'18 min', type:'Video', videoUrl: videoForIndex(3) },
      { id:4, title:'Checkpoint quiz', duration:'8 min', type:'Quiz', quiz:[
        { q:'Which of these is one of the 5 fundamental movement patterns mentioned?', options:['Hinge','Spin','Float','Bounce'], correct:0 },
        { q:'Why are form checks over video emphasized?', options:['They aren\'t important','Bad form on compound lifts like squats/deadlifts risks injury','Only advanced lifters need form checks','Cameras improve strength directly'], correct:1 },
        { q:'What is a "split" in the context of a training program?', options:['A stretching exercise','How you divide muscle groups/workouts across the week','A type of protein shake','A competition category'], correct:1 }
      ] }
    ]
  }
];

export const skills = [...flagshipSkills, ...generatedSkills];

export function getSkillById(id){
  return skills.find(s=>s.id===id);
}

export function getSkillsByMentorId(mentorId){
  return skills.filter(s=>s.mentor.id===mentorId);
}
