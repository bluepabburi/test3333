// src/utils/hash.js
import bcrypt from 'bcryptjs';

export const hashPassword = (raw) => bcrypt.hash(raw, 10);
export const comparePassword = (raw, hash) => bcrypt.compare(raw, hash);
