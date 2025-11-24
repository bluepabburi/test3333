import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '프로젝트 제목은 필수입니다.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, '프로젝트 설명은 필수입니다.'],
  },
  // 프로젝트 대표 이미지 URL
  imageUrl: {
    type: String,
    trim: true,
  },
  // Github, 웹사이트 등 관련 링크
  projectUrl: {
    type: String,
    trim: true,
  },
  // 프로젝트 진행 기간 등
  period: {
    type: String,
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;