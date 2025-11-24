import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../src/models/Admin.js';
import { hashPassword } from '../src/utils/hash.js';

// --- 여기에 생성하고 싶은 관리자 계정 정보를 입력하세요 ---
const ADMIN_ACCOUNTS = [
  {
    email: 'qwe',
    name: '총관리자',
    password: '123',
    role: 'super-admin', // 실제로는 더 복잡한 비밀번호를 사용하세요
  },
  // 필요하다면 다른 관리자 계정을 추가할 수 있습니다.
  // {
  //   email: 'manager@example.com',
  //   name: '매니저',
  //   password: 'password456',
  // },
];
// ----------------------------------------------------

async function seedAdmins() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in .env file');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ MongoDB connected');

  for (const account of ADMIN_ACCOUNTS) {
    const { email, name, password } = account;
    
    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);

    // email을 기준으로 계정이 있으면 업데이트, 없으면 생성 (upsert)
        await Admin.findOneAndUpdate(
            { email },
            { name, passwordHash, role: account.role || 'admin'  },
            { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✔️ Upserted admin: ${email}`);
  }

  console.log('🌱 Admin seeding done!');
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

seedAdmins().catch((err) => {
  console.error('🔴 Seeding failed:', err);
  process.exit(1);
});