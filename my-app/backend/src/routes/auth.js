// src/routes/auth.js
import { Router } from 'express';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminPool from '../models/AdminPool.js';

const router = Router();

/** POST /auth/login */
router.post('/login', async (req, res) => {
  try {
    const { presetLogin, password } = req.body || {};
    if (!presetLogin || !password) {
      return res.status(400).json({ error: 'presetLogin and password required' });
    }

    const admin = await AdminPool.findOne({ presetLogin }).lean();
    if (!admin) return res.status(400).json({ error: 'Invalid login' });

    const ok = await bcrypt.compare(password, admin.presetPasswordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid login' });

    // ✅ JWT 발급
    const payload = { sub: admin._id.toString(), role: 'admin', pl: admin.presetLogin };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return res.json({ accessToken: token, expiresIn: 3600 });
  } catch (err) {
    console.error('[LOGIN] error:', err);
    return res.status(500).json({ error: 'internal' });
  }
});

/** GET /auth/me (토큰 확인용) */
router.get('/me', (req, res) => {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ ok: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
});

export default router;

