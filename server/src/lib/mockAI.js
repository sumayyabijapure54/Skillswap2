// ============================================================================
// mockAI.js — local, zero-cost stand-in for the Anthropic API.
//
// When AI_MOCK_MODE=true, anthropicClient.js routes every askClaude() call
// through mockClaude(prompt) instead of calling api.anthropic.com. Nothing
// in here ever touches the network — it inspects the prompt text (the same
// system + conversation Claude would have seen) and fabricates a realistic,
// randomized reply that matches the exact JSON/text shape the caller expects.
//
// IMPORTANT — this codebase actually has TWO different quiz callers with
// TWO different JSON schemas, and this module supports both so nothing
// breaks depending on which feature triggered it:
//   1. chatbotController.js "Quiz me" quick action:
//        { questions: [{ question, options[4], correctIndex, explanation }] }
//        — 5 questions, options is index-based ("correctIndex").
//   2. aiQuizService.js course-quiz generator (server/src/services/aiQuizService.js):
//        { questions: [{ question, options[4], correctAnswer, explanation, difficulty }] }
//        — 10-20 questions, "correctAnswer" must exactly match one of the options
//        (not an index), and each question needs a difficulty tag.
// mockClaude() sniffs which schema is being asked for and returns the right
// one, so both the AI Mentor chat panel *and* the full course-quiz feature
// keep working identically to production, just with fabricated content.
// ============================================================================

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function extract(re, text, fallback = null) {
  const m = text.match(re);
  return m ? m[1].trim() : fallback;
}

// ----------------------------------------------------------------------------
// Topic knowledge bank — curated content for the topics explicitly called out
// in the spec, each with several randomized variants so repeated calls don't
// look identical. Anything not in this bank falls back to a generic but still
// topic-aware generator further down.
// ----------------------------------------------------------------------------
const TOPICS = {
  react: {
    aliases: ['react', 'react.js', 'reactjs'],
    label: 'React',
    explanations: [
      'React is a JavaScript library (built by Meta) for building user interfaces out of reusable, composable components. Instead of directly manipulating the DOM, you describe what the UI should look like for a given state, and React efficiently updates the real DOM for you via a virtual DOM diffing process.',
      'React lets you build UIs by breaking them into small, reusable components — think of them like custom HTML elements that manage their own logic and rendering. State changes trigger re-renders, and React figures out the minimal set of real DOM updates needed to reflect the new state.',
      "At its core, React gives you a component model plus a rendering engine: you write functions that return JSX (HTML-like syntax in JS), React tracks each component's state and props, and whenever either changes it re-renders that component (and its children) to keep the UI in sync."
    ],
    keyPoints: [
      'Components are the building block — small, reusable, composable pieces of UI',
      'JSX lets you write HTML-like markup directly inside JavaScript',
      'State (useState) drives re-renders; props pass data from parent to child',
      'The virtual DOM diffing algorithm keeps real DOM updates fast and minimal',
      'Hooks (useState, useEffect, useContext, etc.) let function components manage state and side effects',
      'Unidirectional data flow makes state changes predictable and easier to debug'
    ]
  },
  mongodb: {
    aliases: ['mongodb', 'mongo', 'mongoose'],
    label: 'MongoDB',
    explanations: [
      "MongoDB is a NoSQL, document-oriented database. Instead of rows and tables like a relational database, it stores data as flexible JSON-like documents (BSON) grouped into collections, which makes it a natural fit for JavaScript/Node apps where your data is already shaped like objects.",
      "MongoDB stores data as BSON documents inside collections rather than rows inside tables. Because documents don't need a fixed schema, it's easy to evolve your data model over time — handy in fast-moving apps like this one, where a Skill, User, or Booking document can grow new fields without a migration.",
      "Unlike SQL databases that enforce a rigid table schema, MongoDB documents can nest arrays and sub-objects directly, so related data (like a user's skillsOffered or a course's lessons) often lives in one document instead of being split across joined tables."
    ],
    keyPoints: [
      'Data is stored as BSON documents (JSON-like) grouped into collections, not rows/tables',
      'Schemas are flexible by default — Mongoose (used in this project) adds structure/validation on top',
      'Great fit for nested/related data — e.g. a Skill document can embed its own lessons array',
      'Queries use a JS-object-like syntax (e.g. find({ role: "mentor" })) instead of SQL',
      'Indexes work similarly to relational databases and are important for query performance',
      'Horizontal scaling (sharding) is a first-class feature for large datasets'
    ]
  },
  express: {
    aliases: ['express', 'express.js', 'expressjs'],
    label: 'Express',
    explanations: [
      'Express is a minimal, unopinionated web framework for Node.js. It gives you routing, middleware, and request/response helpers on top of Node\'s built-in HTTP module, which is why this project\'s server/src/routes and server/src/controllers folders are organized the way they are.',
      "Express sits on top of Node's http module and adds the pieces almost every API needs: a routing system (app.get, app.post, etc.), a middleware pipeline for things like auth and validation, and convenient req/res helpers — without forcing a particular project structure on you.",
      'Think of Express as a thin, flexible layer: you register middleware functions that run in order for each request (parsing JSON, checking auth tokens, rate limiting) and then a route handler that sends the actual response — exactly the pattern used throughout this server\'s routes/ and middleware/ folders.'
    ],
    keyPoints: [
      'Routing: app.get/post/put/delete map HTTP verbs + paths to handler functions',
      'Middleware functions run in sequence via next() — used here for auth, validation, rate limiting',
      'req/res objects wrap the raw Node request/response with convenient helpers (req.body, res.json, etc.)',
      'Error-handling middleware (functions with 4 args) centralizes error responses',
      'Express itself is unopinionated — structure (controllers/routes/services) is a convention, not enforced',
      'Works naturally with async/await when handlers are wrapped to catch rejected promises'
    ]
  },
  javascript: {
    aliases: ['javascript', 'js', 'vanilla js', 'es6'],
    label: 'JavaScript',
    explanations: [
      "JavaScript is a dynamically-typed, single-threaded (but event-loop-driven) programming language originally built for the browser and now also powering servers via Node.js. It supports multiple paradigms — functional, object-oriented, and event-driven — which is part of why it's so flexible.",
      'JavaScript runs on an event loop with a single call stack, using callbacks/promises/async-await to handle asynchronous work (network requests, timers, I/O) without blocking. That async model is central to both the browser and to Node.js backends like this one.',
      "JavaScript treats functions as first-class values (you can pass them around like any other data), supports closures, and — since ES6 — has classes, arrow functions, destructuring, and modules (import/export), all of which show up throughout this project's codebase."
    ],
    keyPoints: [
      'Dynamically typed — variable types are checked at runtime, not compile time',
      'Single-threaded with an event loop — async work uses callbacks, promises, or async/await',
      'Functions are first-class values and can be passed around, returned, and stored in variables',
      'Closures let inner functions "remember" variables from their enclosing scope',
      'ES6+ added classes, arrow functions, template literals, destructuring, and ES modules',
      'Prototypal inheritance underlies objects, even when using the newer class syntax'
    ]
  },
  css: {
    aliases: ['css', 'css3', 'stylesheets'],
    label: 'CSS',
    explanations: [
      "CSS (Cascading Style Sheets) controls how HTML elements are visually presented — layout, color, spacing, typography, responsiveness. The \"cascade\" in the name refers to how multiple rules can apply to the same element, with specificity and source order deciding which one wins.",
      'CSS separates presentation from structure: HTML describes what the content is, and CSS describes how it should look. Selectors target elements (by tag, class, id, or relationship), and each rule sets one or more properties like color, margin, or display.',
      'Modern CSS includes powerful layout systems — Flexbox for one-dimensional layouts and Grid for two-dimensional ones — plus features like custom properties (variables), media queries for responsive design, and transitions/animations for motion.'
    ],
    keyPoints: [
      'The "cascade" resolves conflicting rules using specificity, source order, and !important',
      'The box model (content, padding, border, margin) determines an element\'s size and spacing',
      'Flexbox handles one-dimensional layouts; CSS Grid handles two-dimensional layouts',
      'Media queries enable responsive design across screen sizes',
      'Custom properties (--variable-name) let you reuse and theme values across a stylesheet',
      'Specificity is calculated from selector type: inline > id > class/attribute > element'
    ]
  },
  node: {
    aliases: ['node', 'node.js', 'nodejs'],
    label: 'Node.js',
    explanations: [
      "Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JS outside the browser — most commonly to build servers, like the Express backend in this project. It's single-threaded but uses an event loop and non-blocking I/O to handle many concurrent connections efficiently.",
      'Node.js takes the JavaScript language and gives it access to the filesystem, network, and OS — things a browser sandboxes away — via built-in modules like http, fs, and path. Its non-blocking, event-driven design is why it\'s well suited to I/O-heavy apps like APIs and real-time servers.',
      'Because Node uses an event loop instead of spawning a thread per request, it can handle large numbers of concurrent connections cheaply — as long as you avoid long-running synchronous (CPU-bound) code that would block that single thread.'
    ],
    keyPoints: [
      'Runs JavaScript outside the browser using the V8 engine',
      'Non-blocking, event-driven I/O — a single thread handles many concurrent requests',
      'npm (Node Package Manager) is the ecosystem for installing/sharing packages',
      'CommonJS (require) and ES modules (import) are both supported, depending on config',
      'Built-in modules like http, fs, path, and crypto cover common server needs',
      'CPU-bound synchronous work blocks the whole event loop — offload it (workers, queues) when needed'
    ]
  },
  api: {
    aliases: ['api', 'apis', 'rest api', 'rest', 'restful api'],
    label: 'APIs',
    explanations: [
      'An API (Application Programming Interface) is a defined contract that lets one piece of software talk to another — in a web context, usually a set of URL endpoints that accept requests and return data (often JSON), like the /api/quiz or /api/chatbot routes in this project.',
      'A REST API organizes functionality around resources (skills, users, bookings) and standard HTTP verbs — GET to read, POST to create, PUT/PATCH to update, DELETE to remove — with the URL path identifying which resource you\'re acting on.',
      'APIs decouple frontend and backend: the client doesn\'t need to know how the server stores or processes data, only what endpoints exist, what to send, and what shape of response to expect — which is exactly the contract each routes/*.js + controllers/*.js pair in this project defines.'
    ],
    keyPoints: [
      'REST APIs map HTTP verbs (GET/POST/PUT/DELETE) to actions on named resources',
      'Status codes communicate outcome (200 OK, 201 Created, 400 Bad Request, 401/403 auth issues, 404, 500)',
      'JSON is the most common request/response body format for web APIs',
      'Authentication (tokens, sessions, API keys) controls who can call which endpoints',
      'Good APIs are consistent, predictable, and versioned so clients don\'t break on change',
      'Middleware (auth checks, validation, rate limiting) commonly runs before the route handler'
    ]
  }
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findTopic(text) {
  for (const key of Object.keys(TOPICS)) {
    const hit = TOPICS[key].aliases.some((a) => new RegExp(`\\b${escapeRegex(a)}\\b`, 'i').test(text));
    if (hit) return TOPICS[key];
  }
  return null;
}

// Pulls a human-readable topic string out of whatever prompt shape we were
// given — quoted lesson/skill titles from chatbotController, "Course title:"
// from aiQuizService, or a generic fallback.
function guessTopicLabel(prompt) {
  const quoted = extract(/"([^"]{2,80})"/, prompt);
  const courseTitle = extract(/Course title:\s*(.+)/, prompt);
  const skillLine = extract(/Skill:\s*(.+)/, prompt);
  return courseTitle || quoted || skillLine || 'this topic';
}

// ----------------------------------------------------------------------------
// CHAT
// ----------------------------------------------------------------------------
const CHAT_OPENERS = [
  "Great question — let's dig in.",
  "Happy to walk through this.",
  "Good one to ask about — here's the gist.",
  "Let's break that down."
];

const GENERIC_EXPLANATION_TEMPLATES = [
  (topic) => `${topic} is a concept you'll run into often — at a high level, it's about understanding the underlying rules or structure well enough to predict how it behaves, then building on that with practice. Start with the basics, try small examples yourself, and layer on complexity once those feel solid.`,
  (topic) => `Think of ${topic} in three layers: the core idea (what problem it solves), the mechanics (how you actually use it day to day), and the gotchas (the mistakes almost everyone makes early on). Nailing the first layer makes the other two much easier to pick up.`,
  (topic) => `${topic} tends to click once you've built something small with it rather than just reading about it. I'd suggest finding the smallest possible example, getting it working, then intentionally breaking it to see how it responds — that's usually the fastest path to real understanding.`
];

function mockChat(prompt) {
  const topic = findTopic(prompt);
  const opener = pick(CHAT_OPENERS);

  let body;
  if (topic) {
    const explanation = pick(topic.explanations);
    const points = pickN(topic.keyPoints, 4);
    body = `${explanation}\n\nA few key things to remember about ${topic.label}:\n${points.map((p) => `- ${p}`).join('\n')}`;
  } else {
    const label = guessTopicLabel(prompt);
    body = pick(GENERIC_EXPLANATION_TEMPLATES)(label);
  }

  return `[MOCK MODE] ${opener}\n\n${body}`;
}

// ----------------------------------------------------------------------------
// QUIZ — two schemas, auto-detected (see header comment)
// ----------------------------------------------------------------------------
const QUESTION_STEMS = [
  (t) => `Which of the following best describes ${t}?`,
  (t) => `What is a key characteristic of ${t}?`,
  (t) => `Why is ${t} commonly used in modern development?`,
  (t) => `Which statement about ${t} is TRUE?`,
  (t) => `What problem does ${t} primarily help solve?`,
  (t) => `Which of these is a common mistake when working with ${t}?`,
  (t) => `How does ${t} typically fit into a larger application?`,
  (t) => `What would you expect to happen if you misused ${t}?`,
  (t) => `Which best practice is most associated with ${t}?`,
  (t) => `What's a good next step after learning the basics of ${t}?`
];

const WRONG_OPTION_POOL = [
  'An unrelated networking protocol',
  'A deprecated browser-only API',
  'A purely visual design guideline with no code involved',
  'A type of database index',
  'A hardware requirement with no software component',
  'A licensing term used in open-source projects',
  'A build tool unrelated to this concept',
  'A CSS-only feature with no JavaScript equivalent'
];

function buildQuestionPool(topicLabel, topicData) {
  const correctFacts = topicData
    ? topicData.keyPoints
    : [
        `${topicLabel} is best learned by combining short explanations with hands-on practice`,
        `${topicLabel} has a set of core concepts worth mastering before moving to advanced use`,
        `${topicLabel} is commonly used alongside other tools in a typical development workflow`,
        `${topicLabel} rewards consistent, incremental practice over cramming`,
        `${topicLabel} has common beginner mistakes that are worth learning to recognize early`
      ];

  return QUESTION_STEMS.map((stemFn, i) => {
    const correct = correctFacts[i % correctFacts.length];
    const wrongs = pickN(WRONG_OPTION_POOL, 3);
    return {
      question: `[MOCK] ${stemFn(topicLabel)}`,
      correct,
      wrongs,
      explanation: `${correct}. (Placeholder explanation generated by AI Mock Mode — enable real Anthropic API credits for a genuine explanation.)`
    };
  });
}

// Schema 1: chatbotController "Quiz me" quick action — correctIndex-based, 5 Qs.
function mockQuizCorrectIndex(prompt) {
  const topicLabel = guessTopicLabel(prompt);
  const topicData = findTopic(prompt);
  const pool = pickN(buildQuestionPool(topicLabel, topicData), 5);

  const questions = pool.map((q) => {
    const options = pickN([q.correct, ...q.wrongs], 4);
    const correctIndex = options.indexOf(q.correct);
    return {
      question: q.question,
      options,
      correctIndex,
      explanation: q.explanation
    };
  });

  return JSON.stringify({ questions });
}

// Schema 2: aiQuizService course-quiz generator — correctAnswer-string-based,
// 10-20 Qs, each tagged with difficulty. Needs >= MIN_QUESTIONS(10) or the
// caller rejects the quiz, so we generate 12 by cycling/varying the stem pool.
function mockQuizCorrectAnswer(prompt) {
  const topicLabel = guessTopicLabel(prompt);
  const topicData = findTopic(prompt);
  const basePool = buildQuestionPool(topicLabel, topicData);
  const target = 12;
  const difficulties = ['easy', 'medium', 'hard'];

  const questions = Array.from({ length: target }, (_, i) => {
    const q = basePool[i % basePool.length];
    const options = pickN([q.correct, ...q.wrongs], 4);
    return {
      question: i < basePool.length ? q.question : `${q.question} (variant ${Math.floor(i / basePool.length) + 1})`,
      options,
      correctAnswer: q.correct,
      explanation: q.explanation,
      difficulty: difficulties[i % difficulties.length]
    };
  });

  return JSON.stringify({ questions });
}

function mockQuiz(prompt) {
  if (/correctAnswer/.test(prompt) && /difficulty/.test(prompt)) {
    return mockQuizCorrectAnswer(prompt);
  }
  return mockQuizCorrectIndex(prompt);
}

// ----------------------------------------------------------------------------
// FLASHCARDS
// ----------------------------------------------------------------------------
const FLASHCARD_FRONT_TEMPLATES = [
  (t) => `Core idea behind ${t}`,
  (t) => `Common beginner mistake in ${t}`,
  (t) => `Best practice for ${t}`,
  (t) => `Key term related to ${t}`,
  (t) => `How ${t} fits into a real project`,
  (t) => `A quick way to practice ${t}`,
  (t) => `Why ${t} matters`,
  (t) => `Good next step after learning ${t}`
];

function mockFlashcards(prompt) {
  const topicLabel = guessTopicLabel(prompt);
  const topicData = findTopic(prompt);
  const points = topicData ? pickN(topicData.keyPoints, 8) : [];

  const cards = FLASHCARD_FRONT_TEMPLATES.map((frontFn, i) => ({
    front: `[MOCK] ${frontFn(topicLabel)}`,
    back: points[i]
      ? `${points[i]}. (Placeholder — AI Mock Mode is on.)`
      : `Placeholder explanation for "${frontFn(topicLabel)}" generated by AI Mock Mode — enable real Anthropic API credits for a genuine answer here.`
  }));

  return JSON.stringify({ cards });
}

// ----------------------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------------------
function mockSummary(prompt) {
  const topicLabel = guessTopicLabel(prompt);
  const topicData = findTopic(prompt);

  const intro = topicData
    ? pick(topicData.explanations)
    : pick(GENERIC_EXPLANATION_TEMPLATES)(topicLabel);

  const points = topicData
    ? pickN(topicData.keyPoints, 4)
    : [
        `${topicLabel} is easiest to learn through short, focused practice sessions`,
        `Reviewing mistakes is often more useful than reviewing successes`,
        `Building something small end-to-end beats reading passively`,
        `Revisiting the fundamentals pays off once things get more advanced`
      ];

  return `[MOCK MODE] **Summary: ${topicLabel}**\n\n${intro}\n\nKey points to remember:\n${points.map((p) => `- ${p}`).join('\n')}\n\n_(This is placeholder content generated by AI Mock Mode — set AI_MOCK_MODE=false once you have Anthropic API credits for a genuine summary.)_`;
}

// ----------------------------------------------------------------------------
// STUDY PLAN
// ----------------------------------------------------------------------------
const STUDY_DAY_FOCUSES = [
  (t) => `Get oriented with ${t} fundamentals and vocabulary`,
  (t) => `Follow a guided example using ${t} and rebuild it yourself from memory`,
  (t) => `Practice the core mechanics of ${t} with small, focused exercises`,
  (t) => `Review common mistakes in ${t} and understand why they happen`,
  (t) => `Apply ${t} to a small project or realistic scenario`,
  (t) => `Generate flashcards/quiz questions on ${t} and test yourself`,
  (t) => `Review weak spots from earlier in the week and reinforce them`
];

function mockStudyPlan(prompt) {
  const topicLabel = guessTopicLabel(prompt);
  const days = pickN(STUDY_DAY_FOCUSES, 6);

  const dayBlocks = days.map((focusFn, i) => {
    const objective = focusFn(topicLabel);
    return `Day ${i + 1}\nObjective: ${objective}\n- Spend 20-30 focused minutes on this before moving on\n- Write down anything confusing to revisit later\n- End with a 2-3 sentence recap in your own words`;
  });

  return `[MOCK MODE] **Study Plan: ${topicLabel}**\n\n${dayBlocks.join('\n\n')}\n\n_(Placeholder plan generated by AI Mock Mode — enable real Anthropic API credits for a plan personalized to your actual progress and pace.)_`;
}

// ----------------------------------------------------------------------------
// HINT
// ----------------------------------------------------------------------------
const HINT_TEMPLATES = [
  'Re-read the exact wording of the error — it usually names the specific variable, type, or line involved. Check that against what you actually passed in right before it.',
  "Try isolating the smallest piece of code that still reproduces the problem. Once it's small enough, the cause is usually obvious.",
  'Check your assumptions one at a time: is the data the shape you think it is? Is this code even running when you expect it to? Add a quick log to confirm.',
  'Walk through the logic one step at a time as if you were the computer — where does what actually happens first diverge from what you expected?',
  "Compare this to the last time something similar worked correctly — what's different between the two?"
];

function mockHint(prompt) {
  const hasError = /error:/i.test(prompt);
  const hasCode = /```/.test(prompt);
  const base = pick(HINT_TEMPLATES);
  const extra = hasError
    ? ' Pay close attention to the error message itself — it\'s usually more specific than it first seems.'
    : hasCode
      ? ' Trace through your code line by line with a concrete example input.'
      : '';

  return `[MOCK MODE] Hint: ${base}${extra}\n\n_(This is a placeholder hint from AI Mock Mode, not the full answer — enable real Anthropic API credits for a genuine, context-aware hint.)_`;
}

// ----------------------------------------------------------------------------
// Dispatch — inspects the prompt to figure out which feature is calling in,
// logs which one per the required format, then returns the matching mock.
// ----------------------------------------------------------------------------
export async function mockClaude(prompt) {
  const text = String(prompt || '');
  let kind;
  let result;

  if (/"cards":\[/.test(text) || /flashcards? \(term\/concept/i.test(text)) {
    kind = 'Flashcards Request';
    result = mockFlashcards(text);
  } else if (/"questions":\[/.test(text) || /multiple-choice quiz/i.test(text) || /assessment generator/i.test(text)) {
    kind = 'Quiz Request';
    result = mockQuiz(text);
  } else if (/week-by-week study plan/i.test(text)) {
    kind = 'Study Plan Request';
    result = mockStudyPlan(text);
  } else if (/ONE pointed hint/i.test(text) || /I'm stuck/i.test(text)) {
    kind = 'Hint Request';
    result = mockHint(text);
  } else if (/concise bullet points a learner could skim/i.test(text) || /^Summarize/i.test(text.trim())) {
    kind = 'Summary Request';
    result = mockSummary(text);
  } else {
    kind = 'Chat Request';
    result = mockChat(text);
  }

  console.log(`[MOCK AI]\n${kind}`);

  // Small artificial delay so loading states in the UI get exercised, same
  // as a real network call would.
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 400));

  return result;
}
