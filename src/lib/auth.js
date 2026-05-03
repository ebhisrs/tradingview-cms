import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'tradingview-cms-secret-key-change-in-production';

// Default admin credentials - change in production
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS_HASH = bcrypt.hashSync(process.env.ADMIN_PASS || 'admin123', 10);

export function verifyCredentials(username, password) {
  if (username !== ADMIN_USER) return false;
  return bcrypt.compareSync(password, ADMIN_PASS_HASH);
}

export function createToken(username) {
  return jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
