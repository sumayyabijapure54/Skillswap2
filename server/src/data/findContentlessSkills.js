// One-off audit for courses published before the create/update content
// guard existed (see skillsController.createSkill/updateSkill) — finds any
// Skill with no lessons at all, so a mentor/admin can go fix each one
// manually. Never invents lessons or a quiz for them.
//
// Usage:
//   cd server && node src/data/findContentlessSkills.js
//
// Requires the same MONGODB_URI / .env your server already uses.

import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Skill from '../models/Skill.js';

async function main() {
  await connectDB();

  const offenders = await Skill.find({
    $or: [{ lessons: { $size: 0 } }, { lessons: { $exists: false } }]
  })
    .select('id title mentor.name mentorUser createdAt updatedAt')
    .lean();

  if (offenders.length === 0) {
    console.log('No content-less skills found — nothing to fix.');
  } else {
    console.log(`Found ${offenders.length} skill(s) with no lessons:\n`);
    for (const s of offenders) {
      console.log(`- id: ${s.id}`);
      console.log(`  title: ${s.title}`);
      console.log(`  mentor: ${s.mentor?.name || '(unknown)'}  mentorUser: ${s.mentorUser || '(none — seeded/unclaimed)'}`);
      console.log(`  createdAt: ${s.createdAt}  updatedAt: ${s.updatedAt}`);
      console.log('');
    }
    console.log('Each of these needs a mentor to add at least one video lesson via Edit Course before its quiz will work.');
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
