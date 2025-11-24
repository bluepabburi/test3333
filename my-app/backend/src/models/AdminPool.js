// src/models/AdminPool.js
import mongoose from 'mongoose';

const AdminPoolSchema = new mongoose.Schema({
  presetLogin: { type: String, unique: true, required: true },
  presetPasswordHash: { type: String, required: true },
}, { timestamps: true });

// 세 번째 인자로 컬렉션 명 고정(선택)
export default mongoose.model('AdminPool', AdminPoolSchema, 'adminpools');
