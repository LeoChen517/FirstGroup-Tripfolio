const { db } = require("../config/db");
const { emailPreferences } = require("../models/emailPreferences");
const { eq } = require("drizzle-orm");

async function getPreferences(req, res) {
  const userId = req.user.id;
  try {
    const result = await db
      .select()
      .from(emailPreferences)
      .where(eq(emailPreferences.userId, userId));
    if (result.length === 0) {
      return res.status(404).json({ message: "找不到偏好設定" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("偏好設定查詢錯誤", err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
}

async function updatePreferences(req, res) {
  const userId = req.user.id;
  const prefs = req.body.preferences;
  try {
    await db
      .update(emailPreferences)
      .set({
        onRegister: prefs.onRegister,
        onLogin: prefs.onLogin,
        onLoginfail: prefs.onLoginfail,
        onVerify: prefs.onVerify,
        onComment: prefs.onComment,
        onLike: prefs.onLike,
        onBookmark: prefs.onBookmark,
        onShare: prefs.onShare,
        onCustomerReply: prefs.onCustomerReply,
      })
      .where(eq(emailPreferences.userId, userId));
    res.json({ message: "偏好設定已更新" });
  } catch (err) {
    console.error("更新錯誤", err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
}

module.exports = {
  getPreferences,
  updatePreferences,
};
