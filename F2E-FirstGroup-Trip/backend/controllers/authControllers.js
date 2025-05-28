import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { hashPassword } from '../utils/hash.js';

export async function registerUser(req, res) {
    const { email, password, phone } = req.body;

  // 加密密碼
    const hashedPassword = await hashPassword(password);

  // 寫入資料庫
    await db.insert(users).values({
        email,
        password: hashedPassword,
        phone,
    });

    res.status(201).json({ message: '註冊成功' });
}
