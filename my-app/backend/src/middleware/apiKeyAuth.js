// 외부 프로그램이 유효한 API 키를 가지고 있는지 확인하는 미들웨어
export const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  // API 키가 없거나, .env에 저장된 키와 일치하지 않으면 401 Unauthorized 에러 반환
  if (!apiKey || apiKey !== process.env.POWER_QUERY_API_KEY) {
    return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }

  // 인증 성공 시 다음 미들웨어 또는 라우트 핸들러로 이동
  next();
};