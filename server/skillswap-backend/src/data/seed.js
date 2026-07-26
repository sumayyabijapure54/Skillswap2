// Usage:
//   npm run seed            → clears and reloads the `skills` collection
//   npm run seed:destroy    → just deletes all skills, no reload
import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Skill from '../models/Skill.js';
import { skills } from './skillsSeedData.js';
import mongoose from 'mongoose';

const destroyOnly = process.argv.includes('--destroy');

async function run() {
  await connectDB();

  await Skill.deleteMany({});
  console.log('Cleared existing skills.');

  if (!destroyOnly) {
    await Skill.insertMany(skills);
    console.log(`Seeded ${skills.length} skills.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
