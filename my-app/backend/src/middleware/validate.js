import { z } from 'zod';

// z.ZodError가 발생하면, 에러를 가공하여 400 Bad Request 응답을 보냅니다.
// 성공하면 다음 미들웨어로 넘어갑니다.
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid input',
        details: e.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    // 그 외의 에러는 일반적인 500 에러로 처리
    res.status(500).json({ message: 'Internal server error' });
  }
};