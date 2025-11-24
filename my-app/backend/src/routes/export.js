import { Router } from 'express';
import { requireApiKey } from '../middleware/apiKeyAuth.js'; // 1단계에서 만든 API 키 미들웨어
import Recruit from '../models/Recruit.js';

const router = Router();

// ⭐️ GET /export/recruits - 파워쿼리용 신청 데이터
router.get('/recruits', requireApiKey, async (req, res) => {
  try {
    // .lean()을 사용하면 Mongoose 문서를 순수 JSON 객체로 변환하여 성능을 최적화할 수 있습니다.
    const recruits = await Recruit.find()
      .populate('positionId', 'title') // Position의 제목도 함께 가져옵니다.
      .sort({ createdAt: -1 }) // 최신순으로 정렬
      .lean();
    
    // JSON 형태로 모든 신청자 데이터를 응답합니다.
    res.status(200).json(recruits);
  } catch (error) {
    console.error('Data export error:', error);
    res.status(500).json({ message: '데이터를 내보내는 중 오류가 발생했습니다.' });
  }
});

export default router;