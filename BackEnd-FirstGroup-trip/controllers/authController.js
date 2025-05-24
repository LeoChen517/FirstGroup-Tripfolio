// controllers/authController.js
const db = require("../db");
const { users } = require("../db/schema");
const { eq } = require("drizzle-orm"); // ✅ 匯入 eq
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function login(req, res) {
	const { email, password } = req.body;

	console.log("JWT_SECRET from .env:", process.env.JWT_SECRET); // ✅ 確認 .env 有正確載入

	try {
		// ✅ 用 drizzle-orm 的 eq 比對 email
		const result = await db.select().from(users).where(eq(users.email, email));

		if (result.length === 0) {
			return res.status(401).json({ message: "此帳號不存在" });
		}

		const user = result[0];

		// ✅ 比對密碼
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ message: "密碼錯誤" });
		}

		// ✅ 檢查 JWT_SECRET 是否存在
		if (!process.env.JWT_SECRET) {
			console.error("❌ JWT_SECRET 未設定！");
			return res.status(500).json({ message: "伺服器設定錯誤" });
		}

		// ✅ 產生 token
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		return res.status(200).json({
			message: "登入成功",
			token,
			user: {
				id: user.id,
				email: user.email,
			},
		});
	} catch (err) {
		console.error("❌ 登入錯誤：", err);
		return res.status(500).json({ message: "伺服器錯誤" });
	}
}

module.exports = { login };
