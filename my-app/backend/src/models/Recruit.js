import mongoose from 'mongoose';

const recruitSchema = new mongoose.Schema({
  // ⭐️ 어떤 모집 공고(Position)에 지원했는지 연결하는 필드
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position', // 'Position' 모델을 참조합니다.
    required: [true, '모집 공고 ID는 필수입니다.'],
  },
  name: {
    type: String,
    required: [true, '이름은 필수입니다.'],
  },
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
  },
  phone: {
    type: String,
    required: [true, '연락처는 필수입니다.'],
  },
  // 지원서 내용 (기존 purpose 필드를 좀 더 범용적인 이름으로 변경)
  documents: {
    type: String,
    maxlength: 2000,
  },
  filePath: {
    type: String, // 업로드된 파일의 경로 저장
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'approved', 'rejected'],
    default: 'pending',
  },
  

  // 기존 JobApplication 모델에 있던 다른 필드들도 필요하다면 여기에 추가하세요.
  // 예: studentId, portfolioUrl, comment, department
}, {
  timestamps: true,
});

const Recruit = mongoose.model('Recruit', recruitSchema);

export default Recruit;

