import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  // 문의를 남긴 사람의 이름, 이메일
  tag: { type: String, required: true, enum: ['일반 문의', '시스템 문의', '지원 문의', '기타 문의']},
  email: { type: String, required: true },
  subject: { type: String, required: true }, // 문의 제목
  message: { type: String, required: true }, // 문의 내용
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved'], // '신규', '처리중', '해결됨'
    default: 'new',
  },
}, {
  timestamps: true,
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;