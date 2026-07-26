// Extended mentor profiles. Base identity (id, name, initials, role, rating,
// reviews) is duplicated lightly in each skill's `mentor` field in
// skills.js — this file is the richer, standalone profile used by the
// Mentor Public Profile, Booking, and Messages pages.

export const mentors = [
  {
    id: 'alex-johnson', name: 'Alex Johnson', initials: 'AJ', role: 'Full Stack Developer',
    rating: 4.9, reviews: 320, students: 3120,
    location: 'Austin, TX', timezone: 'GMT-5', responseTime: 'Usually replies within 2 hours',
    rate: 35,
    bio: "I've spent the last 8 years building products at startups and now split my time between freelance contracts and teaching. I like breaking big, intimidating topics like React and Node into small, testable pieces — most of my students say the projects, not the theory, are what made it click.",
    tags: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'System Design'],
    availability: [
      { day: 'Mon', slots: ['10:00 AM', '2:00 PM', '6:00 PM'] },
      { day: 'Wed', slots: ['10:00 AM', '4:00 PM'] },
      { day: 'Fri', slots: ['1:00 PM', '5:00 PM', '7:00 PM'] }
    ],
    testimonials: [
      { author: 'Priya S.', rating: 5, text: 'Alex explained hooks better in one session than three YouTube tutorials combined.' },
      { author: 'Marcus T.', rating: 5, text: 'Patient, practical, and genuinely invested in whether I understood — not just finishing the curriculum.' }
    ]
  },
  {
    id: 'sarah-williams', name: 'Sarah Williams', initials: 'SW', role: 'UI/UX Designer',
    rating: 4.8, reviews: 280, students: 2210,
    location: 'Toronto, ON', timezone: 'GMT-4', responseTime: 'Usually replies within 4 hours',
    rate: 30,
    bio: "Product designer for fintech and health apps for the past 6 years. I teach Figma the way I actually use it at work — real component libraries, real handoff, real constraints — rather than toy exercises that don't hold up on an actual project.",
    tags: ['Figma', 'UI Design', 'Design Systems', 'Prototyping'],
    availability: [
      { day: 'Tue', slots: ['9:00 AM', '1:00 PM'] },
      { day: 'Thu', slots: ['11:00 AM', '3:00 PM', '6:00 PM'] },
      { day: 'Sat', slots: ['10:00 AM', '12:00 PM'] }
    ],
    testimonials: [
      { author: 'Daniela R.', rating: 5, text: "Sarah's component library session alone was worth it — I use that structure on every project now." },
      { author: 'Yuki H.', rating: 4, text: 'Really solid on the fundamentals, gave honest feedback on my portfolio too.' }
    ]
  },
  {
    id: 'david-smith', name: 'David Smith', initials: 'DS', role: 'Digital Marketer',
    rating: 4.9, reviews: 410, students: 4100,
    location: 'London, UK', timezone: 'GMT+0', responseTime: 'Usually replies within 3 hours',
    rate: 28,
    bio: "I run growth for a Series B SaaS company and consult on the side. My sessions are built around your actual site or product — we pull up your Search Console data live instead of talking in the abstract.",
    tags: ['SEO', 'Google Ads', 'Analytics', 'Growth Strategy'],
    availability: [
      { day: 'Mon', slots: ['8:00 AM', '12:00 PM'] },
      { day: 'Wed', slots: ['9:00 AM', '1:00 PM', '5:00 PM'] }
    ],
    testimonials: [
      { author: 'Owen K.', rating: 5, text: 'Doubled my organic traffic in 2 months following David\'s keyword strategy.' }
    ]
  },
  {
    id: 'emma-brown', name: 'Emma Brown', initials: 'EB', role: 'English Tutor',
    rating: 4.8, reviews: 220, students: 1980,
    location: 'Manchester, UK', timezone: 'GMT+0', responseTime: 'Usually replies within 6 hours',
    rate: 22,
    bio: 'CELTA-certified tutor specializing in exam prep. I focus heavily on speaking confidence — most students lose points on hesitation and filler words, not grammar.',
    tags: ['English', 'IELTS', 'Grammar', 'Business English'],
    availability: [
      { day: 'Tue', slots: ['10:00 AM', '2:00 PM'] },
      { day: 'Fri', slots: ['9:00 AM', '11:00 AM', '3:00 PM'] }
    ],
    testimonials: [
      { author: 'Haruto M.', rating: 5, text: 'Went from IELTS 6.0 to 7.5 speaking in six weeks with Emma.' }
    ]
  },
  {
    id: 'james-carter', name: 'James Carter', initials: 'JC', role: 'Music Producer',
    rating: 4.7, reviews: 165, students: 1540,
    location: 'Atlanta, GA', timezone: 'GMT-5', responseTime: 'Usually replies within 1 day',
    rate: 25,
    bio: "Independent producer, 40+ released tracks. I teach inside whatever DAW you already use — no need to switch software to learn the fundamentals of a good mix.",
    tags: ['Production', 'Mixing', 'Ableton', 'FL Studio'],
    availability: [
      { day: 'Thu', slots: ['4:00 PM', '7:00 PM'] },
      { day: 'Sun', slots: ['1:00 PM', '3:00 PM'] }
    ],
    testimonials: [
      { author: 'Leo B.', rating: 4, text: 'Finally understand sidechain compression thanks to James.' }
    ]
  },
  {
    id: 'maria-lopez', name: 'Maria Lopez', initials: 'ML', role: 'Portrait Photographer',
    rating: 4.8, reviews: 140, students: 1120,
    location: 'Barcelona, Spain', timezone: 'GMT+1', responseTime: 'Usually replies within 5 hours',
    rate: 27,
    bio: "Portrait and editorial photographer for 10 years. My sessions are shot-along — bring your own camera and we practice on a live subject in real light, not just slides.",
    tags: ['Portrait', 'Lighting', 'Composition', 'Editing'],
    availability: [
      { day: 'Wed', slots: ['11:00 AM', '3:00 PM'] },
      { day: 'Sat', slots: ['9:00 AM', '1:00 PM'] }
    ],
    testimonials: [
      { author: 'Ines V.', rating: 5, text: 'Maria\'s posing direction tips instantly made my portraits look more natural.' }
    ]
  },
  {
    id: 'priya-sharma', name: 'Priya Sharma', initials: 'PS', role: 'Home Baker & Instructor',
    rating: 4.9, reviews: 305, students: 2670,
    location: 'Mumbai, India', timezone: 'GMT+5:30', responseTime: 'Usually replies within 3 hours',
    rate: 18,
    bio: "Self-taught baker turned instructor — I know exactly which mistakes beginners make because I made all of them first. Sessions are hands-on in your own kitchen over video.",
    tags: ['Baking', 'Bread', 'Pastry', 'Recipe Development'],
    availability: [
      { day: 'Mon', slots: ['6:00 PM', '8:00 PM'] },
      { day: 'Sat', slots: ['10:00 AM', '12:00 PM', '4:00 PM'] }
    ],
    testimonials: [
      { author: 'Ananya G.', rating: 5, text: 'My first successful sourdough loaf ever, thanks to Priya\'s troubleshooting.' }
    ]
  },
  {
    id: 'daniel-smith', name: 'Daniel Smith', initials: 'DS', role: 'Certified Trainer',
    rating: 4.7, reviews: 190, students: 1890,
    location: 'Denver, CO', timezone: 'GMT-6', responseTime: 'Usually replies within 4 hours',
    rate: 24,
    bio: "NASM-certified trainer focused on strength fundamentals for people returning to the gym after time off. Form checks over video are the core of every session.",
    tags: ['Strength Training', 'Form Coaching', 'Programming'],
    availability: [
      { day: 'Tue', slots: ['7:00 AM', '5:00 PM'] },
      { day: 'Thu', slots: ['7:00 AM', '6:00 PM'] }
    ],
    testimonials: [
      { author: 'Colin F.', rating: 5, text: 'Fixed my squat depth issue in one session — knees stopped hurting immediately.' }
    ]
  }
];

export function getMentorById(id){
  return mentors.find(m=>m.id===id);
}
