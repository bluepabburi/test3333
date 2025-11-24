import { Router } from 'express';
import Post from '../models/Post.js';
import { requireUser } from '../middleware/auth.js';

const router = Router();

// ✅ GET /posts - 모든 게시글 목록 조회 (공개)
router.get('/', async (req, res) => {
    try {
        // status가 'published'인 게시글만 조회합니다.
        // (참고: 작성 직후엔 기본값 'draft' 상태이므로 이 목록에는 보이지 않습니다)
        const posts = await Post.find({ status: 'published' })
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: '게시글 조회 중 오류 발생' });
    }
});

// ✅ GET /posts/:id - 특정 게시글 상세 조회 (공개)
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { viewCount: 1 } },
            { new: true }
        ).populate('author', 'username').lean();

        if (!post || post.status !== 'published') {
            return res.status(404).json({ message: '게시글을 찾을 수 없거나 공개된 상태가 아닙니다.' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: '게시글 조회 중 오류 발생' });
    }
});

// ✅ POST /posts - 새로운 게시글 작성 (로그인 필요)
router.post('/', requireUser, async (req, res) => {
    try {
        // status를 요청 body에서 받을 수 있도록 추가
        const { title, content, tags, status } = req.body;
        const author = req.user.sub;

        // status 값이 없으면 모델의 기본값('draft')으로 자동 설정됩니다.
        const newPost = new Post({ title, content, tags, author, status });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: '게시글 작성 중 오류 발생' });
    }
});

// ✅ PATCH /posts/:id - 게시글 수정 (작성자 본인만)
router.patch('/:id', requireUser, async (req, res) => {
    try {
        const { title, content, tags, status } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        if (post.author.toString() !== req.user.sub) {
            return res.status(403).json({ message: '수정 권한이 없습니다.' });
        }

        // 받은 데이터만 선택적으로 업데이트
        if (title) post.title = title;
        if (content) post.content = content;
        if (tags) post.tags = tags;
        if (status) post.status = status; // status 변경 기능 추가

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: '게시글 수정 중 오류 발생' });
    }
});

// ✅ DELETE /posts/:id - 게시글 삭제 (작성자 본인만)
router.delete('/:id', requireUser, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        if (post.author.toString() !== req.user.sub) {
            return res.status(403).json({ message: '삭제 권한이 없습니다.' });
        }

        await post.deleteOne();
        res.status(200).json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '게시글 삭제 중 오류 발생' });
    }
});

export default router;