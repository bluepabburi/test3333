import { Router } from 'express';
import Project from '../models/Project.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// -----------------------------------------
//   방문자용 API (Public)
// -----------------------------------------

// ✅ GET /projects - 모든 프로젝트 목록 조회
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 }).lean();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: '프로젝트 조회 중 오류 발생' });
    }
});

// -----------------------------------------
//   관리자용 API (Admin)
// -----------------------------------------

// ✅ POST /projects/admin - 새로운 프로젝트 추가
router.post('/admin', requireAdmin, async (req, res) => {
    try {
        const { title, description, imageUrl, projectUrl, period } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: '제목과 설명은 필수입니다.' });
        }
        const newProject = new Project({ title, description, imageUrl, projectUrl, period });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: '프로젝트 생성 중 오류 발생' });
    }
});

// ✅ PATCH /projects/admin/:id - 프로젝트 정보 수정
router.patch('/admin/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const project = await Project.findByIdAndUpdate(id, updatedData, { new: true });
        if (!project) {
            return res.status(404).json({ message: '프로젝트를 찾을 수 없습니다.' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: '프로젝트 수정 중 오류 발생' });
    }
});

// ✅ DELETE /projects/admin/:id - 프로젝트 삭제
router.delete('/admin/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ message: '프로젝트를 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '프로젝트가 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '프로젝트 삭제 중 오류 발생' });
    }
});

export default router;