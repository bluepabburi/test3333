import mongoose from 'mongoose';

// 표준화된 스키마 옵션
const standardOptions = {
  timestamps: true, // createdAt, updatedAt 자동 생성
  toJSON: { virtuals: true }, // JSON 변환 시 가상 필드 포함
  toObject: { virtuals: true },
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true, // 중복 방지
    trim: true, // 앞뒤 공백 자동 제거
    lowercase: true, // 소문자로 자동 변환
    match: [/.+\@.+\..+/, '올바른 이메일 형식을 입력해주세요.'], // 이메일 형식 검증
  },
  
  username: {
    type: String,
    required: [true, '사용자명은 필수입니다.'],
    unique: true,
    trim: true,
  },
  
  passwordHash: {
    type: String,
    required: [true, '비밀번호는 필수입니다.'],
    select: false, // 기본적으로 조회 시 이 필드를 제외함 (보안 때문에)
  },
  
  role: {
    type: String,
    enum: ['user', 'admin'], // 사용자와 관리자 역할 구분
    default: 'user',
  },

  isActive: {
    type: Boolean,
    default: true, // 계정 활성화 여부 (탈퇴 시 false로 변경)
  },

}, standardOptions); // 표준화된 옵션 적용

const User = mongoose.model('User', userSchema);

export default User;