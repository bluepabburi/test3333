import { Router } from 'express';
import Recruit from '../models/Recruit.js';
import Position from '../models/Position.js';
import upload from '../middleware/upload.js'; // upload 미들웨어

const router = Router();



// ...
router.get('/health', (req, res) => {
  // 메시지를 식별 가능하도록 수정합니다.
  res.json({ message: "최신 버전의 서버가 응답했습니다." });
});
// ...



router.get('/positions', async (req, res) => {
    try {
        const now = new Date();

        // 현재 날짜가 모집 시작일과 종료일 사이에 있는 공고만 조회
        const openPositions = await Position.find({
            startDate: { $lte: now }, // 시작일이 현재보다 이전이고
            endDate: { $gte: now },   // 종료일이 현재보다 이후인
            isPublic: true,
        })
        .sort({ startDate: -1 }) // 시작일 기준 내림차순 (최신순)
        .lean();

        res.status(200).json(openPositions);
    } catch (error) {
        console.error('Error fetching open positions:', error);
        res.status(500).json({ message: '모집 공고를 불러오는 중 오류가 발생했습니다.' });
    }
});

// ✅ POST /public/recruits - 파일 업로드를 포함한 최종 지원서 제출 API
// 1. 라우터에 upload.single('portfolio')를 미들웨어로 추가합니다.
//    이제 이 API는 텍스트 데이터(form-data)와 'portfolio'라는 이름의 파일을 함께 받을 수 있습니다.
router.post('/recruits', upload.single('portfolio'), async (req, res) => {
  try {
    const { positionId, name, email, phone, documents } = req.body;

    // --- 모집 기간 확인 로직 (기존 코드와 동일) ---
    if (!positionId) {
      return res.status(400).json({ message: '모집 공고 ID가 필요합니다.' });
    }
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: '존재하지 않는 모집 공고입니다.' });
    }
    const now = new Date();
    if (now < position.startDate) {
      return res.status(400).json({ message: '아직 모집 기간이 시작되지 않았습니다.' });
    }
    if (now > position.endDate) {
      return res.status(400).json({ message: '모집 기간이 종료되었습니다.' });
    }
    // --- 로직 끝 ---

    // 필수 항목 검증
    if (!name || !email || !phone) {
      return res.status(400).json({ message: '이름, 이메일, 연락처는 필수 항목입니다.' });
    }
    
    // DB에 저장할 데이터를 담을 객체 생성
    const newRecruitData = {
      positionId,
      name,
      email,
      phone,
      documents,
    };

    // 3. 파일이 업로드된 경우, req.file 객체에서 파일 경로를 가져와 데이터에 추가합니다.
    if (req.file) {
      newRecruitData.filePath = req.file.path;
    }

    // 4. 최종 데이터를 사용해 새 지원서 문서를 생성하고 저장합니다.
    const newRecruit = new Recruit(newRecruitData);
    await newRecruit.save();

    res.status(201).json({ message: '신청이 성공적으로 접수되었습니다.', data: newRecruit });
  } catch (error) {
    console.error('Recruit submission error:', error);
    res.status(500).json({ message: '서버 오류로 인해 요청을 처리할 수 없습니다.' });
  }
});

export default router;