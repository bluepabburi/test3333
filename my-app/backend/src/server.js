// src/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';


// Swagger
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js'; // :contentReference[oaicite:12]{index=12}

// Routers
import publicRouter from './routes/public.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';     // :contentReference[oaicite:13]{index=13}
import exportRouter from './routes/export.js'; // ⭐️ Export 라우터 가져오기
import projectRouter from './routes/projects.js'; // 👈 프로젝트 라우터 가져오기
import clubInfoRouter from './routes/clubInfo.js'; // 👈 동아리 정보 라우터 가져오기
import memberRouter from './routes/members.js';
import userAuthRouter from './routes/userAuth.js'; // 👈 사용자 인증 라우터 가져오기
import postRouter from './routes/posts.js'; // 👈 게시판 라우터 가져오기
import inquiryRouter from './routes/inquiries.js';



const app = express();

// 👇 업로드된 파일에 접근할 수 있도록 static 미들웨어를 추가합니다.
// 예: http://localhost:4000/uploads/filename.pdf 로 접근 가능
app.use('/uploads', express.static('uploads'));

/** CORS */
//const allowOrigin = process.env.ALLOW_ORIGIN || '*';
//app.use(cors({ origin: allowOrigin, credentials: true }));
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:4000',
  'http://localhost:4001' // 👈 프론트엔드의 새 주소 추가
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


//app.use(cors(corsOptions));

/** Body parser */
app.use(express.json());

/** Health (중복 가능하지만 /public/health 가 있다면 여긴 선택) */
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

/** Swagger UI */
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // :contentReference[oaicite:14]{index=14}

/** Routes */
app.use('/public', publicRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter); // 토큰/권한은 라우트 내부에서 처리 (requireAdmin 등)
app.use('/export', exportRouter); // ⭐️ '/export' 경로에 새 라우터 연결
app.use('/projects', projectRouter); // 👈 '/projects' 경로에 새 라우터 연결
app.use('/club-info', clubInfoRouter); // 👈 '/club-info' 경로에 새 라우터 연결
app.use('/members', memberRouter); // 👈 '/members' 경로에 새 라우터 연결
app.use('/user-auth', userAuthRouter); // 👈 '/user-auth' 경로에 새 라우터 연결
app.use('/posts', postRouter); // 👈 '/posts' 경로에 새 라우터 연결
app.use('/inquiries', inquiryRouter); // 👈 '/inquiries' 경로에 새 라우터 연결


/** Boot */
(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');
    await connectDB(uri);
    const port = Number(process.env.PORT) || 4000;
    app.listen(port, () => console.log(`✅ Server on http://localhost:${port}`));
  } catch (e) {
    console.error('[Fatal] Boot failed:', e);
    process.exit(1);
  }
})();