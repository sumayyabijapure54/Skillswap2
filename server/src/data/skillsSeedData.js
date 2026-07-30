// Mirrors client/src/data/skills.js (flagshipSkills + generatedSkills)
// so the API returns the same full catalog the frontend renders from.
// Regenerate by re-running the transform if the client catalog changes.

export const categories = [
  {
    "key": "programming",
    "label": "Programming",
    "icon": "</>"
  },
  {
    "key": "ai-ml",
    "label": "AI & Machine Learning",
    "icon": "🤖"
  },
  {
    "key": "web-development",
    "label": "Web Development",
    "icon": "🖥️"
  },
  {
    "key": "mobile-development",
    "label": "Mobile Development",
    "icon": "📱"
  },
  {
    "key": "design",
    "label": "UI/UX Design",
    "icon": "🎨"
  },
  {
    "key": "graphic-design",
    "label": "Graphic Design",
    "icon": "🖌️"
  },
  {
    "key": "video-editing",
    "label": "Video Editing",
    "icon": "🎬"
  },
  {
    "key": "marketing",
    "label": "Marketing",
    "icon": "📣"
  },
  {
    "key": "business",
    "label": "Business",
    "icon": "💼"
  },
  {
    "key": "finance",
    "label": "Finance",
    "icon": "💰"
  },
  {
    "key": "languages",
    "label": "Language Learning",
    "icon": "🌐"
  },
  {
    "key": "music",
    "label": "Music",
    "icon": "🎵"
  },
  {
    "key": "photography",
    "label": "Photography",
    "icon": "📷"
  },
  {
    "key": "cooking",
    "label": "Cooking",
    "icon": "🍳"
  },
  {
    "key": "fitness",
    "label": "Fitness",
    "icon": "🏋"
  }
];

export const levels = [
  "Beginner",
  "Intermediate",
  "Advanced"
];

export const skills = [
  {
    "id": "react-fundamentals",
    "title": "React Fundamentals",
    "category": "programming",
    "level": "Beginner",
    "rating": 4.9,
    "students": 3120,
    "duration": "6h 40m",
    "description": "Build modern, component-driven interfaces with React. Learn hooks, state, props, and how to structure real projects from scratch.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "Basic HTML & CSS",
      "Fundamentals of JavaScript (ES6+)",
      "A code editor installed (VS Code recommended)"
    ],
    "tags": [
      "React",
      "JavaScript",
      "Frontend"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Why React? Component thinking",
        "duration": "12 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "JSX and rendering elements",
        "duration": "18 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Props and component composition",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "State with useState",
        "duration": "20 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Side effects with useEffect",
        "duration": "24 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "10 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What does JSX compile down to?",
            "options": [
              "HTML strings",
              "React.createElement() calls",
              "Web Components",
              "CSS-in-JS"
            ],
            "correct": 1
          },
          {
            "q": "Which hook lets a component \"remember\" a value between renders?",
            "options": [
              "useEffect",
              "useContext",
              "useState",
              "useMemo only"
            ],
            "correct": 2
          },
          {
            "q": "When does a useEffect with an empty dependency array [] run?",
            "options": [
              "On every render",
              "Only once, after the first render",
              "Never",
              "Only on unmount"
            ],
            "correct": 1
          }
        ]
      },
      {
        "id": 7,
        "title": "Building a small project",
        "duration": "34 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      }
    ]
  },
  {
    "id": "figma-ui-design",
    "title": "UI Design in Figma",
    "category": "design",
    "level": "Beginner",
    "rating": 4.8,
    "students": 2210,
    "duration": "5h 10m",
    "description": "Go from blank canvas to polished, responsive UI screens in Figma — covering auto layout, components, and design systems.",
    "mentor": {
      "id": "sarah-williams",
      "name": "Sarah Williams",
      "initials": "SW",
      "role": "UI/UX Designer",
      "rating": 4.8,
      "reviews": 280
    },
    "prerequisites": [
      "A free Figma account",
      "No prior design experience required"
    ],
    "tags": [
      "Figma",
      "UI Design",
      "Prototyping"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Figma workspace tour",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Frames, layers, and grids",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Auto layout essentials",
        "duration": "20 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Building a component library",
        "duration": "26 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What is Auto Layout used for in Figma?",
            "options": [
              "Adding animations",
              "Making frames resize responsively around their content",
              "Exporting to code",
              "Version history"
            ],
            "correct": 1
          },
          {
            "q": "What is the main benefit of building a component library?",
            "options": [
              "It makes files smaller",
              "Consistent, reusable UI pieces across a design",
              "It disables prototyping",
              "It auto-generates copy"
            ],
            "correct": 1
          },
          {
            "q": "What does \"handoff\" typically refer to?",
            "options": [
              "Renaming a file",
              "Passing finished designs to developers with specs/assets",
              "Deleting old versions",
              "Merging two frames"
            ],
            "correct": 1
          }
        ]
      },
      {
        "id": 6,
        "title": "Prototyping and handoff",
        "duration": "18 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      }
    ]
  },
  {
    "id": "seo-fundamentals",
    "title": "SEO & Growth Marketing",
    "category": "business",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 4100,
    "duration": "4h 30m",
    "description": "Learn practical, up-to-date SEO tactics and how to read analytics dashboards to drive real organic growth.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "A live website or blog (optional but helpful)",
      "A Google account for Analytics/Search Console"
    ],
    "tags": [
      "SEO",
      "Google Ads",
      "Analytics"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "How search engines rank pages",
        "duration": "14 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Keyword research workflow",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "On-page optimization",
        "duration": "20 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Reading Search Console data",
        "duration": "18 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Checkpoint quiz",
        "duration": "9 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What does \"organic\" traffic mean?",
            "options": [
              "Paid ad clicks",
              "Unpaid visits from search engine results",
              "Social media traffic only",
              "Email newsletter clicks"
            ],
            "correct": 1
          },
          {
            "q": "Which tool would you check to see what search queries bring people to your site?",
            "options": [
              "Google Search Console",
              "Photoshop",
              "Figma",
              "Slack"
            ],
            "correct": 0
          },
          {
            "q": "What is \"on-page optimization\" mainly about?",
            "options": [
              "Buying backlinks",
              "Improving elements on your own page (titles, content, structure)",
              "Running Facebook ads",
              "Server uptime"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "conversational-english",
    "title": "Conversational English (IELTS Prep)",
    "category": "languages",
    "level": "Intermediate",
    "rating": 4.8,
    "students": 1980,
    "duration": "7h 20m",
    "description": "Sharpen fluency, grammar, and exam technique for IELTS speaking and writing sections with structured practice drills.",
    "mentor": {
      "id": "emma-brown",
      "name": "Emma Brown",
      "initials": "EB",
      "role": "English Tutor",
      "rating": 4.8,
      "reviews": 220
    },
    "prerequisites": [
      "Comfortable with basic English conversation",
      "A quiet space for speaking practice"
    ],
    "tags": [
      "English",
      "Grammar",
      "IELTS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "IELTS speaking format overview",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Common grammar pitfalls",
        "duration": "18 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Building fluent answers",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Practice test 1",
        "duration": "30 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Checkpoint quiz",
        "duration": "10 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What most commonly costs IELTS speaking candidates points?",
            "options": [
              "Perfect grammar",
              "Hesitation and filler words",
              "Speaking too slowly on purpose",
              "Using a British accent"
            ],
            "correct": 1
          },
          {
            "q": "What is a good strategy when you don't know a word mid-sentence?",
            "options": [
              "Stop talking entirely",
              "Paraphrase around it and keep going",
              "Switch to your native language",
              "Ask to restart the test"
            ],
            "correct": 1
          },
          {
            "q": "How many parts does the IELTS Speaking test typically have?",
            "options": [
              "1",
              "2",
              "3",
              "5"
            ],
            "correct": 2
          }
        ]
      }
    ]
  },
  {
    "id": "music-production-basics",
    "title": "Music Production Basics",
    "category": "music",
    "level": "Beginner",
    "rating": 4.7,
    "students": 1540,
    "duration": "5h 50m",
    "description": "Get hands-on with a DAW, learn beat-making fundamentals, mixing basics, and how to finish your first track.",
    "mentor": {
      "id": "james-carter",
      "name": "James Carter",
      "initials": "JC",
      "role": "Music Producer",
      "rating": 4.7,
      "reviews": 165
    },
    "prerequisites": [
      "Any DAW installed (FL Studio, Ableton, or GarageBand)",
      "Headphones or studio monitors"
    ],
    "tags": [
      "Production",
      "Mixing",
      "Beat-making"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "DAW basics and workflow",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Programming your first beat",
        "duration": "24 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Layering melody and bass",
        "duration": "20 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Intro to mixing",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What does DAW stand for?",
            "options": [
              "Digital Audio Workstation",
              "Direct Audio Wire",
              "Dynamic Amplitude Wave",
              "Dual Audio Width"
            ],
            "correct": 0
          },
          {
            "q": "What is sidechain compression commonly used for?",
            "options": [
              "Making a track louder overall",
              "Ducking one sound (e.g. bass) when another (e.g. kick) hits",
              "Adding reverb",
              "Recording vocals"
            ],
            "correct": 1
          },
          {
            "q": "Why does the lesson recommend teaching inside whatever DAW you already use?",
            "options": [
              "All DAWs are identical",
              "Fundamentals of mixing transfer regardless of software",
              "You must switch software to learn properly",
              "Free DAWs don't support mixing"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "portrait-photography",
    "title": "Portrait Photography",
    "category": "photography",
    "level": "Beginner",
    "rating": 4.8,
    "students": 1120,
    "duration": "4h 05m",
    "description": "Master natural light, composition, and posing direction to shoot confident, professional-feeling portraits.",
    "mentor": {
      "id": "maria-lopez",
      "name": "Maria Lopez",
      "initials": "ML",
      "role": "Portrait Photographer",
      "rating": 4.8,
      "reviews": 140
    },
    "prerequisites": [
      "Any camera (DSLR, mirrorless, or phone)",
      "A willing subject to practice with"
    ],
    "tags": [
      "Portrait",
      "Lighting",
      "Composition"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Understanding natural light",
        "duration": "14 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Composition and framing",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Directing your subject",
        "duration": "20 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Checkpoint quiz",
        "duration": "7 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What is generally the most flattering light for portraits?",
            "options": [
              "Harsh midday sun",
              "Soft, diffused natural light",
              "Direct on-camera flash",
              "No light at all"
            ],
            "correct": 1
          },
          {
            "q": "What does \"directing your subject\" mainly involve?",
            "options": [
              "Ignoring the subject entirely",
              "Giving clear, simple posing and expression guidance",
              "Only shooting candids",
              "Editing after the fact"
            ],
            "correct": 1
          },
          {
            "q": "Which is a composition technique mentioned for framing?",
            "options": [
              "Rule of thirds",
              "Rule of fifths",
              "Golden gate ratio",
              "None of these"
            ],
            "correct": 0
          }
        ]
      }
    ]
  },
  {
    "id": "home-baking",
    "title": "Home Baking Essentials",
    "category": "cooking",
    "level": "Beginner",
    "rating": 4.9,
    "students": 2670,
    "duration": "3h 45m",
    "description": "Build real baking intuition — measuring, mixing methods, and oven behavior — through five foundational recipes.",
    "mentor": {
      "id": "priya-sharma",
      "name": "Priya Sharma",
      "initials": "PS",
      "role": "Home Baker & Instructor",
      "rating": 4.9,
      "reviews": 305
    },
    "prerequisites": [
      "A basic home oven",
      "Standard baking tools (bowls, whisk, pans)"
    ],
    "tags": [
      "Baking",
      "Recipes",
      "Technique"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Baking science 101",
        "duration": "12 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Your first loaf of bread",
        "duration": "26 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Cookies and cakes",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "Why does baking rely more on precise measuring than general cooking?",
            "options": [
              "It doesn't, they're the same",
              "Baking is a more exact chemical process",
              "Ovens are always accurate",
              "Flour never affects texture"
            ],
            "correct": 1
          },
          {
            "q": "What is a common cause of a dense loaf of bread?",
            "options": [
              "Too much kneading only",
              "Under-proofing (not enough rise time)",
              "Using a bowl instead of a pan",
              "Too little salt"
            ],
            "correct": 1
          },
          {
            "q": "What does the lesson say is the goal of \"baking science 101\"?",
            "options": [
              "Memorizing recipes exactly",
              "Building real intuition for why techniques work",
              "Skipping measurements entirely",
              "Only using pre-made mixes"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "strength-training-101",
    "title": "Strength Training 101",
    "category": "fitness",
    "level": "Beginner",
    "rating": 4.7,
    "students": 1890,
    "duration": "4h 15m",
    "description": "Learn correct form for the core compound lifts and how to build a simple, sustainable weekly training split.",
    "mentor": {
      "id": "daniel-smith",
      "name": "Daniel Smith",
      "initials": "DS",
      "role": "Certified Trainer",
      "rating": 4.7,
      "reviews": 190
    },
    "prerequisites": [
      "Access to a gym or basic home equipment",
      "Doctor clearance if returning from injury"
    ],
    "tags": [
      "Strength",
      "Form",
      "Programming"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Squat, hinge, push, pull, carry",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Squat and deadlift form",
        "duration": "24 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Building your first split",
        "duration": "18 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "Which of these is one of the 5 fundamental movement patterns mentioned?",
            "options": [
              "Hinge",
              "Spin",
              "Float",
              "Bounce"
            ],
            "correct": 0
          },
          {
            "q": "Why are form checks over video emphasized?",
            "options": [
              "They aren't important",
              "Bad form on compound lifts like squats/deadlifts risks injury",
              "Only advanced lifters need form checks",
              "Cameras improve strength directly"
            ],
            "correct": 1
          },
          {
            "q": "What is a \"split\" in the context of a training program?",
            "options": [
              "A stretching exercise",
              "How you divide muscle groups/workouts across the week",
              "A type of protein shake",
              "A competition category"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "python-for-beginners",
    "title": "Python for Beginners",
    "category": "programming",
    "level": "Beginner",
    "rating": 4.9,
    "students": 1692,
    "duration": "6h 08m",
    "description": "A practical, project-driven introduction to python for beginners — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Python for Beginners\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "javascript-deep-dive",
    "title": "JavaScript Deep Dive",
    "category": "programming",
    "level": "Intermediate",
    "rating": 5,
    "students": 3765,
    "duration": "2h 42m",
    "description": "A practical, project-driven introduction to javascript deep dive — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"JavaScript Deep Dive\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "data-structures-algorithms",
    "title": "Data Structures & Algorithms",
    "category": "programming",
    "level": "Advanced",
    "rating": 4.6,
    "students": 1152,
    "duration": "4h 20m",
    "description": "A practical, project-driven introduction to data structures & algorithms — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Data Structures & Algorithms\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "git-github-essentials",
    "title": "Git & GitHub Essentials",
    "category": "programming",
    "level": "Beginner",
    "rating": 5,
    "students": 3284,
    "duration": "6h 03m",
    "description": "A practical, project-driven introduction to git & github essentials — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Git & GitHub Essentials\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "backend-apis-with-node-js",
    "title": "Backend APIs with Node.js",
    "category": "programming",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 3458,
    "duration": "5h 26m",
    "description": "A practical, project-driven introduction to backend apis with node.js — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Backend APIs with Node.js\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "sql-for-developers",
    "title": "SQL for Developers",
    "category": "programming",
    "level": "Advanced",
    "rating": 4.9,
    "students": 713,
    "duration": "3h 30m",
    "description": "A practical, project-driven introduction to sql for developers — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"SQL for Developers\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "clean-code-principles",
    "title": "Clean Code Principles",
    "category": "programming",
    "level": "Beginner",
    "rating": 4.9,
    "students": 3059,
    "duration": "4h 44m",
    "description": "A practical, project-driven introduction to clean code principles — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Clean Code Principles\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "object-oriented-programming-in-java",
    "title": "Object-Oriented Programming in Java",
    "category": "programming",
    "level": "Intermediate",
    "rating": 4.8,
    "students": 574,
    "duration": "5h 00m",
    "description": "A practical, project-driven introduction to object-oriented programming in java — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Object-Oriented Programming in Java\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "introduction-to-rust",
    "title": "Introduction to Rust",
    "category": "programming",
    "level": "Advanced",
    "rating": 4.6,
    "students": 2228,
    "duration": "4h 09m",
    "description": "A practical, project-driven introduction to introduction to rust — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Introduction to Rust\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "typescript-from-scratch",
    "title": "TypeScript from Scratch",
    "category": "programming",
    "level": "Beginner",
    "rating": 4.9,
    "students": 1366,
    "duration": "5h 38m",
    "description": "A practical, project-driven introduction to typescript from scratch — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"TypeScript from Scratch\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "docker-containers-101",
    "title": "Docker & Containers 101",
    "category": "programming",
    "level": "Intermediate",
    "rating": 4.5,
    "students": 3349,
    "duration": "3h 17m",
    "description": "A practical, project-driven introduction to docker & containers 101 — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Docker & Containers 101\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "testing-with-jest",
    "title": "Testing with Jest",
    "category": "programming",
    "level": "Advanced",
    "rating": 4.6,
    "students": 1429,
    "duration": "4h 32m",
    "description": "A practical, project-driven introduction to testing with jest — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Programming",
      "Software Engineering",
      "Coding"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Testing with Jest\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Programming",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "machine-learning-foundations",
    "title": "Machine Learning Foundations",
    "category": "ai-ml",
    "level": "Beginner",
    "rating": 4.8,
    "students": 2296,
    "duration": "4h 11m",
    "description": "A practical, project-driven introduction to machine learning foundations — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "ravi-patel",
      "name": "Ravi Patel",
      "initials": "RP",
      "role": "AI/ML Engineer",
      "rating": 4.9,
      "reviews": 236
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "AI",
      "Machine Learning",
      "Python"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Machine Learning Foundations\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in AI",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "deep-learning-with-pytorch",
    "title": "Deep Learning with PyTorch",
    "category": "ai-ml",
    "level": "Intermediate",
    "rating": 4.5,
    "students": 3281,
    "duration": "4h 32m",
    "description": "A practical, project-driven introduction to deep learning with pytorch — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "ravi-patel",
      "name": "Ravi Patel",
      "initials": "RP",
      "role": "AI/ML Engineer",
      "rating": 4.9,
      "reviews": 236
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "AI",
      "Machine Learning",
      "Python"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Deep Learning with PyTorch\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in AI",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "prompt-engineering-for-llms",
    "title": "Prompt Engineering for LLMs",
    "category": "ai-ml",
    "level": "Advanced",
    "rating": 4.9,
    "students": 1421,
    "duration": "6h 26m",
    "description": "A practical, project-driven introduction to prompt engineering for llms — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "ravi-patel",
      "name": "Ravi Patel",
      "initials": "RP",
      "role": "AI/ML Engineer",
      "rating": 4.9,
      "reviews": 236
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "AI",
      "Machine Learning",
      "Python"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Prompt Engineering for LLMs\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in AI",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "intro-to-neural-networks",
    "title": "Intro to Neural Networks",
    "category": "ai-ml",
    "level": "Beginner",
    "rating": 5,
    "students": 528,
    "duration": "5h 14m",
    "description": "A practical, project-driven introduction to intro to neural networks — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "ravi-patel",
      "name": "Ravi Patel",
      "initials": "RP",
      "role": "AI/ML Engineer",
      "rating": 4.9,
      "reviews": 236
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "AI",
      "Machine Learning",
      "Python"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Intro to Neural Networks\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in AI",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "building-ai-chatbots",
    "title": "Building AI Chatbots",
    "category": "ai-ml",
    "level": "Intermediate",
    "rating": 4.5,
    "students": 1255,
    "duration": "2h 43m",
    "description": "A practical, project-driven introduction to building ai chatbots — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "ravi-patel",
      "name": "Ravi Patel",
      "initials": "RP",
      "role": "AI/ML Engineer",
      "rating": 4.9,
      "reviews": 236
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "AI",
      "Machine Learning",
      "Python"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Building AI Chatbots\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in AI",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "computer-vision-basics",
    "title": "Computer Vision Basics",
    "category": "ai-ml",
    "level": "Advanced",
    "rating": 4.6,
    "students": 2785,
    "duration": "3h 15m",
    "description": "A practical, project-driven introduction to computer vision basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "ravi-patel",
      "name": "Ravi Patel",
      "initials": "RP",
      "role": "AI/ML Engineer",
      "rating": 4.9,
      "reviews": 236
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "AI",
      "Machine Learning",
      "Python"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Computer Vision Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in AI",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "natural-language-processing-101",
    "title": "Natural Language Processing 101",
    "category": "ai-ml",
    "level": "Beginner",
    "rating": 4.9,
    "students": 978,
    "duration": "3h 56m",
    "description": "A practical, project-driven introduction to natural language processing 101 — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "ravi-patel",
      "name": "Ravi Patel",
      "initials": "RP",
      "role": "AI/ML Engineer",
      "rating": 4.9,
      "reviews": 236
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "AI",
      "Machine Learning",
      "Python"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Natural Language Processing 101\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in AI",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "data-science-with-python",
    "title": "Data Science with Python",
    "category": "ai-ml",
    "level": "Intermediate",
    "rating": 4.7,
    "students": 2929,
    "duration": "2h 48m",
    "description": "A practical, project-driven introduction to data science with python — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "ravi-patel",
      "name": "Ravi Patel",
      "initials": "RP",
      "role": "AI/ML Engineer",
      "rating": 4.9,
      "reviews": 236
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "AI",
      "Machine Learning",
      "Python"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Data Science with Python\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in AI",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "mlops-fundamentals",
    "title": "MLOps Fundamentals",
    "category": "ai-ml",
    "level": "Advanced",
    "rating": 4.8,
    "students": 1144,
    "duration": "4h 43m",
    "description": "A practical, project-driven introduction to mlops fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "ravi-patel",
      "name": "Ravi Patel",
      "initials": "RP",
      "role": "AI/ML Engineer",
      "rating": 4.9,
      "reviews": 236
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "AI",
      "Machine Learning",
      "Python"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"MLOps Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in AI",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "generative-ai-in-practice",
    "title": "Generative AI in Practice",
    "category": "ai-ml",
    "level": "Beginner",
    "rating": 4.7,
    "students": 974,
    "duration": "2h 23m",
    "description": "A practical, project-driven introduction to generative ai in practice — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "ravi-patel",
      "name": "Ravi Patel",
      "initials": "RP",
      "role": "AI/ML Engineer",
      "rating": 4.9,
      "reviews": 236
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "AI",
      "Machine Learning",
      "Python"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Generative AI in Practice\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in AI",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "full-stack-web-development",
    "title": "Full-Stack Web Development",
    "category": "web-development",
    "level": "Beginner",
    "rating": 4.9,
    "students": 662,
    "duration": "4h 44m",
    "description": "A practical, project-driven introduction to full-stack web development — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Web Development",
      "HTML",
      "CSS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Full-Stack Web Development\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Web Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "modern-css-flexbox",
    "title": "Modern CSS & Flexbox",
    "category": "web-development",
    "level": "Intermediate",
    "rating": 4.6,
    "students": 1638,
    "duration": "6h 50m",
    "description": "A practical, project-driven introduction to modern css & flexbox — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Web Development",
      "HTML",
      "CSS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Modern CSS & Flexbox\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Web Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "building-rest-apis",
    "title": "Building REST APIs",
    "category": "web-development",
    "level": "Advanced",
    "rating": 4.7,
    "students": 3212,
    "duration": "2h 00m",
    "description": "A practical, project-driven introduction to building rest apis — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Web Development",
      "HTML",
      "CSS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Building REST APIs\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Web Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "next-js-in-practice",
    "title": "Next.js in Practice",
    "category": "web-development",
    "level": "Beginner",
    "rating": 4.8,
    "students": 1690,
    "duration": "5h 34m",
    "description": "A practical, project-driven introduction to next.js in practice — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Web Development",
      "HTML",
      "CSS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Next.js in Practice\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Web Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "web-performance-optimization",
    "title": "Web Performance Optimization",
    "category": "web-development",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 3181,
    "duration": "2h 18m",
    "description": "A practical, project-driven introduction to web performance optimization — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Web Development",
      "HTML",
      "CSS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Web Performance Optimization\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Web Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "responsive-web-design",
    "title": "Responsive Web Design",
    "category": "web-development",
    "level": "Advanced",
    "rating": 4.5,
    "students": 3498,
    "duration": "5h 19m",
    "description": "A practical, project-driven introduction to responsive web design — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Web Development",
      "HTML",
      "CSS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Responsive Web Design\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Web Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "vue-js-fundamentals",
    "title": "Vue.js Fundamentals",
    "category": "web-development",
    "level": "Beginner",
    "rating": 4.8,
    "students": 1321,
    "duration": "5h 16m",
    "description": "A practical, project-driven introduction to vue.js fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Web Development",
      "HTML",
      "CSS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Vue.js Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Web Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "graphql-essentials",
    "title": "GraphQL Essentials",
    "category": "web-development",
    "level": "Intermediate",
    "rating": 4.8,
    "students": 3540,
    "duration": "2h 54m",
    "description": "A practical, project-driven introduction to graphql essentials — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Web Development",
      "HTML",
      "CSS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"GraphQL Essentials\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Web Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "web-accessibility-a11y-basics",
    "title": "Web Accessibility (a11y) Basics",
    "category": "web-development",
    "level": "Advanced",
    "rating": 4.8,
    "students": 1603,
    "duration": "5h 10m",
    "description": "A practical, project-driven introduction to web accessibility (a11y) basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Web Development",
      "HTML",
      "CSS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Web Accessibility (a11y) Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Web Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "progressive-web-apps",
    "title": "Progressive Web Apps",
    "category": "web-development",
    "level": "Beginner",
    "rating": 4.6,
    "students": 1528,
    "duration": "3h 16m",
    "description": "A practical, project-driven introduction to progressive web apps — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "alex-johnson",
      "name": "Alex Johnson",
      "initials": "AJ",
      "role": "Full Stack Developer",
      "rating": 4.9,
      "reviews": 320
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Web Development",
      "HTML",
      "CSS"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Progressive Web Apps\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Web Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "react-native-from-scratch",
    "title": "React Native from Scratch",
    "category": "mobile-development",
    "level": "Beginner",
    "rating": 4.6,
    "students": 3773,
    "duration": "2h 45m",
    "description": "A practical, project-driven introduction to react native from scratch — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "liam-chen",
      "name": "Liam Chen",
      "initials": "LC",
      "role": "Mobile App Developer",
      "rating": 4.8,
      "reviews": 198
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Mobile Development",
      "App Development"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"React Native from Scratch\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Mobile Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "flutter-app-development",
    "title": "Flutter App Development",
    "category": "mobile-development",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 1064,
    "duration": "4h 01m",
    "description": "A practical, project-driven introduction to flutter app development — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "liam-chen",
      "name": "Liam Chen",
      "initials": "LC",
      "role": "Mobile App Developer",
      "rating": 4.8,
      "reviews": 198
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Mobile Development",
      "App Development"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Flutter App Development\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Mobile Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "ios-development-with-swift",
    "title": "iOS Development with Swift",
    "category": "mobile-development",
    "level": "Advanced",
    "rating": 4.6,
    "students": 3688,
    "duration": "6h 23m",
    "description": "A practical, project-driven introduction to ios development with swift — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "liam-chen",
      "name": "Liam Chen",
      "initials": "LC",
      "role": "Mobile App Developer",
      "rating": 4.8,
      "reviews": 198
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Mobile Development",
      "App Development"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"iOS Development with Swift\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Mobile Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "android-development-with-kotlin",
    "title": "Android Development with Kotlin",
    "category": "mobile-development",
    "level": "Beginner",
    "rating": 4.6,
    "students": 1436,
    "duration": "6h 22m",
    "description": "A practical, project-driven introduction to android development with kotlin — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "liam-chen",
      "name": "Liam Chen",
      "initials": "LC",
      "role": "Mobile App Developer",
      "rating": 4.8,
      "reviews": 198
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Mobile Development",
      "App Development"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Android Development with Kotlin\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Mobile Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "mobile-ui-ux-patterns",
    "title": "Mobile UI/UX Patterns",
    "category": "mobile-development",
    "level": "Intermediate",
    "rating": 4.8,
    "students": 595,
    "duration": "6h 44m",
    "description": "A practical, project-driven introduction to mobile ui/ux patterns — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "liam-chen",
      "name": "Liam Chen",
      "initials": "LC",
      "role": "Mobile App Developer",
      "rating": 4.8,
      "reviews": 198
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Mobile Development",
      "App Development"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Mobile UI/UX Patterns\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Mobile Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "publishing-to-the-app-store",
    "title": "Publishing to the App Store",
    "category": "mobile-development",
    "level": "Advanced",
    "rating": 4.8,
    "students": 2867,
    "duration": "4h 46m",
    "description": "A practical, project-driven introduction to publishing to the app store — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "liam-chen",
      "name": "Liam Chen",
      "initials": "LC",
      "role": "Mobile App Developer",
      "rating": 4.8,
      "reviews": 198
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Mobile Development",
      "App Development"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Publishing to the App Store\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Mobile Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "cross-platform-app-architecture",
    "title": "Cross-Platform App Architecture",
    "category": "mobile-development",
    "level": "Beginner",
    "rating": 5,
    "students": 3085,
    "duration": "6h 52m",
    "description": "A practical, project-driven introduction to cross-platform app architecture — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "liam-chen",
      "name": "Liam Chen",
      "initials": "LC",
      "role": "Mobile App Developer",
      "rating": 4.8,
      "reviews": 198
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Mobile Development",
      "App Development"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Cross-Platform App Architecture\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Mobile Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "state-management-in-mobile-apps",
    "title": "State Management in Mobile Apps",
    "category": "mobile-development",
    "level": "Intermediate",
    "rating": 4.6,
    "students": 1287,
    "duration": "2h 13m",
    "description": "A practical, project-driven introduction to state management in mobile apps — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "liam-chen",
      "name": "Liam Chen",
      "initials": "LC",
      "role": "Mobile App Developer",
      "rating": 4.8,
      "reviews": 198
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Mobile Development",
      "App Development"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"State Management in Mobile Apps\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Mobile Development",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "ux-research-fundamentals",
    "title": "UX Research Fundamentals",
    "category": "design",
    "level": "Beginner",
    "rating": 4.9,
    "students": 3324,
    "duration": "5h 20m",
    "description": "A practical, project-driven introduction to ux research fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sarah-williams",
      "name": "Sarah Williams",
      "initials": "SW",
      "role": "UI/UX Designer",
      "rating": 4.8,
      "reviews": 280
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "UI/UX",
      "Design",
      "Figma"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"UX Research Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in UI/UX",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "design-systems-at-scale",
    "title": "Design Systems at Scale",
    "category": "design",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 885,
    "duration": "5h 35m",
    "description": "A practical, project-driven introduction to design systems at scale — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sarah-williams",
      "name": "Sarah Williams",
      "initials": "SW",
      "role": "UI/UX Designer",
      "rating": 4.8,
      "reviews": 280
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "UI/UX",
      "Design",
      "Figma"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Design Systems at Scale\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in UI/UX",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "wireframing-prototyping",
    "title": "Wireframing & Prototyping",
    "category": "design",
    "level": "Advanced",
    "rating": 4.6,
    "students": 1420,
    "duration": "6h 26m",
    "description": "A practical, project-driven introduction to wireframing & prototyping — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sarah-williams",
      "name": "Sarah Williams",
      "initials": "SW",
      "role": "UI/UX Designer",
      "rating": 4.8,
      "reviews": 280
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "UI/UX",
      "Design",
      "Figma"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Wireframing & Prototyping\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in UI/UX",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "mobile-app-ui-design",
    "title": "Mobile App UI Design",
    "category": "design",
    "level": "Beginner",
    "rating": 4.5,
    "students": 1936,
    "duration": "3h 00m",
    "description": "A practical, project-driven introduction to mobile app ui design — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sarah-williams",
      "name": "Sarah Williams",
      "initials": "SW",
      "role": "UI/UX Designer",
      "rating": 4.8,
      "reviews": 280
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "UI/UX",
      "Design",
      "Figma"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Mobile App UI Design\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in UI/UX",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "user-testing-methods",
    "title": "User Testing Methods",
    "category": "design",
    "level": "Intermediate",
    "rating": 4.5,
    "students": 2259,
    "duration": "5h 21m",
    "description": "A practical, project-driven introduction to user testing methods — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sarah-williams",
      "name": "Sarah Williams",
      "initials": "SW",
      "role": "UI/UX Designer",
      "rating": 4.8,
      "reviews": 280
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "UI/UX",
      "Design",
      "Figma"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"User Testing Methods\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in UI/UX",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "interaction-design-basics",
    "title": "Interaction Design Basics",
    "category": "design",
    "level": "Advanced",
    "rating": 4.9,
    "students": 3591,
    "duration": "5h 31m",
    "description": "A practical, project-driven introduction to interaction design basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sarah-williams",
      "name": "Sarah Williams",
      "initials": "SW",
      "role": "UI/UX Designer",
      "rating": 4.8,
      "reviews": 280
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "UI/UX",
      "Design",
      "Figma"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Interaction Design Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in UI/UX",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "accessibility-in-design",
    "title": "Accessibility in Design",
    "category": "design",
    "level": "Beginner",
    "rating": 4.9,
    "students": 1789,
    "duration": "4h 29m",
    "description": "A practical, project-driven introduction to accessibility in design — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sarah-williams",
      "name": "Sarah Williams",
      "initials": "SW",
      "role": "UI/UX Designer",
      "rating": 4.8,
      "reviews": 280
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "UI/UX",
      "Design",
      "Figma"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Accessibility in Design\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in UI/UX",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "design-thinking-workshop",
    "title": "Design Thinking Workshop",
    "category": "design",
    "level": "Intermediate",
    "rating": 4.7,
    "students": 770,
    "duration": "3h 36m",
    "description": "A practical, project-driven introduction to design thinking workshop — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sarah-williams",
      "name": "Sarah Williams",
      "initials": "SW",
      "role": "UI/UX Designer",
      "rating": 4.8,
      "reviews": 280
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "UI/UX",
      "Design",
      "Figma"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Design Thinking Workshop\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in UI/UX",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "logo-brand-identity-design",
    "title": "Logo & Brand Identity Design",
    "category": "graphic-design",
    "level": "Beginner",
    "rating": 4.7,
    "students": 2100,
    "duration": "2h 52m",
    "description": "A practical, project-driven introduction to logo & brand identity design — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "nadia-hussain",
      "name": "Nadia Hussain",
      "initials": "NH",
      "role": "Graphic Designer",
      "rating": 4.8,
      "reviews": 172
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Graphic Design",
      "Branding",
      "Illustrator"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Logo & Brand Identity Design\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Graphic Design",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "adobe-illustrator-essentials",
    "title": "Adobe Illustrator Essentials",
    "category": "graphic-design",
    "level": "Intermediate",
    "rating": 4.6,
    "students": 2063,
    "duration": "6h 42m",
    "description": "A practical, project-driven introduction to adobe illustrator essentials — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "nadia-hussain",
      "name": "Nadia Hussain",
      "initials": "NH",
      "role": "Graphic Designer",
      "rating": 4.8,
      "reviews": 172
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Graphic Design",
      "Branding",
      "Illustrator"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Adobe Illustrator Essentials\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Graphic Design",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "adobe-photoshop-for-beginners",
    "title": "Adobe Photoshop for Beginners",
    "category": "graphic-design",
    "level": "Advanced",
    "rating": 4.6,
    "students": 3104,
    "duration": "2h 19m",
    "description": "A practical, project-driven introduction to adobe photoshop for beginners — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "nadia-hussain",
      "name": "Nadia Hussain",
      "initials": "NH",
      "role": "Graphic Designer",
      "rating": 4.8,
      "reviews": 172
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Graphic Design",
      "Branding",
      "Illustrator"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Adobe Photoshop for Beginners\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Graphic Design",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "typography-fundamentals",
    "title": "Typography Fundamentals",
    "category": "graphic-design",
    "level": "Beginner",
    "rating": 4.6,
    "students": 2984,
    "duration": "6h 36m",
    "description": "A practical, project-driven introduction to typography fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "nadia-hussain",
      "name": "Nadia Hussain",
      "initials": "NH",
      "role": "Graphic Designer",
      "rating": 4.8,
      "reviews": 172
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Graphic Design",
      "Branding",
      "Illustrator"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Typography Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Graphic Design",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "packaging-design-basics",
    "title": "Packaging Design Basics",
    "category": "graphic-design",
    "level": "Intermediate",
    "rating": 4.6,
    "students": 3524,
    "duration": "6h 29m",
    "description": "A practical, project-driven introduction to packaging design basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "nadia-hussain",
      "name": "Nadia Hussain",
      "initials": "NH",
      "role": "Graphic Designer",
      "rating": 4.8,
      "reviews": 172
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Graphic Design",
      "Branding",
      "Illustrator"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Packaging Design Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Graphic Design",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "print-design-principles",
    "title": "Print Design Principles",
    "category": "graphic-design",
    "level": "Advanced",
    "rating": 4.6,
    "students": 1838,
    "duration": "3h 55m",
    "description": "A practical, project-driven introduction to print design principles — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "nadia-hussain",
      "name": "Nadia Hussain",
      "initials": "NH",
      "role": "Graphic Designer",
      "rating": 4.8,
      "reviews": 172
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Graphic Design",
      "Branding",
      "Illustrator"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Print Design Principles\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Graphic Design",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "color-theory-for-designers",
    "title": "Color Theory for Designers",
    "category": "graphic-design",
    "level": "Beginner",
    "rating": 4.7,
    "students": 1359,
    "duration": "2h 38m",
    "description": "A practical, project-driven introduction to color theory for designers — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "nadia-hussain",
      "name": "Nadia Hussain",
      "initials": "NH",
      "role": "Graphic Designer",
      "rating": 4.8,
      "reviews": 172
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Graphic Design",
      "Branding",
      "Illustrator"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Color Theory for Designers\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Graphic Design",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "poster-layout-design",
    "title": "Poster & Layout Design",
    "category": "graphic-design",
    "level": "Intermediate",
    "rating": 4.7,
    "students": 1056,
    "duration": "4h 13m",
    "description": "A practical, project-driven introduction to poster & layout design — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "nadia-hussain",
      "name": "Nadia Hussain",
      "initials": "NH",
      "role": "Graphic Designer",
      "rating": 4.8,
      "reviews": 172
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Graphic Design",
      "Branding",
      "Illustrator"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Poster & Layout Design\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Graphic Design",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "premiere-pro-for-beginners",
    "title": "Premiere Pro for Beginners",
    "category": "video-editing",
    "level": "Beginner",
    "rating": 4.8,
    "students": 2702,
    "duration": "2h 57m",
    "description": "A practical, project-driven introduction to premiere pro for beginners — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "chris-park",
      "name": "Chris Park",
      "initials": "CP",
      "role": "Video Editor & Motion Designer",
      "rating": 4.7,
      "reviews": 151
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Video Editing",
      "Premiere Pro",
      "Motion Graphics"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Premiere Pro for Beginners\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Video Editing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "color-grading-fundamentals",
    "title": "Color Grading Fundamentals",
    "category": "video-editing",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 1198,
    "duration": "2h 40m",
    "description": "A practical, project-driven introduction to color grading fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "chris-park",
      "name": "Chris Park",
      "initials": "CP",
      "role": "Video Editor & Motion Designer",
      "rating": 4.7,
      "reviews": 151
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Video Editing",
      "Premiere Pro",
      "Motion Graphics"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Color Grading Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Video Editing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "after-effects-motion-graphics",
    "title": "After Effects Motion Graphics",
    "category": "video-editing",
    "level": "Advanced",
    "rating": 4.7,
    "students": 2371,
    "duration": "2h 42m",
    "description": "A practical, project-driven introduction to after effects motion graphics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "chris-park",
      "name": "Chris Park",
      "initials": "CP",
      "role": "Video Editor & Motion Designer",
      "rating": 4.7,
      "reviews": 151
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Video Editing",
      "Premiere Pro",
      "Motion Graphics"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"After Effects Motion Graphics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Video Editing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "youtube-video-editing-workflow",
    "title": "YouTube Video Editing Workflow",
    "category": "video-editing",
    "level": "Beginner",
    "rating": 4.9,
    "students": 1365,
    "duration": "5h 23m",
    "description": "A practical, project-driven introduction to youtube video editing workflow — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "chris-park",
      "name": "Chris Park",
      "initials": "CP",
      "role": "Video Editor & Motion Designer",
      "rating": 4.7,
      "reviews": 151
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Video Editing",
      "Premiere Pro",
      "Motion Graphics"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"YouTube Video Editing Workflow\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Video Editing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "short-form-video-editing-reels-tiktok",
    "title": "Short-Form Video Editing (Reels/TikTok)",
    "category": "video-editing",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 2886,
    "duration": "2h 12m",
    "description": "A practical, project-driven introduction to short-form video editing (reels/tiktok) — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "chris-park",
      "name": "Chris Park",
      "initials": "CP",
      "role": "Video Editor & Motion Designer",
      "rating": 4.7,
      "reviews": 151
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Video Editing",
      "Premiere Pro",
      "Motion Graphics"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Short-Form Video Editing (Reels/TikTok)\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Video Editing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "sound-design-for-video",
    "title": "Sound Design for Video",
    "category": "video-editing",
    "level": "Advanced",
    "rating": 4.6,
    "students": 425,
    "duration": "2h 44m",
    "description": "A practical, project-driven introduction to sound design for video — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "chris-park",
      "name": "Chris Park",
      "initials": "CP",
      "role": "Video Editor & Motion Designer",
      "rating": 4.7,
      "reviews": 151
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Video Editing",
      "Premiere Pro",
      "Motion Graphics"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Sound Design for Video\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Video Editing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "cinematic-storytelling-basics",
    "title": "Cinematic Storytelling Basics",
    "category": "video-editing",
    "level": "Beginner",
    "rating": 4.8,
    "students": 1859,
    "duration": "5h 56m",
    "description": "A practical, project-driven introduction to cinematic storytelling basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "chris-park",
      "name": "Chris Park",
      "initials": "CP",
      "role": "Video Editor & Motion Designer",
      "rating": 4.7,
      "reviews": 151
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Video Editing",
      "Premiere Pro",
      "Motion Graphics"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Cinematic Storytelling Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Video Editing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "social-media-marketing",
    "title": "Social Media Marketing",
    "category": "marketing",
    "level": "Beginner",
    "rating": 4.6,
    "students": 2165,
    "duration": "2h 04m",
    "description": "A practical, project-driven introduction to social media marketing — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Marketing",
      "Social Media",
      "Growth"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Social Media Marketing\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Marketing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "content-marketing-strategy",
    "title": "Content Marketing Strategy",
    "category": "marketing",
    "level": "Intermediate",
    "rating": 4.6,
    "students": 3149,
    "duration": "6h 37m",
    "description": "A practical, project-driven introduction to content marketing strategy — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Marketing",
      "Social Media",
      "Growth"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Content Marketing Strategy\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Marketing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "email-marketing-fundamentals",
    "title": "Email Marketing Fundamentals",
    "category": "marketing",
    "level": "Advanced",
    "rating": 4.7,
    "students": 593,
    "duration": "3h 35m",
    "description": "A practical, project-driven introduction to email marketing fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Marketing",
      "Social Media",
      "Growth"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Email Marketing Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Marketing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "facebook-instagram-ads",
    "title": "Facebook & Instagram Ads",
    "category": "marketing",
    "level": "Beginner",
    "rating": 4.9,
    "students": 1186,
    "duration": "6h 25m",
    "description": "A practical, project-driven introduction to facebook & instagram ads — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Marketing",
      "Social Media",
      "Growth"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Facebook & Instagram Ads\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Marketing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "copywriting-for-marketers",
    "title": "Copywriting for Marketers",
    "category": "marketing",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 2463,
    "duration": "2h 23m",
    "description": "A practical, project-driven introduction to copywriting for marketers — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Marketing",
      "Social Media",
      "Growth"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Copywriting for Marketers\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Marketing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "brand-strategy-basics",
    "title": "Brand Strategy Basics",
    "category": "marketing",
    "level": "Advanced",
    "rating": 4.6,
    "students": 778,
    "duration": "5h 59m",
    "description": "A practical, project-driven introduction to brand strategy basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Marketing",
      "Social Media",
      "Growth"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Brand Strategy Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Marketing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "influencer-marketing-101",
    "title": "Influencer Marketing 101",
    "category": "marketing",
    "level": "Beginner",
    "rating": 5,
    "students": 2975,
    "duration": "2h 40m",
    "description": "A practical, project-driven introduction to influencer marketing 101 — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Marketing",
      "Social Media",
      "Growth"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Influencer Marketing 101\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Marketing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "marketing-analytics-essentials",
    "title": "Marketing Analytics Essentials",
    "category": "marketing",
    "level": "Intermediate",
    "rating": 4.8,
    "students": 2071,
    "duration": "6h 58m",
    "description": "A practical, project-driven introduction to marketing analytics essentials — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Marketing",
      "Social Media",
      "Growth"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Marketing Analytics Essentials\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Marketing",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "seo-growth-marketing",
    "title": "SEO & Growth Marketing",
    "category": "business",
    "level": "Beginner",
    "rating": 4.6,
    "students": 2152,
    "duration": "2h 03m",
    "description": "A practical, project-driven introduction to seo & growth marketing — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Business",
      "Strategy",
      "Entrepreneurship"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"SEO & Growth Marketing\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Business",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "startup-fundamentals",
    "title": "Startup Fundamentals",
    "category": "business",
    "level": "Intermediate",
    "rating": 4.6,
    "students": 2451,
    "duration": "3h 37m",
    "description": "A practical, project-driven introduction to startup fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Business",
      "Strategy",
      "Entrepreneurship"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Startup Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Business",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "freelancing-client-management",
    "title": "Freelancing & Client Management",
    "category": "business",
    "level": "Advanced",
    "rating": 4.8,
    "students": 2991,
    "duration": "2h 13m",
    "description": "A practical, project-driven introduction to freelancing & client management — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Business",
      "Strategy",
      "Entrepreneurship"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Freelancing & Client Management\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Business",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "product-management-basics",
    "title": "Product Management Basics",
    "category": "business",
    "level": "Beginner",
    "rating": 4.6,
    "students": 958,
    "duration": "4h 01m",
    "description": "A practical, project-driven introduction to product management basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Business",
      "Strategy",
      "Entrepreneurship"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Product Management Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Business",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "public-speaking-for-professionals",
    "title": "Public Speaking for Professionals",
    "category": "business",
    "level": "Intermediate",
    "rating": 4.5,
    "students": 2944,
    "duration": "4h 08m",
    "description": "A practical, project-driven introduction to public speaking for professionals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Business",
      "Strategy",
      "Entrepreneurship"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Public Speaking for Professionals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Business",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "negotiation-skills",
    "title": "Negotiation Skills",
    "category": "business",
    "level": "Advanced",
    "rating": 4.6,
    "students": 1774,
    "duration": "6h 01m",
    "description": "A practical, project-driven introduction to negotiation skills — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Business",
      "Strategy",
      "Entrepreneurship"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Negotiation Skills\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Business",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "business-analytics-with-excel",
    "title": "Business Analytics with Excel",
    "category": "business",
    "level": "Beginner",
    "rating": 4.9,
    "students": 1213,
    "duration": "4h 53m",
    "description": "A practical, project-driven introduction to business analytics with excel — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "david-smith",
      "name": "David Smith",
      "initials": "DS",
      "role": "Digital Marketer",
      "rating": 4.9,
      "reviews": 410
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Business",
      "Strategy",
      "Entrepreneurship"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Business Analytics with Excel\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Business",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "personal-budgeting-101",
    "title": "Personal Budgeting 101",
    "category": "finance",
    "level": "Beginner",
    "rating": 4.9,
    "students": 816,
    "duration": "5h 35m",
    "description": "A practical, project-driven introduction to personal budgeting 101 — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sofia-martins",
      "name": "Sofia Martins",
      "initials": "SM",
      "role": "Personal Finance Coach",
      "rating": 4.9,
      "reviews": 264
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Finance",
      "Investing",
      "Budgeting"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Personal Budgeting 101\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Finance",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "investing-for-beginners",
    "title": "Investing for Beginners",
    "category": "finance",
    "level": "Intermediate",
    "rating": 4.6,
    "students": 2811,
    "duration": "4h 28m",
    "description": "A practical, project-driven introduction to investing for beginners — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sofia-martins",
      "name": "Sofia Martins",
      "initials": "SM",
      "role": "Personal Finance Coach",
      "rating": 4.9,
      "reviews": 264
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Finance",
      "Investing",
      "Budgeting"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Investing for Beginners\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Finance",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "understanding-the-stock-market",
    "title": "Understanding the Stock Market",
    "category": "finance",
    "level": "Advanced",
    "rating": 4.6,
    "students": 2002,
    "duration": "4h 43m",
    "description": "A practical, project-driven introduction to understanding the stock market — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sofia-martins",
      "name": "Sofia Martins",
      "initials": "SM",
      "role": "Personal Finance Coach",
      "rating": 4.9,
      "reviews": 264
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Finance",
      "Investing",
      "Budgeting"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Understanding the Stock Market\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Finance",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "financial-planning-essentials",
    "title": "Financial Planning Essentials",
    "category": "finance",
    "level": "Beginner",
    "rating": 4.6,
    "students": 3985,
    "duration": "5h 32m",
    "description": "A practical, project-driven introduction to financial planning essentials — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sofia-martins",
      "name": "Sofia Martins",
      "initials": "SM",
      "role": "Personal Finance Coach",
      "rating": 4.9,
      "reviews": 264
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Finance",
      "Investing",
      "Budgeting"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Financial Planning Essentials\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Finance",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "excel-for-financial-modeling",
    "title": "Excel for Financial Modeling",
    "category": "finance",
    "level": "Intermediate",
    "rating": 4.8,
    "students": 3714,
    "duration": "5h 33m",
    "description": "A practical, project-driven introduction to excel for financial modeling — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sofia-martins",
      "name": "Sofia Martins",
      "initials": "SM",
      "role": "Personal Finance Coach",
      "rating": 4.9,
      "reviews": 264
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Finance",
      "Investing",
      "Budgeting"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Excel for Financial Modeling\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Finance",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "cryptocurrency-basics",
    "title": "Cryptocurrency Basics",
    "category": "finance",
    "level": "Advanced",
    "rating": 5,
    "students": 702,
    "duration": "4h 09m",
    "description": "A practical, project-driven introduction to cryptocurrency basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sofia-martins",
      "name": "Sofia Martins",
      "initials": "SM",
      "role": "Personal Finance Coach",
      "rating": 4.9,
      "reviews": 264
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Finance",
      "Investing",
      "Budgeting"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Cryptocurrency Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Finance",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "retirement-planning-fundamentals",
    "title": "Retirement Planning Fundamentals",
    "category": "finance",
    "level": "Beginner",
    "rating": 4.6,
    "students": 1376,
    "duration": "2h 47m",
    "description": "A practical, project-driven introduction to retirement planning fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "sofia-martins",
      "name": "Sofia Martins",
      "initials": "SM",
      "role": "Personal Finance Coach",
      "rating": 4.9,
      "reviews": 264
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Finance",
      "Investing",
      "Budgeting"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Retirement Planning Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Finance",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "conversational-spanish",
    "title": "Conversational Spanish",
    "category": "languages",
    "level": "Beginner",
    "rating": 4.7,
    "students": 3928,
    "duration": "4h 08m",
    "description": "A practical, project-driven introduction to conversational spanish — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "emma-brown",
      "name": "Emma Brown",
      "initials": "EB",
      "role": "English Tutor",
      "rating": 4.8,
      "reviews": 220
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Language Learning",
      "Grammar",
      "Conversation"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Conversational Spanish\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Language Learning",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "conversational-french",
    "title": "Conversational French",
    "category": "languages",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 1017,
    "duration": "2h 31m",
    "description": "A practical, project-driven introduction to conversational french — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "emma-brown",
      "name": "Emma Brown",
      "initials": "EB",
      "role": "English Tutor",
      "rating": 4.8,
      "reviews": 220
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Language Learning",
      "Grammar",
      "Conversation"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Conversational French\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Language Learning",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "mandarin-chinese-for-beginners",
    "title": "Mandarin Chinese for Beginners",
    "category": "languages",
    "level": "Advanced",
    "rating": 5,
    "students": 2173,
    "duration": "3h 51m",
    "description": "A practical, project-driven introduction to mandarin chinese for beginners — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "emma-brown",
      "name": "Emma Brown",
      "initials": "EB",
      "role": "English Tutor",
      "rating": 4.8,
      "reviews": 220
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Language Learning",
      "Grammar",
      "Conversation"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Mandarin Chinese for Beginners\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Language Learning",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "business-english-communication",
    "title": "Business English Communication",
    "category": "languages",
    "level": "Beginner",
    "rating": 4.8,
    "students": 473,
    "duration": "6h 34m",
    "description": "A practical, project-driven introduction to business english communication — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "emma-brown",
      "name": "Emma Brown",
      "initials": "EB",
      "role": "English Tutor",
      "rating": 4.8,
      "reviews": 220
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Language Learning",
      "Grammar",
      "Conversation"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Business English Communication\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Language Learning",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "japanese-for-travel",
    "title": "Japanese for Travel",
    "category": "languages",
    "level": "Intermediate",
    "rating": 5,
    "students": 1041,
    "duration": "6h 34m",
    "description": "A practical, project-driven introduction to japanese for travel — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "emma-brown",
      "name": "Emma Brown",
      "initials": "EB",
      "role": "English Tutor",
      "rating": 4.8,
      "reviews": 220
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Language Learning",
      "Grammar",
      "Conversation"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Japanese for Travel\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Language Learning",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "german-grammar-essentials",
    "title": "German Grammar Essentials",
    "category": "languages",
    "level": "Advanced",
    "rating": 4.9,
    "students": 2677,
    "duration": "3h 25m",
    "description": "A practical, project-driven introduction to german grammar essentials — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "emma-brown",
      "name": "Emma Brown",
      "initials": "EB",
      "role": "English Tutor",
      "rating": 4.8,
      "reviews": 220
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Language Learning",
      "Grammar",
      "Conversation"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"German Grammar Essentials\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Language Learning",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "italian-conversation-practice",
    "title": "Italian Conversation Practice",
    "category": "languages",
    "level": "Beginner",
    "rating": 4.7,
    "students": 2175,
    "duration": "2h 00m",
    "description": "A practical, project-driven introduction to italian conversation practice — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "emma-brown",
      "name": "Emma Brown",
      "initials": "EB",
      "role": "English Tutor",
      "rating": 4.8,
      "reviews": 220
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Language Learning",
      "Grammar",
      "Conversation"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Italian Conversation Practice\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Language Learning",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "music-theory-fundamentals",
    "title": "Music Theory Fundamentals",
    "category": "music",
    "level": "Beginner",
    "rating": 4.6,
    "students": 2374,
    "duration": "3h 37m",
    "description": "A practical, project-driven introduction to music theory fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "james-carter",
      "name": "James Carter",
      "initials": "JC",
      "role": "Music Producer",
      "rating": 4.7,
      "reviews": 165
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Music",
      "Instrument",
      "Theory"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Music Theory Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Music",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "guitar-for-beginners",
    "title": "Guitar for Beginners",
    "category": "music",
    "level": "Intermediate",
    "rating": 4.7,
    "students": 781,
    "duration": "6h 43m",
    "description": "A practical, project-driven introduction to guitar for beginners — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "james-carter",
      "name": "James Carter",
      "initials": "JC",
      "role": "Music Producer",
      "rating": 4.7,
      "reviews": 165
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Music",
      "Instrument",
      "Theory"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Guitar for Beginners\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Music",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "piano-basics",
    "title": "Piano Basics",
    "category": "music",
    "level": "Advanced",
    "rating": 4.8,
    "students": 1934,
    "duration": "2h 29m",
    "description": "A practical, project-driven introduction to piano basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "james-carter",
      "name": "James Carter",
      "initials": "JC",
      "role": "Music Producer",
      "rating": 4.7,
      "reviews": 165
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Music",
      "Instrument",
      "Theory"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Piano Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Music",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "songwriting-workshop",
    "title": "Songwriting Workshop",
    "category": "music",
    "level": "Beginner",
    "rating": 4.9,
    "students": 2250,
    "duration": "3h 13m",
    "description": "A practical, project-driven introduction to songwriting workshop — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "james-carter",
      "name": "James Carter",
      "initials": "JC",
      "role": "Music Producer",
      "rating": 4.7,
      "reviews": 165
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Music",
      "Instrument",
      "Theory"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Songwriting Workshop\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Music",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "vocal-technique-essentials",
    "title": "Vocal Technique Essentials",
    "category": "music",
    "level": "Intermediate",
    "rating": 4.5,
    "students": 3356,
    "duration": "2h 56m",
    "description": "A practical, project-driven introduction to vocal technique essentials — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "james-carter",
      "name": "James Carter",
      "initials": "JC",
      "role": "Music Producer",
      "rating": 4.7,
      "reviews": 165
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Music",
      "Instrument",
      "Theory"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Vocal Technique Essentials\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Music",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "mixing-mastering-basics",
    "title": "Mixing & Mastering Basics",
    "category": "music",
    "level": "Advanced",
    "rating": 4.6,
    "students": 3104,
    "duration": "6h 47m",
    "description": "A practical, project-driven introduction to mixing & mastering basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "james-carter",
      "name": "James Carter",
      "initials": "JC",
      "role": "Music Producer",
      "rating": 4.7,
      "reviews": 165
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Music",
      "Instrument",
      "Theory"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Mixing & Mastering Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Music",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "electronic-music-production",
    "title": "Electronic Music Production",
    "category": "music",
    "level": "Beginner",
    "rating": 5,
    "students": 3788,
    "duration": "6h 42m",
    "description": "A practical, project-driven introduction to electronic music production — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "james-carter",
      "name": "James Carter",
      "initials": "JC",
      "role": "Music Producer",
      "rating": 4.7,
      "reviews": 165
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Music",
      "Instrument",
      "Theory"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Electronic Music Production\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Music",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "landscape-photography",
    "title": "Landscape Photography",
    "category": "photography",
    "level": "Beginner",
    "rating": 4.7,
    "students": 2954,
    "duration": "6h 29m",
    "description": "A practical, project-driven introduction to landscape photography — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "maria-lopez",
      "name": "Maria Lopez",
      "initials": "ML",
      "role": "Portrait Photographer",
      "rating": 4.8,
      "reviews": 140
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Photography",
      "Editing",
      "Composition"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Landscape Photography\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Photography",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "photo-editing-in-lightroom",
    "title": "Photo Editing in Lightroom",
    "category": "photography",
    "level": "Intermediate",
    "rating": 4.6,
    "students": 3873,
    "duration": "2h 43m",
    "description": "A practical, project-driven introduction to photo editing in lightroom — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "maria-lopez",
      "name": "Maria Lopez",
      "initials": "ML",
      "role": "Portrait Photographer",
      "rating": 4.8,
      "reviews": 140
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Photography",
      "Editing",
      "Composition"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Photo Editing in Lightroom\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Photography",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "street-photography-basics",
    "title": "Street Photography Basics",
    "category": "photography",
    "level": "Advanced",
    "rating": 4.6,
    "students": 3026,
    "duration": "6h 48m",
    "description": "A practical, project-driven introduction to street photography basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "maria-lopez",
      "name": "Maria Lopez",
      "initials": "ML",
      "role": "Portrait Photographer",
      "rating": 4.8,
      "reviews": 140
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Photography",
      "Editing",
      "Composition"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Street Photography Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Photography",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "product-photography-essentials",
    "title": "Product Photography Essentials",
    "category": "photography",
    "level": "Beginner",
    "rating": 4.9,
    "students": 2566,
    "duration": "4h 00m",
    "description": "A practical, project-driven introduction to product photography essentials — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "maria-lopez",
      "name": "Maria Lopez",
      "initials": "ML",
      "role": "Portrait Photographer",
      "rating": 4.8,
      "reviews": 140
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Photography",
      "Editing",
      "Composition"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Product Photography Essentials\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Photography",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "manual-camera-settings-explained",
    "title": "Manual Camera Settings Explained",
    "category": "photography",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 551,
    "duration": "3h 42m",
    "description": "A practical, project-driven introduction to manual camera settings explained — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "maria-lopez",
      "name": "Maria Lopez",
      "initials": "ML",
      "role": "Portrait Photographer",
      "rating": 4.8,
      "reviews": 140
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Photography",
      "Editing",
      "Composition"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Manual Camera Settings Explained\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Photography",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "composition-framing-techniques",
    "title": "Composition & Framing Techniques",
    "category": "photography",
    "level": "Advanced",
    "rating": 4.8,
    "students": 743,
    "duration": "5h 27m",
    "description": "A practical, project-driven introduction to composition & framing techniques — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "maria-lopez",
      "name": "Maria Lopez",
      "initials": "ML",
      "role": "Portrait Photographer",
      "rating": 4.8,
      "reviews": 140
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Photography",
      "Editing",
      "Composition"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Composition & Framing Techniques\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Photography",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "everyday-italian-cooking",
    "title": "Everyday Italian Cooking",
    "category": "cooking",
    "level": "Beginner",
    "rating": 4.8,
    "students": 2995,
    "duration": "5h 38m",
    "description": "A practical, project-driven introduction to everyday italian cooking — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "priya-sharma",
      "name": "Priya Sharma",
      "initials": "PS",
      "role": "Home Baker & Instructor",
      "rating": 4.9,
      "reviews": 305
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Cooking",
      "Recipes",
      "Technique"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Everyday Italian Cooking\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Cooking",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "knife-skills-for-home-cooks",
    "title": "Knife Skills for Home Cooks",
    "category": "cooking",
    "level": "Intermediate",
    "rating": 4.9,
    "students": 1375,
    "duration": "2h 01m",
    "description": "A practical, project-driven introduction to knife skills for home cooks — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "priya-sharma",
      "name": "Priya Sharma",
      "initials": "PS",
      "role": "Home Baker & Instructor",
      "rating": 4.9,
      "reviews": 305
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Cooking",
      "Recipes",
      "Technique"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Knife Skills for Home Cooks\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Cooking",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "vegetarian-cooking-essentials",
    "title": "Vegetarian Cooking Essentials",
    "category": "cooking",
    "level": "Advanced",
    "rating": 4.6,
    "students": 359,
    "duration": "2h 15m",
    "description": "A practical, project-driven introduction to vegetarian cooking essentials — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "priya-sharma",
      "name": "Priya Sharma",
      "initials": "PS",
      "role": "Home Baker & Instructor",
      "rating": 4.9,
      "reviews": 305
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Cooking",
      "Recipes",
      "Technique"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Vegetarian Cooking Essentials\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Cooking",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "sourdough-bread-baking",
    "title": "Sourdough Bread Baking",
    "category": "cooking",
    "level": "Beginner",
    "rating": 4.7,
    "students": 1765,
    "duration": "4h 33m",
    "description": "A practical, project-driven introduction to sourdough bread baking — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "priya-sharma",
      "name": "Priya Sharma",
      "initials": "PS",
      "role": "Home Baker & Instructor",
      "rating": 4.9,
      "reviews": 305
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Cooking",
      "Recipes",
      "Technique"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Sourdough Bread Baking\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Cooking",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "asian-stir-fry-fundamentals",
    "title": "Asian Stir-Fry Fundamentals",
    "category": "cooking",
    "level": "Intermediate",
    "rating": 4.8,
    "students": 1706,
    "duration": "2h 30m",
    "description": "A practical, project-driven introduction to asian stir-fry fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "priya-sharma",
      "name": "Priya Sharma",
      "initials": "PS",
      "role": "Home Baker & Instructor",
      "rating": 4.9,
      "reviews": 305
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Cooking",
      "Recipes",
      "Technique"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Asian Stir-Fry Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Cooking",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "meal-prep-for-beginners",
    "title": "Meal Prep for Beginners",
    "category": "cooking",
    "level": "Advanced",
    "rating": 4.7,
    "students": 1887,
    "duration": "5h 33m",
    "description": "A practical, project-driven introduction to meal prep for beginners — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "priya-sharma",
      "name": "Priya Sharma",
      "initials": "PS",
      "role": "Home Baker & Instructor",
      "rating": 4.9,
      "reviews": 305
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Cooking",
      "Recipes",
      "Technique"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Meal Prep for Beginners\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Cooking",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "beginner-yoga-fundamentals",
    "title": "Beginner Yoga Fundamentals",
    "category": "fitness",
    "level": "Beginner",
    "rating": 4.5,
    "students": 2909,
    "duration": "4h 00m",
    "description": "A practical, project-driven introduction to beginner yoga fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "daniel-smith",
      "name": "Daniel Smith",
      "initials": "DS",
      "role": "Certified Trainer",
      "rating": 4.7,
      "reviews": 190
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Fitness",
      "Training",
      "Wellness"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Beginner Yoga Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Fitness",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "home-bodyweight-training",
    "title": "Home Bodyweight Training",
    "category": "fitness",
    "level": "Intermediate",
    "rating": 4.6,
    "students": 1248,
    "duration": "5h 36m",
    "description": "A practical, project-driven introduction to home bodyweight training — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "daniel-smith",
      "name": "Daniel Smith",
      "initials": "DS",
      "role": "Certified Trainer",
      "rating": 4.7,
      "reviews": 190
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Fitness",
      "Training",
      "Wellness"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Home Bodyweight Training\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Fitness",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "mobility-flexibility-basics",
    "title": "Mobility & Flexibility Basics",
    "category": "fitness",
    "level": "Advanced",
    "rating": 4.9,
    "students": 865,
    "duration": "5h 58m",
    "description": "A practical, project-driven introduction to mobility & flexibility basics — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "daniel-smith",
      "name": "Daniel Smith",
      "initials": "DS",
      "role": "Certified Trainer",
      "rating": 4.7,
      "reviews": 190
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Fitness",
      "Training",
      "Wellness"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Mobility & Flexibility Basics\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Fitness",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "running-fundamentals",
    "title": "Running Fundamentals",
    "category": "fitness",
    "level": "Beginner",
    "rating": 4.7,
    "students": 4015,
    "duration": "2h 28m",
    "description": "A practical, project-driven introduction to running fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "daniel-smith",
      "name": "Daniel Smith",
      "initials": "DS",
      "role": "Certified Trainer",
      "rating": 4.7,
      "reviews": 190
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Fitness",
      "Training",
      "Wellness"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Running Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Fitness",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 0
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "nutrition-basics-for-fitness",
    "title": "Nutrition Basics for Fitness",
    "category": "fitness",
    "level": "Intermediate",
    "rating": 4.8,
    "students": 3839,
    "duration": "6h 39m",
    "description": "A practical, project-driven introduction to nutrition basics for fitness — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "daniel-smith",
      "name": "Daniel Smith",
      "initials": "DS",
      "role": "Certified Trainer",
      "rating": 4.7,
      "reviews": 190
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Fitness",
      "Training",
      "Wellness"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"Nutrition Basics for Fitness\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Fitness",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 1
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  },
  {
    "id": "hiit-workout-fundamentals",
    "title": "HIIT Workout Fundamentals",
    "category": "fitness",
    "level": "Advanced",
    "rating": 4.5,
    "students": 2440,
    "duration": "3h 23m",
    "description": "A practical, project-driven introduction to hiit workout fundamentals — built around real exercises so the skill actually sticks, not just theory.",
    "mentor": {
      "id": "daniel-smith",
      "name": "Daniel Smith",
      "initials": "DS",
      "role": "Certified Trainer",
      "rating": 4.7,
      "reviews": 190
    },
    "prerequisites": [
      "No prior experience required",
      "A device with a stable internet connection"
    ],
    "tags": [
      "Fitness",
      "Training",
      "Wellness"
    ],
    "previewVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "lessons": [
      {
        "id": 1,
        "title": "Getting oriented: tools & setup",
        "duration": "10 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "quiz": []
      },
      {
        "id": 2,
        "title": "Core concepts walkthrough",
        "duration": "13 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "quiz": []
      },
      {
        "id": 3,
        "title": "Hands-on practice session",
        "duration": "16 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "quiz": []
      },
      {
        "id": 4,
        "title": "Common mistakes to avoid",
        "duration": "19 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "quiz": []
      },
      {
        "id": 5,
        "title": "Putting it all together",
        "duration": "22 min",
        "type": "Video",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "quiz": []
      },
      {
        "id": 6,
        "title": "Checkpoint quiz",
        "duration": "8 min",
        "type": "Quiz",
        "videoUrl": null,
        "quiz": [
          {
            "q": "What's the main focus of \"HIIT Workout Fundamentals\"?",
            "options": [
              "Unrelated trivia",
              "Practical, hands-on skills in Fitness",
              "Only theory, no practice",
              "History of the field"
            ],
            "correct": 1
          },
          {
            "q": "What level is this course aimed at?",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced"
            ],
            "correct": 2
          },
          {
            "q": "What helps most when learning a new skill like this?",
            "options": [
              "Skipping practice",
              "Consistent, hands-on practice",
              "Reading once and never returning",
              "Avoiding feedback"
            ],
            "correct": 1
          }
        ]
      }
    ]
  }
];
