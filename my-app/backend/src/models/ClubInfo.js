import mongoose from 'mongoose';

const clubInfoSchema = new mongoose.Schema({
  // 동아리를 대표하는 고유한 ID, 'main'과 같이 하나만 사용
  identifier: {
    type: String,
    required: true,
    unique: true,
    default: 'main-info',
  },
  introduction: {
    type: String,
    default: '동아리 소개글을 입력해주세요.',
  },
  history: {
    type: String,
    default: '동아리 연혁을 입력해주세요.',
  },
  // 활동 사진 URL들을 배열로 저장
  activityImages: [
    {
      type: String,
      trim: true,
    },
  ],
}, {
  timestamps: true,
});

const ClubInfo = mongoose.model('ClubInfo', clubInfoSchema);

export default ClubInfo;