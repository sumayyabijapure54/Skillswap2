// Mock platform-wide data for the admin dashboard. In a real deployment this
// would come from a backend (GET /api/admin/users, etc.) — the shapes here
// mirror what those endpoints would return so the swap is mechanical.

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const seedUsers = [
  { id: 'u-1', name: 'Alex Johnson', email: 'alex.johnson@example.com', role: 'mentor', status: 'active', joinedAt: daysAgo(210) },
  { id: 'u-2', name: 'Sarah Williams', email: 'sarah.williams@example.com', role: 'mentor', status: 'active', joinedAt: daysAgo(180) },
  { id: 'u-3', name: 'David Smith', email: 'david.smith@example.com', role: 'mentor', status: 'active', joinedAt: daysAgo(165) },
  { id: 'u-4', name: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'learner', status: 'active', joinedAt: daysAgo(90) },
  { id: 'u-5', name: 'Marcus Tran', email: 'marcus.tran@example.com', role: 'learner', status: 'active', joinedAt: daysAgo(75) },
  { id: 'u-6', name: 'Yuki Hara', email: 'yuki.hara@example.com', role: 'learner', status: 'suspended', joinedAt: daysAgo(60) },
  { id: 'u-7', name: 'Daniela Reyes', email: 'daniela.reyes@example.com', role: 'learner', status: 'active', joinedAt: daysAgo(40) },
  { id: 'u-8', name: 'Omar Farouk', email: 'omar.farouk@example.com', role: 'learner', status: 'active', joinedAt: daysAgo(21) },
  { id: 'u-9', name: 'Lena Kowalski', email: 'lena.kowalski@example.com', role: 'learner', status: 'active', joinedAt: daysAgo(9) },
  { id: 'u-10', name: 'Ben Okafor', email: 'ben.okafor@example.com', role: 'learner', status: 'active', joinedAt: daysAgo(3) }
];

export const seedMentorApplications = [
  { id: 'ma-1', name: 'Fatima Al-Sayed', skill: 'Arabic for Beginners', category: 'languages', bio: 'Native speaker and certified language tutor with 5 years of online teaching experience.', status: 'pending', submittedAt: daysAgo(4) },
  { id: 'ma-2', name: 'Tom Bradley', skill: 'Music Production in Ableton', category: 'music', bio: 'Independent producer, has released three EPs and taught production workshops locally.', status: 'pending', submittedAt: daysAgo(2) },
  { id: 'ma-3', name: 'Grace Lin', skill: 'Data Analysis with Python', category: 'programming', bio: 'Data analyst at a mid-size startup, wants to teach pandas/matplotlib fundamentals.', status: 'pending', submittedAt: daysAgo(1) }
];

export const seedReports = [
  { id: 'rp-1', type: 'message', reportedUser: 'Yuki Hara', reason: 'Repeated off-platform payment requests in chat.', status: 'open', createdAt: daysAgo(6) },
  { id: 'rp-2', type: 'skill_post', reportedUser: 'Unknown poster', reason: 'Listing appears to duplicate an existing skill with copied description.', status: 'open', createdAt: daysAgo(3) },
  { id: 'rp-3', type: 'review', reportedUser: 'Marcus Tran', reason: 'Review flagged as containing personal contact information.', status: 'resolved', createdAt: daysAgo(12) }
];
