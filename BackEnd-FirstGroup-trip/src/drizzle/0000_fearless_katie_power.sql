CREATE TABLE "emailPreferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"onRegister" boolean DEFAULT true NOT NULL,
	"on_login" boolean DEFAULT true NOT NULL,
	"onLoginfail" boolean DEFAULT true NOT NULL,
	"onVerify" boolean DEFAULT true NOT NULL,
	"onComment" boolean DEFAULT true NOT NULL,
	"on_like" boolean DEFAULT true NOT NULL,
	"on_bookmark" boolean DEFAULT true NOT NULL,
	"on_share" boolean DEFAULT true NOT NULL,
	"on_customer_reply" boolean DEFAULT true NOT NULL
);
