import jwt from 'jsonwebtoken';

// JWT 토큰을 발급하는 함수
export function signAdminJWT(adminDoc) {
  const payload = {
    sub: String(adminDoc._id),
    email: adminDoc.email,
    role: adminDoc.role, // DB에 저장된 실제 role 사용
  };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  return jwt.sign(payload, secret, { expiresIn });
}

// 일반 사용자 로그인이 필요한 경우 사용하는 미들웨어
export const requireUser = (req, res, next) => {
    // verifyJWT 함수를 실행해서 토큰 유효성을 검사합니다.
    // 성공하면 req.user에 사용자 정보가 담기고 next()가 호출됩니다.
    verifyJWT(req, res, next);
};

// 요청 헤더의 토큰을 검증하고 req.user에 payload를 추가하는 함수
export function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: '유효하지 않거나 만료된 토큰입니다.' });
  }
}

// ✅ '관리자'인지 확인하는 미들웨어
export const requireAdmin = (req, res, next) => {
    // 먼저 verifyJWT를 실행해서 req.user가 설정되도록 함
    verifyJWT(req, res, () => {
        const userRole = req.user?.role;
        // role이 'admin' 또는 'super-admin'인지 확인
        if (userRole === 'admin' || userRole === 'super-admin') {
            next(); // 관리자 맞으면 다음 단계로
        } else {
            // 관리자가 아니면 403 에러 응답
            res.status(403).json({
                error: {
                    code: 'FORBIDDEN',
                    message: 'Admin only'
                }
            });
        }
    });
};


// 특정 역할을 가진 관리자만 허용하는 미들웨어
export const requireRole = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    next();
};

// ... (기타 함수들)