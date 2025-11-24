import { Router } from 'express';
import ClubInfo from '../models/ClubInfo.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// -----------------------------------------
//   방문자용 및 관리자용 API
// -----------------------------------------

// ✅ GET /club-info - 동아리 소개 정보 조회
router.get('/', async (req, res) => {
    try {
        // 항상 고정된 'main-info' 문서를 찾거나, 없으면 생성해서 반환
        const info = await ClubInfo.findOneAndUpdate(
            { identifier: 'main-info' },
            { $setOnInsert: { identifier: 'main-info' } }, // 없으면 identifier 필드와 함께 생성
            { upsert: true, new: true } // upsert: 없으면 생성, new: 업데이트/생성된 문서를 반환
        ).lean();
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ message: '정보 조회 중 오류 발생' });
    }
});

// ✅ PATCH /club-info/admin - 동아리 소개 정보 수정
router.patch('/admin', requireAdmin, async (req, res) => {
    try {
        const updatedData = req.body;
        const info = await ClubInfo.findOneAndUpdate(
            { identifier: 'main-info' },
            updatedData,
            { new: true, upsert: true }
        );
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ message: '정보 수정 중 오류 발생' });
    }
});

export default router;