import { db } from "../config/db.js";
import { emailNotifications } from "../models/notificationSettings.js";

export const getNotificationSettings = async (req, res) => {
  const userId = req.user.id;
  const settings = await db
    .select()
    .from(emailNotifications)
    .where(emailNotifications.userId.eq(userId));
  res.json(settings[0] || {});
};

export const updateNotificationSettings = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;
  await db
    .insert(emailNotifications)
    .values({ userId, ...updates })
    .onConflictDoUpdate({
      target: emailNotifications.userId,
      set: updates,
    });
  res.json({ success: true });
};
