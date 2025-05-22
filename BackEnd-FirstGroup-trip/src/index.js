// src/index.js

const express = require("express");
const cors = require("cors");

const app = express();

// CORS 設定（允許從前端存取 API）
app.use(
	cors({
		origin: "http://localhost:5173", // 你的前端開發環境
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

// 解析 JSON 請求
app.use(express.json());

// 測試用根路由
app.get("/", (req, res) => {
	res.send("伺服器運作中！");
});

// 設定 port 並啟動伺服器
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`✅ Server running at http://localhost:${PORT}`);
});
