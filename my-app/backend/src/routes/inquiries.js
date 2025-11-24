import { Router } from 'express';
import Complaint from '../models/Complaint.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// ✅ POST /inquiries - 방문자가 새로운 문의 제출
router.post('/', async (req, res) => {
    try {
        const { email, tag, subject, message } = req.body;
        if (!email || !tag || !subject || !message) {
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        }
        const newInquiry = new Complaint({ email, tag, subject, message });
        await newInquiry.save();
        res.status(201).json({ message: '문의가 성공적으로 접수되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '문의 접수 중 오류가 발생했습니다.' });
    }
});

// ✅ GET /inquiries/admin - 관리자가 모든 문의 목록 조회
router.get('/admin', requireAdmin, async (req, res) => {
    try {
        const inquiries = await Complaint.find().sort({ createdAt: -1 }).lean();
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ message: '문의 목록 조회 중 오류가 발생했습니다.' });
    }
});

// ✅ PATCH /inquiries/admin/:id - 관리자가 문의 상태 변경
router.patch('/admin/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const inquiry = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
        if (!inquiry) {
            return res.status(404).json({ message: '해당 문의를 찾을 수 없습니다.' });
        }
        res.status(200).json(inquiry);
    } catch (error) {
        res.status(500).json({ message: '문의 상태 변경 중 오류가 발생했습니다.' });
    }
});

export default router;