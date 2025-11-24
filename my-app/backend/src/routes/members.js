import { Router } from 'express';
import Member from '../models/Member.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// -----------------------------------------
//   방문자용 API (Public)
// -----------------------------------------

// ✅ GET /members - 모든 임원 목록 조회
router.get('/', async (req, res) => {
    try {
        // displayOrder를 기준으로 오름차순 정렬하여 반환
        const members = await Member.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: '임원 목록 조회 중 오류 발생' });
    }
});

// -----------------------------------------
//   관리자용 API (Admin)
// -----------------------------------------

// ✅ POST /members/admin - 새로운 임원 추가
router.post('/admin', requireAdmin, async (req, res) => {
    try {
        const { name, role, imageUrl, bio, displayOrder } = req.body;
        if (!name || !role) {
            return res.status(400).json({ message: '이름과 역할은 필수입니다.' });
        }
        const newMember = new Member({ name, role, imageUrl, bio, displayOrder });
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: '임원 추가 중 오류 발생' });
    }
});

// ✅ PATCH /members/admin/:id - 임원 정보 수정
router.patch('/admin/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const member = await Member.findByIdAndUpdate(id, updatedData, { new: true });
        if (!member) {
            return res.status(404).json({ message: '해당 임원을 찾을 수 없습니다.' });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: '임원 정보 수정 중 오류 발생' });
    }
});

// ✅ DELETE /members/admin/:id - 임원 삭제
router.delete('/admin/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findByIdAndDelete(id);
        if (!member) {
            return res.status(404).json({ message: '해당 임원을 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '임원 정보가 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '임원 정보 삭제 중 오류 발생' });
    }
});

export default router;