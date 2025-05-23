import { pgTable, uuid, boolean } from "drizzle-orm/pg-core";

export const emailNotifications = pgTable("email_notifications", {
  userId: uuid("user_id").primaryKey(),
  onRegister: boolean("on_register").default(true),
  onLogin: boolean("on_login").default(true),
  onAbnormalLogin: boolean("on_abnormal_login").default(true),
  onEmailVerify: boolean("on_email_verify").default(true),
  onComment: boolean("on_comment").default(true),
  onLike: boolean("on_like").default(true),
  onFavorite: boolean("on_favorite").default(true),
  onShare: boolean("on_share").default(true),
  onCustomerReply: boolean("on_customer_reply").default(true),
});
