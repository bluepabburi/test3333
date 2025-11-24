import multer from 'multer';
import path from 'path';

// 파일 저장 위치와 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 파일이 저장될 폴더
  },
  filename: (req, file, cb) => {
    // 파일명 중복을 피하기 위해 현재 시간과 원본 파일명을 조합
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 파일 필터 (예: PDF 파일만 허용) - 필요에 따라 주석 해제하여 사용
/*
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('PDF 파일만 업로드할 수 있습니다.'), false);
  }
};
*/

const upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB 파일 크기 제한
  }
});

export default upload;