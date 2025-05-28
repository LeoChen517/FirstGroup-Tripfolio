const { pgTable, boolean, uuid } = require("drizzle-orm/pg-core");

const emailPreferences = pgTable("email_preferences", {
  userId: uuid("user_id").primaryKey(),
  onRegister: boolean("on_register").notNull().default(true),
  onLogin: boolean("on_login").notNull().default(true),
  onLoginfail: boolean("on_loginfail").notNull().default(true),
  onVerify: boolean("on_verify").notNull().default(true),
  onComment: boolean("on_comment").notNull().default(true),
  onLike: boolean("on_like").notNull().default(true),
  onBookmark: boolean("on_bookmark").notNull().default(true),
  onShare: boolean("on_share").notNull().default(true),
  onCustomerReply: boolean("on_customer_reply").notNull().default(true),
});

module.exports = { emailPreferences };
