// Mirrors skillswap-frontend/src/data/skills.js exactly, so the API returns
// the same records the frontend was already rendering from mock data.

export const categories = [
  { key: 'programming', label: 'Programming', icon: '</>' },
  { key: 'design', label: 'Design', icon: '🎨' },
  { key: 'languages', label: 'Languages', icon: '🌐' },
  { key: 'business', label: 'Business', icon: '💼' },
  { key: 'music', label: 'Music', icon: '🎵' },
  { key: 'photography', label: 'Photography', icon: '📷' },
  { key: 'cooking', label: 'Cooking', icon: '🍳' },
  { key: 'fitness', label: 'Fitness', icon: '🏋' }
];

export const levels = ['Beginner', 'Intermediate', 'Advanced'];

export const skills = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    category: 'programming',
    level: 'Beginner',
    rating: 4.9,
    students: 3120,
    duration: '6h 40m',
    description: 'Build modern, component-driven interfaces with React. Learn hooks, state, props, and how to structure real projects from scratch.',
    mentor: { name: 'Alex Johnson', initials: 'AJ', role: 'Full Stack Developer', rating: 4.9, reviews: 320 },
    prerequisites: ['Basic HTML & CSS', 'Fundamentals of JavaScript (ES6+)', 'A code editor installed (VS Code recommended)'],
    tags: ['React', 'JavaScript', 'Frontend'],
    lessons: [
      { id: 1, title: 'Why React? Component thinking', duration: '12 min', type: 'Video' },
      { id: 2, title: 'JSX and rendering elements', duration: '18 min', type: 'Video' },
      { id: 3, title: 'Props and component composition', duration: '22 min', type: 'Video' },
      { id: 4, title: 'State with useState', duration: '20 min', type: 'Video' },
      { id: 5, title: 'Side effects with useEffect', duration: '24 min', type: 'Video' },
      { id: 6, title: 'Checkpoint quiz', duration: '10 min', type: 'Quiz' },
      { id: 7, title: 'Building a small project', duration: '34 min', type: 'Video' }
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
    mentor: { name: 'Sarah Williams', initials: 'SW', role: 'UI/UX Designer', rating: 4.8, reviews: 280 },
    prerequisites: ['A free Figma account', 'No prior design experience required'],
    tags: ['Figma', 'UI Design', 'Prototyping'],
    lessons: [
      { id: 1, title: 'Figma workspace tour', duration: '10 min', type: 'Video' },
      { id: 2, title: 'Frames, layers, and grids', duration: '16 min', type: 'Video' },
      { id: 3, title: 'Auto layout essentials', duration: '20 min', type: 'Video' },
      { id: 4, title: 'Building a component library', duration: '26 min', type: 'Video' },
      { id: 5, title: 'Checkpoint quiz', duration: '8 min', type: 'Quiz' },
      { id: 6, title: 'Prototyping and handoff', duration: '18 min', type: 'Video' }
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
    mentor: { name: 'David Smith', initials: 'DS', role: 'Digital Marketer', rating: 4.9, reviews: 410 },
    prerequisites: ['A live website or blog (optional but helpful)', 'A Google account for Analytics/Search Console'],
    tags: ['SEO', 'Google Ads', 'Analytics'],
    lessons: [
      { id: 1, title: 'How search engines rank pages', duration: '14 min', type: 'Video' },
      { id: 2, title: 'Keyword research workflow', duration: '22 min', type: 'Video' },
      { id: 3, title: 'On-page optimization', duration: '20 min', type: 'Video' },
      { id: 4, title: 'Reading Search Console data', duration: '18 min', type: 'Video' },
      { id: 5, title: 'Checkpoint quiz', duration: '9 min', type: 'Quiz' }
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
    mentor: { name: 'Emma Brown', initials: 'EB', role: 'English Tutor', rating: 4.8, reviews: 220 },
    prerequisites: ['Comfortable with basic English conversation', 'A quiet space for speaking practice'],
    tags: ['English', 'Grammar', 'IELTS'],
    lessons: [
      { id: 1, title: 'IELTS speaking format overview', duration: '10 min', type: 'Video' },
      { id: 2, title: 'Common grammar pitfalls', duration: '18 min', type: 'Video' },
      { id: 3, title: 'Building fluent answers', duration: '22 min', type: 'Video' },
      { id: 4, title: 'Practice test 1', duration: '30 min', type: 'Video' },
      { id: 5, title: 'Checkpoint quiz', duration: '10 min', type: 'Quiz' }
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
    mentor: { name: 'James Carter', initials: 'JC', role: 'Music Producer', rating: 4.7, reviews: 165 },
    prerequisites: ['Any DAW installed (FL Studio, Ableton, or GarageBand)', 'Headphones or studio monitors'],
    tags: ['Production', 'Mixing', 'Beat-making'],
    lessons: [
      { id: 1, title: 'DAW basics and workflow', duration: '16 min', type: 'Video' },
      { id: 2, title: 'Programming your first beat', duration: '24 min', type: 'Video' },
      { id: 3, title: 'Layering melody and bass', duration: '20 min', type: 'Video' },
      { id: 4, title: 'Intro to mixing', duration: '22 min', type: 'Video' },
      { id: 5, title: 'Checkpoint quiz', duration: '8 min', type: 'Quiz' }
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
    mentor: { name: 'Maria Lopez', initials: 'ML', role: 'Portrait Photographer', rating: 4.8, reviews: 140 },
    prerequisites: ['Any camera (DSLR, mirrorless, or phone)', 'A willing subject to practice with'],
    tags: ['Portrait', 'Lighting', 'Composition'],
    lessons: [
      { id: 1, title: 'Understanding natural light', duration: '14 min', type: 'Video' },
      { id: 2, title: 'Composition and framing', duration: '16 min', type: 'Video' },
      { id: 3, title: 'Directing your subject', duration: '20 min', type: 'Video' },
      { id: 4, title: 'Checkpoint quiz', duration: '7 min', type: 'Quiz' }
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
    mentor: { name: 'Priya Sharma', initials: 'PS', role: 'Home Baker & Instructor', rating: 4.9, reviews: 305 },
    prerequisites: ['A basic home oven', 'Standard baking tools (bowls, whisk, pans)'],
    tags: ['Baking', 'Recipes', 'Technique'],
    lessons: [
      { id: 1, title: 'Baking science 101', duration: '12 min', type: 'Video' },
      { id: 2, title: 'Your first loaf of bread', duration: '26 min', type: 'Video' },
      { id: 3, title: 'Cookies and cakes', duration: '22 min', type: 'Video' },
      { id: 4, title: 'Checkpoint quiz', duration: '8 min', type: 'Quiz' }
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
    mentor: { name: 'Daniel Smith', initials: 'DS', role: 'Certified Trainer', rating: 4.7, reviews: 190 },
    prerequisites: ['Access to a gym or basic home equipment', 'Doctor clearance if returning from injury'],
    tags: ['Strength', 'Form', 'Programming'],
    lessons: [
      { id: 1, title: 'Squat, hinge, push, pull, carry', duration: '16 min', type: 'Video' },
      { id: 2, title: 'Squat and deadlift form', duration: '24 min', type: 'Video' },
      { id: 3, title: 'Building your first split', duration: '18 min', type: 'Video' },
      { id: 4, title: 'Checkpoint quiz', duration: '8 min', type: 'Quiz' }
    ]
  }
];
