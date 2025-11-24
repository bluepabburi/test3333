import { z } from 'zod';

export const createAdminSchema = z.object({
  body: z.object({
    email: z.string({ required_error: '이메일은 필수입니다.' }).email('올바른 이메일 형식이 아닙니다.'),
    name: z.string({ required_error: '이름은 필수입니다.' }).min(2, '이름은 2자 이상이어야 합니다.'),
    password: z.string({ required_error: '비밀번호는 필수입니다.' }).min(6, '비밀번호는 6자 이상이어야 합니다.'),
    role: z.enum(['super-admin', 'admin']).optional(), // role은 선택 사항
  }),
});