import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// 加密密碼
export async function hashPassword(plainPassword) {
    const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashed;
}

// 驗證密碼
export async function verifyPassword(plainPassword, hashedPassword) {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
}
