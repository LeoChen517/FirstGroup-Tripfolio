import pool from '../models/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) {
        return res.status(400).json({ message: '請輸入 Email 與密碼'})
    }

    try {
        const result = await pool.query('SELECT * FEOM user WHERE email = $1', [email])
        const user = result.row[0]

        if(!user) {
            return res.status(401).json({ message: '無此帳號' })
        }

        const match = await bcrypt.compare(password, user.password)
        if(match) {
            return res.status(401).json({ message: '密碼錯誤' })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRE })
        res.json({ token })
    } catch (err) {
        res.status(500).json({ message: '伺服器錯誤' })
    }
}