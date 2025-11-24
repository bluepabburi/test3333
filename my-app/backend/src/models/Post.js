import mongoose from 'mongoose';

const standardOptions = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '게시글 제목은 필수입니다.'],
    trim: true,
  },
  
  content: {
    type: String,
    required: [true, '게시글 내용은 필수입니다.'],
  },
  
  // 'User' 모델과의 관계 설정 (표준화된 관계 정의)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 1번에서 만든 'User' 모델을 참조
    required: true,
  },
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'], // '임시저장', '발행됨', '보관됨' 상태 관리
    default: 'draft',
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  
  viewCount: {
    type: Number,
    default: 0,
  },

}, standardOptions); // 표준화된 옵션 적용

const Post = mongoose.model('Post', postSchema);

export default Post;