import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
  // 예: '2025년 하반기 신입 부원 모집'
  title: {
    type: String,
    required: [true, '모집 공고 제목은 필수입니다.'],
    unique: true,
    trim: true,
  },
  // 모집 공고를 사용자에게 노출할지 여부
  isPublic: {
    type: Boolean,
    default: true,
  },
  // 모집 분야 배열. 예: ['프론트엔드', '백엔드', '디자인']
  fields: [
    {
      type: String,
      trim: true,
    },
  ],
  startDate: {
    type: Date,
    required: [true, '모집 시작일은 필수입니다.'],
  },
  endDate: {
    type: Date,
    required: [true, '모집 종료일은 필수입니다.'],
  },
}, {
  // createdAt, updatedAt 자동 생성
  timestamps: true,
});

// 가상 필드를 추가하여 모집 진행 여부를 쉽게 확인할 수 있습니다.
positionSchema.virtual('isOpen').get(function() {
  const now = new Date();
  return this.startDate <= now && now <= this.endDate;
});

const Position = mongoose.model('Position', positionSchema);

export default Position;