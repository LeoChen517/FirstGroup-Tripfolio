const { db } = require("../config/db");
const { sendEmail } = require("../utils/emailSender");
const { emailPreferences } = require("../models/emailPreferences");
const { users } = require("../models/users");

// 取得使用者 Email
async function getUserEmail(userId) {
  const result = await db
    .select({ email: users.email })
    .from(users)
    .where(users.id.eq(userId));
  return result[0]?.email || null;
}

// 共用偏好檢查邏輯
async function isPreferenceEnabled(userId, field) {
  const pref = await db
    .select()
    .from(emailPreferences)
    .where(emailPreferences.userId.eq(userId));
  return !!pref[0]?.[field];
}

// 各類通知函式

async function notifyRegisterSuccess(userId) {
  if (!(await isPreferenceEnabled(userId, "onRegister"))) return;
  const email = await getUserEmail(userId);
  if (!email) return;
  await sendEmail(email, "註冊成功通知", `<p>歡迎加入 Tripfolio！</p>`);
}

async function notifyLoginSuccess(userId) {
  if (!(await isPreferenceEnabled(userId, "onLogin"))) return;
  const email = await getUserEmail(userId);
  if (!email) return;
  await sendEmail(email, "登入成功通知", `<p>您已成功登入 Tripfolio！</p>`);
}

async function notifyLoginfail(userId) {
  if (!(await isPreferenceEnabled(userId, "onLoginfail"))) return;
  const email = await getUserEmail(userId);
  if (!email) return;
  await sendEmail(
    email,
    "登入失敗警示",
    `<p>⚠️ 偵測到異常登入失敗，請確認是否為本人操作。</p>`
  );
}

async function notifyVerifyReminder(userId) {
  if (!(await isPreferenceEnabled(userId, "onVerify"))) return;
  const email = await getUserEmail(userId);
  if (!email) return;
  await sendEmail(
    email,
    "信箱驗證提醒",
    `<p>請盡快完成信箱驗證以保障帳號安全。</p>`
  );
}

async function notifyCommented(userId, commentContent) {
  if (!(await isPreferenceEnabled(userId, "onComment"))) return;
  const email = await getUserEmail(userId);
  if (!email) return;
  await sendEmail(
    email,
    "您的貼文有新留言",
    `<p>留言內容：${commentContent}</p>`
  );
}

async function notifyLiked(userId, likerName) {
  if (!(await isPreferenceEnabled(userId, "onLike"))) return;
  const email = await getUserEmail(userId);
  if (!email) return;
  await sendEmail(
    email,
    "您的貼文被按讚",
    `<p>${likerName} 按讚了您的貼文！</p>`
  );
}

async function notifyBookmarked(userId, bookmarkerName) {
  if (!(await isPreferenceEnabled(userId, "onBookmark"))) return;
  const email = await getUserEmail(userId);
  if (!email) return;
  await sendEmail(
    email,
    "您的貼文被收藏",
    `<p>${bookmarkerName} 收藏了您的貼文。</p>`
  );
}

async function notifyShared(userId, sharerName) {
  if (!(await isPreferenceEnabled(userId, "onShare"))) return;
  const email = await getUserEmail(userId);
  if (!email) return;
  await sendEmail(
    email,
    "您的貼文被分享",
    `<p>${sharerName} 分享了您的貼文。</p>`
  );
}

async function notifyCustomerReplied(userId, replyContent) {
  if (!(await isPreferenceEnabled(userId, "onCustomerReply"))) return;
  const email = await getUserEmail(userId);
  if (!email) return;
  await sendEmail(
    email,
    "客服回覆通知",
    `<p>客服回覆內容：${replyContent}</p>`
  );
}

module.exports = {
  notifyRegisterSuccess,
  notifyLoginSuccess,
  notifyLoginfail,
  notifyVerifyReminder,
  notifyCommented,
  notifyLiked,
  notifyBookmarked,
  notifyShared,
  notifyCustomerReplied,
};
