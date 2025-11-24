import { Router } from 'express';
import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';

const router = Router();

// ✅ POST /user-auth/register - 회원가입
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).json({ message: '이메일, 사용자명, 비밀번호는 필수입니다.' });
        }

        // 이메일 또는 사용자명 중복 확인
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: '이미 사용 중인 이메일 또는 사용자명입니다.' });
        }

        const passwordHash = await hashPassword(password);
        const newUser = new User({ email, username, passwordHash });
        await newUser.save();

        res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
    }
});

// ✅ POST /user-auth/login - 로그인
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        const payload = { sub: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });

        res.status(200).json({ token, user: { _id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
});

export default router;