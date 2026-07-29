// Run with: node generate-skills.js  →  writes src/data/skills.generated.js
// This is a build-time helper, not part of the shipped app.
const fs = require('fs');

const SAMPLE_VIDEOS = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
];
const vid = i => SAMPLE_VIDEOS[Math.abs(i) % SAMPLE_VIDEOS.length];

// category -> { icon, label, mentorIds (cycled), titleTemplates, tagPool }
const CATS = {
  'programming': {
    mentors: ['alex-johnson'],
    titles: ['Python for Beginners','JavaScript Deep Dive','Data Structures & Algorithms','Git & GitHub Essentials','Backend APIs with Node.js','SQL for Developers','Clean Code Principles','Object-Oriented Programming in Java','Introduction to Rust','TypeScript from Scratch','Docker & Containers 101','Testing with Jest'],
    tags: ['Programming','Software Engineering','Coding']
  },
  'ai-ml': {
    mentors: ['ravi-patel'],
    titles: ['Machine Learning Foundations','Deep Learning with PyTorch','Prompt Engineering for LLMs','Intro to Neural Networks','Building AI Chatbots','Computer Vision Basics','Natural Language Processing 101','Data Science with Python','MLOps Fundamentals','Generative AI in Practice'],
    tags: ['AI', 'Machine Learning', 'Python']
  },
  'web-development': {
    mentors: ['alex-johnson'],
    titles: ['Full-Stack Web Development','Modern CSS & Flexbox','Building REST APIs','Next.js in Practice','Web Performance Optimization','Responsive Web Design','Vue.js Fundamentals','GraphQL Essentials','Web Accessibility (a11y) Basics','Progressive Web Apps'],
    tags: ['Web Development', 'HTML', 'CSS']
  },
  'mobile-development': {
    mentors: ['liam-chen'],
    titles: ['React Native from Scratch','Flutter App Development','iOS Development with Swift','Android Development with Kotlin','Mobile UI/UX Patterns','Publishing to the App Store','Cross-Platform App Architecture','State Management in Mobile Apps'],
    tags: ['Mobile Development', 'App Development']
  },
  'design': {
    mentors: ['sarah-williams'],
    titles: ['UX Research Fundamentals','Design Systems at Scale','Wireframing & Prototyping','Mobile App UI Design','User Testing Methods','Interaction Design Basics','Accessibility in Design','Design Thinking Workshop'],
    tags: ['UI/UX', 'Design', 'Figma']
  },
  'graphic-design': {
    mentors: ['nadia-hussain'],
    titles: ['Logo & Brand Identity Design','Adobe Illustrator Essentials','Adobe Photoshop for Beginners','Typography Fundamentals','Packaging Design Basics','Print Design Principles','Color Theory for Designers','Poster & Layout Design'],
    tags: ['Graphic Design', 'Branding', 'Illustrator']
  },
  'video-editing': {
    mentors: ['chris-park'],
    titles: ['Premiere Pro for Beginners','Color Grading Fundamentals','After Effects Motion Graphics','YouTube Video Editing Workflow','Short-Form Video Editing (Reels/TikTok)','Sound Design for Video','Cinematic Storytelling Basics'],
    tags: ['Video Editing', 'Premiere Pro', 'Motion Graphics']
  },
  'marketing': {
    mentors: ['david-smith'],
    titles: ['Social Media Marketing','Content Marketing Strategy','Email Marketing Fundamentals','Facebook & Instagram Ads','Copywriting for Marketers','Brand Strategy Basics','Influencer Marketing 101','Marketing Analytics Essentials'],
    tags: ['Marketing', 'Social Media', 'Growth']
  },
  'business': {
    mentors: ['david-smith'],
    titles: ['SEO & Growth Marketing','Startup Fundamentals','Freelancing & Client Management','Product Management Basics','Public Speaking for Professionals','Negotiation Skills','Business Analytics with Excel'],
    tags: ['Business', 'Strategy', 'Entrepreneurship']
  },
  'finance': {
    mentors: ['sofia-martins'],
    titles: ['Personal Budgeting 101','Investing for Beginners','Understanding the Stock Market','Financial Planning Essentials','Excel for Financial Modeling','Cryptocurrency Basics','Retirement Planning Fundamentals'],
    tags: ['Finance', 'Investing', 'Budgeting']
  },
  'languages': {
    mentors: ['emma-brown'],
    titles: ['Conversational Spanish','Conversational French','Mandarin Chinese for Beginners','Business English Communication','Japanese for Travel','German Grammar Essentials','Italian Conversation Practice'],
    tags: ['Language Learning', 'Grammar', 'Conversation']
  },
  'music': {
    mentors: ['james-carter'],
    titles: ['Music Theory Fundamentals','Guitar for Beginners','Piano Basics','Songwriting Workshop','Vocal Technique Essentials','Mixing & Mastering Basics','Electronic Music Production'],
    tags: ['Music', 'Instrument', 'Theory']
  },
  'photography': {
    mentors: ['maria-lopez'],
    titles: ['Landscape Photography','Photo Editing in Lightroom','Street Photography Basics','Product Photography Essentials','Manual Camera Settings Explained','Composition & Framing Techniques'],
    tags: ['Photography', 'Editing', 'Composition']
  },
  'cooking': {
    mentors: ['priya-sharma'],
    titles: ['Everyday Italian Cooking','Knife Skills for Home Cooks','Vegetarian Cooking Essentials','Sourdough Bread Baking','Asian Stir-Fry Fundamentals','Meal Prep for Beginners'],
    tags: ['Cooking', 'Recipes', 'Technique']
  },
  'fitness': {
    mentors: ['daniel-smith'],
    titles: ['Beginner Yoga Fundamentals','Home Bodyweight Training','Mobility & Flexibility Basics','Running Fundamentals','Nutrition Basics for Fitness','HIIT Workout Fundamentals'],
    tags: ['Fitness', 'Training', 'Wellness']
  }
};

const MENTOR_DIRECTORY = {
  'alex-johnson': { name:'Alex Johnson', initials:'AJ', role:'Full Stack Developer', rating:4.9, reviews:320 },
  'ravi-patel': { name:'Ravi Patel', initials:'RP', role:'AI/ML Engineer', rating:4.9, reviews:236 },
  'liam-chen': { name:'Liam Chen', initials:'LC', role:'Mobile App Developer', rating:4.8, reviews:198 },
  'sarah-williams': { name:'Sarah Williams', initials:'SW', role:'UI/UX Designer', rating:4.8, reviews:280 },
  'nadia-hussain': { name:'Nadia Hussain', initials:'NH', role:'Graphic Designer', rating:4.8, reviews:172 },
  'chris-park': { name:'Chris Park', initials:'CP', role:'Video Editor & Motion Designer', rating:4.7, reviews:151 },
  'david-smith': { name:'David Smith', initials:'DS', role:'Digital Marketer', rating:4.9, reviews:410 },
  'sofia-martins': { name:'Sofia Martins', initials:'SM', role:'Personal Finance Coach', rating:4.9, reviews:264 },
  'emma-brown': { name:'Emma Brown', initials:'EB', role:'English Tutor', rating:4.8, reviews:220 },
  'james-carter': { name:'James Carter', initials:'JC', role:'Music Producer', rating:4.7, reviews:165 },
  'maria-lopez': { name:'Maria Lopez', initials:'ML', role:'Portrait Photographer', rating:4.8, reviews:140 },
  'priya-sharma': { name:'Priya Sharma', initials:'PS', role:'Home Baker & Instructor', rating:4.9, reviews:305 },
  'daniel-smith': { name:'Daniel Smith', initials:'DS', role:'Certified Trainer', rating:4.7, reviews:190 }
};

const LEVELS = ['Beginner','Intermediate','Advanced'];
const LESSON_TITLES = [
  'Getting oriented: tools & setup',
  'Core concepts walkthrough',
  'Hands-on practice session',
  'Common mistakes to avoid',
  'Putting it all together'
];

function slugify(title){
  return title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

function seededRand(seed){
  // simple deterministic pseudo-random so re-running the generator is stable
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

let globalIndex = 0;
const usedIds = new Set();
const skills = [];

for(const [catKey, cat] of Object.entries(CATS)){
  cat.titles.forEach((title, i) => {
    globalIndex++;
    let id = slugify(title);
    if(usedIds.has(id)) id = `${id}-${catKey}`;
    usedIds.add(id);

    const mentorId = cat.mentors[i % cat.mentors.length];
    const mentorInfo = MENTOR_DIRECTORY[mentorId];
    const level = LEVELS[i % LEVELS.length];
    const r1 = seededRand(globalIndex);
    const r2 = seededRand(globalIndex * 7.3);
    const rating = Math.round((4.5 + r1 * 0.5) * 10) / 10;
    const students = Math.round(300 + r2 * 3800);
    const hours = 2 + Math.floor(seededRand(globalIndex * 3.1) * 5);
    const mins = Math.floor(seededRand(globalIndex * 5.7) * 60);
    const duration = `${hours}h ${String(mins).padStart(2,'0')}m`;

    const lessons = LESSON_TITLES.map((lt, li) => ({
      id: li+1,
      title: lt,
      duration: `${10 + (li*3)} min`,
      type: 'Video',
      videoUrl: vid(globalIndex + li)
    }));
    lessons.push({
      id: lessons.length+1,
      title: 'Checkpoint quiz',
      duration: '8 min',
      type: 'Quiz',
      quiz: [
        { q: `What's the main focus of "${title}"?`, options: ['Unrelated trivia', `Practical, hands-on skills in ${cat.tags[0]}`, 'Only theory, no practice', 'History of the field'], correct: 1 },
        { q: 'What level is this course aimed at?', options: LEVELS, correct: LEVELS.indexOf(level) },
        { q: 'What helps most when learning a new skill like this?', options: ['Skipping practice', 'Consistent, hands-on practice', 'Reading once and never returning', 'Avoiding feedback'], correct: 1 }
      ]
    });

    skills.push({
      id, title, category: catKey, level, rating, students, duration,
      description: `A practical, project-driven introduction to ${title.toLowerCase()} — built around real exercises so the skill actually sticks, not just theory.`,
      mentor: { id: mentorId, name: mentorInfo.name, initials: mentorInfo.initials, role: mentorInfo.role, rating: mentorInfo.rating, reviews: mentorInfo.reviews },
      prerequisites: ['No prior experience required', 'A device with a stable internet connection'],
      tags: cat.tags,
      previewVideoUrl: vid(globalIndex),
      lessons
    });
  });
}

const out = `// Auto-generated catalog entries — see generate-skills.js for the source
// templates. Safe to hand-edit individual entries afterward; re-running the
// generator will only affect entries you haven't customized separately.
export const generatedSkills = ${JSON.stringify(skills, null, 2)};
`;

fs.writeFileSync('src/data/skills.generated.js', out);
console.log(`Generated ${skills.length} skills across ${Object.keys(CATS).length} categories.`);
