// AI-driven skill recommendation engine.
//
// This runs entirely client-side today, scoring a skills catalog against a
// member's profile/interests/wishlist/learning history and producing a
// ranked list with a human-readable "why" for each pick — the same shape a
// POST /api/recommendations backend (wrapping an LLM call, e.g. Claude)
// would return. Swapping the body of `getAIRecommendations` for a real
// `fetch('/api/recommendations', ...)` call later is mechanical: the
// function signature and return shape stay the same.
//
// NOTE: this is a plain utility function, not a component/hook, so it can't
// call useSkills()/useCategories() itself — callers fetch the catalog via
// those hooks and pass it in here as `catalog`.

function tagOverlap(tagsA = [], tagsB = []) {
  const setB = new Set(tagsB.map(t => t.toLowerCase()));
  return tagsA.filter(t => setB.has(t.toLowerCase())).length;
}

// A light "complementary skill" graph — what naturally pairs with what.
// Stands in for the kind of association an LLM would infer on the fly.
const COMPLEMENTS = {
  'React': ['Node.js', 'TypeScript', 'UI Design'],
  'Node.js': ['React', 'MongoDB', 'System Design'],
  'Figma': ['UI Design', 'Prototyping', 'Design Systems'],
  'SEO': ['Google Ads', 'Analytics', 'Growth Strategy'],
  'Python': ['Data Analysis', 'Machine Learning'],
  'JavaScript': ['React', 'TypeScript']
};

function complementScore(myTags = [], candidateTags = []) {
  let score = 0;
  for (const tag of myTags) {
    const pairs = COMPLEMENTS[tag] || [];
    for (const c of candidateTags) {
      if (pairs.some(p => p.toLowerCase() === c.toLowerCase())) score += 1;
    }
  }
  return score;
}

/**
 * @param {object} user - shape: { profile, enrolled, wishlist }
 * @param {object} opts - { limit }
 * @param {object} catalog - { skills, categories } from useSkills()/useCategories()
 * @returns {Array<{ skill, score, reasons: string[] }>}
 */
export function getAIRecommendations(user, { limit = 6 } = {}, catalog = {}) {
  const { skills = [], categories = [] } = catalog;
  if (!skills.length) return [];
  const { profile = {}, enrolled = [], wishlist = [] } = user;
  const interestKeys = profile.interests || [];
  const wantedTags = profile.skillsWanted || [];
  const enrolledIds = new Set(enrolled.map(e => e.skillId));
  const wishlistIds = new Set(wishlist);

  const enrolledSkills = enrolled
    .map(e => skills.find(s => s.id === e.skillId))
    .filter(Boolean);
  const myTags = enrolledSkills.flatMap(s => s.tags);

  const candidates = skills.filter(s => !enrolledIds.has(s.id));

  const scored = candidates.map(skill => {
    let score = 0;
    const reasons = [];

    if (interestKeys.includes(skill.category)) {
      score += 3;
      const cat = categories.find(c => c.key === skill.category);
      reasons.push(`Matches your stated interest in ${cat ? cat.label : skill.category}`);
    }

    const wantOverlap = tagOverlap(skill.tags, wantedTags);
    if (wantOverlap > 0) {
      score += wantOverlap * 2;
      reasons.push(`Covers "${skill.tags.find(t => wantedTags.some(w => w.toLowerCase() === t.toLowerCase()))}", which you listed as a skill you want to learn`);
    }

    const complement = complementScore(myTags, skill.tags);
    if (complement > 0) {
      const base = enrolledSkills.find(s => (COMPLEMENTS[s.tags.find(t => COMPLEMENTS[t]) || ''] || []).some(c => skill.tags.includes(c)));
      score += complement * 1.5;
      reasons.push(base ? `Pairs naturally with ${base.title}, which you're already learning` : `Complements skills you're already building`);
    }

    if (wishlistIds.has(skill.id)) {
      score += 2;
      reasons.push('Already on your wishlist');
    }

    // Popularity / quality signal — an LLM would weigh this as social proof.
    score += (skill.rating - 4) * 2;
    if (skill.rating >= 4.8) reasons.push(`Highly rated (★ ${skill.rating}) by ${skill.students.toLocaleString()} learners`);

    if (reasons.length === 0) {
      reasons.push('A well-rounded pick based on what learners with a similar profile explore next');
    }

    return { skill, score, reasons: reasons.slice(0, 2) };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
