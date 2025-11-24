// scripts/seed-pool.js
import 'dotenv/config';
import mongoose from 'mongoose';

import AdminPool from '../src/models/AdminPool.js';     // ← 중요: 상대경로/확장자
import { hashPassword } from '../src/utils/hash.js';   // ← 중요: 상대경로/확장자

const MONGODB_URI = process.env.MONGODB_URI;

const PRESET_ACCOUNTS = [
  { presetLogin: 'adminA@club.com', presetPassword: 'Fixed#A1234' },
  { presetLogin: 'adminB@club.com', presetPassword: 'Fixed#B1234' },
  { presetLogin: 'adminC@club.com', presetPassword: 'Fixed#C1234' },
];

async function main() {
  console.log('[BOOT FILE]', import.meta.url);
  console.log('[CWD]', process.cwd());

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
  }

  console.log('⏳ Connecting MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ MongoDB connected');

  for (const { presetLogin, presetPassword } of PRESET_ACCOUNTS) {
    const presetPasswordHash = await hashPassword(presetPassword);
    await AdminPool.findOneAndUpdate(
      { presetLogin },
      { presetLogin, presetPasswordHash },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✔ upserted:', presetLogin);
  }

  console.log('🎉 Seed done');
}

main()
  .catch((e) => {
    console.error('💥 Seed failed:', e?.message || e);
    process.exitCode = 1;
  })
  .finally(async () => {
    try { await mongoose.disconnect(); console.log('🔌 MongoDB disconnected'); } catch {}
  });
