const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  if (process.env.NODE_ENV === "development") {
    req.user = {
      id: "5c5ff104-f0dc-4c57-933d-90d49272cbbc",
      email: "dev@example.com",
    }; // 模擬用戶
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "未提供登入權限" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "登入權限無效" });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
