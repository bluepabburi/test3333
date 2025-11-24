import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '이름은 필수입니다.'],
    trim: true,
  },
  // 예: '회장', '개발팀장' 등
  role: {
    type: String,
    required: [true, '역할은 필수입니다.'],
    trim: true,
  },
  // 프로필 사진 이미지 URL
  imageUrl: {
    type: String,
    trim: true,
  },
  // 간단한 자기소개
  bio: {
    type: String,
    default: '',
  },
  // 웹페이지에 표시될 순서 (숫자가 낮을수록 먼저 보임)
  displayOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Member = mongoose.model('Member', memberSchema);

export default Member;