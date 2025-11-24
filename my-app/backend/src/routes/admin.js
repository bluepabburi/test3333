import { Router } from 'express';
import Admin from '../models/Admin.js';
import Recruit from '../models/Recruit.js';
import Position from '../models/Position.js';
import AuditLog from '../models/AuditLog.js';

import { validate } from '../middleware/validate.js'; 
import { hashPassword, comparePassword } from '../utils/hash.js';
import { createAdminSchema } from '../validators/adminValidators.js'; 
import { signAdminJWT, requireAdmin, requireRole } from '../middleware/auth.js';

const router = Router();

// -----------------------------------------
//   기존 기능 API (로그인, 지원서/공고 관리)
// -----------------------------------------

// 관리자 로그인
router.get('/admins', requireAdmin, requireRole(['super-admin']), async (req, res) => {
    const { email, password } = req.body || {};
    const admin = await Admin.findOne({ email }).select('+passwordHash');
    if (!admin) return res.status(401).json(err('AUTH', 'Invalid credentials'));
    const ok = await comparePassword(password, admin.passwordHash);
    if (!ok) return res.status(401).json(err('AUTH', 'Invalid credentials'));
    const token = signAdminJWT(admin);
    res.json({ token, admin: { _id: admin._id, email: admin.email, name: admin.name } });
});

router.get('/admins', async (req, res) => {
    try {
        const admins = await Admin.find().select('-passwordHash').lean();
        res.status(200).json(admins);
    } catch (error) {
        console.error('🔥 Get admins error:', error);
        res.status(500).json({ message: '관리자 목록 조회 중 오류 발생' });
    }
});

// 지원서 목록 조회
router.get('/recruits', requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, status, sortBy = 'createdAt', order = 'desc' } = req.query;
        const query = {};
        if (status) query.status = status;
        const sortOrder = { [sortBy]: order === 'desc' ? -1 : 1 };
        const recruits = await Recruit.find(query)
            .populate('positionId', 'title')
            .sort(sortOrder)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();
        const total = await Recruit.countDocuments(query);
        res.status(200).json({
            docs: recruits,
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('🔥 Get recruits error:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 지원서 상태 변경
router.patch('/recruits/:id/status', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const adminId = req.user.sub;
        if (!['pending', 'viewed', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: '유효하지 않은 상태 값입니다.' });
        }
        const recruit = await Recruit.findById(id);
        if (!recruit) {
            return res.status(404).json({ message: '해당 신청서를 찾을 수 없습니다.' });
        }
        const oldStatus = recruit.status;
        recruit.status = status;
        await recruit.save();
        await new AuditLog({
            actorId: adminId,
            action: 'STATUS_UPDATE',
            resourceType: 'Recruit',
            resourceId: recruit._id,
            details: { from: oldStatus, to: status, applicantName: recruit.name },
        }).save();
        res.status(200).json(recruit);
    } catch (error) {
        console.error('🔥 Status update error:', error);
        res.status(500).json({ message: '상태 변경 중 오류가 발생했습니다.' });
    }
});



// 모집 공고 생성
router.post('/positions', requireAdmin, async (req, res) => {
    try {
        // 👇 startDate, endDate를 req.body에서 추가로 받습니다.
        const { title, fields, startDate, endDate } = req.body;
        if (!title || !startDate || !endDate) {
            return res.status(400).json({ message: '제목, 시작일, 종료일은 필수입니다. ISO형식으로 지정 (ex:2025-09-10T00:00:00.000Z)' });
        }

        // 👇 new Position에 startDate, endDate를 추가합니다.
        const newPosition = new Position({ title, fields, startDate, endDate });
        await newPosition.save();
        res.status(201).json(newPosition);
    } catch (error) {
        console.error('🔥 Position creation error:', error);
        res.status(500).json({ message: '모집 공고 생성 중 오류 발생' });
    }
});

// -----------------------------------------
//   ✨ 새로 추가된 회원 관리 (Admin) API
// -----------------------------------------

// 관리자 목록 조회
router.get('/admins', requireAdmin, async (req, res) => {
    try {
        const admins = await Admin.find().select('-passwordHash').lean();
        res.status(200).json(admins);
    } catch (error) {
        console.error('🔥 Get admins error:', error);
        res.status(500).json({ message: '관리자 목록 조회 중 오류 발생' });
    }
});

// 새로운 관리자 생성

router.post('/admins', requireAdmin, requireRole(['super-admin']), validate(createAdminSchema), async (req, res) => {
    try {
        const { email, name, password, role } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
        }

        const passwordHash = await hashPassword(password);
        const newAdmin = new Admin({ email, name, passwordHash, role: role || 'admin' });
        await newAdmin.save();
        res.status(201).json({ message: '새로운 관리자가 생성되었습니다.', _id: newAdmin._id });
    } catch (error) {
        console.error('🔥 Create admin error:', error);
        res.status(500).json({ message: '관리자 생성 중 오류 발생' });
    }
});



// 관리자 정보 수정 (이름, 활성 상태)
router.patch('/admins/:id', requireAdmin, requireRole(['super-admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, isActive, role } = req.body; // role 수정 기능 추가
        const adminToUpdate = await Admin.findById(id);
        if (!adminToUpdate) {
            return res.status(404).json({ message: '해당 관리자를 찾을 수 없습니다.' });
        }
        if (name) adminToUpdate.name = name;
        if (typeof isActive === 'boolean') adminToUpdate.isActive = isActive;
        if (role) adminToUpdate.role = role; // role 수정
        await adminToUpdate.save();
        res.status(200).json({ message: '관리자 정보가 수정되었습니다.' });
    } catch (error) {
        console.error('🔥 Update admin error:', error);
        res.status(500).json({ message: '관리자 정보 수정 중 오류 발생' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    const admin = await Admin.findOne({ email }).select('+passwordHash');
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    
    const ok = await comparePassword(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signAdminJWT(admin);
    res.json({ token, admin: { _id: admin._id, email: admin.email, name: admin.name } });
});

router.get('/positions', requireAdmin, async (req, res) => {
    try {
        const positions = await Position.find().sort({ createdAt: -1 });
        res.status(200).json(positions);
    } catch (error) {
        console.error('🔥 모집 공고 조회 중 오류 발생:', error);
        res.status(500).json({ message: '모집 공고를 불러오는 중 오류가 발생했습니다.' });
    }
});




export default router;

