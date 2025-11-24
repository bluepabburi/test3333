import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // 활동을 수행한 관리자
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  // 수행한 활동 종류 (예: 'STATUS_UPDATE')
  action: {
    type: String,
    required: true,
  },
  // 활동의 대상이 된 리소스 타입 (예: 'Recruit')
  resourceType: {
    type: String,
    required: true,
  },
  // 대상 리소스의 고유 ID
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // 변경 전/후 데이터 등 상세 내용
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  // 활동 결과 (성공/실패)
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE'],
    default: 'SUCCESS'
  },
}, {
  timestamps: true,
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;