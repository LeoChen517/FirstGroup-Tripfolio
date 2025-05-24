const db = require("./index.js");
const { users } = require("./schema.js");

async function testDB() {
  try {
    const allUsers = await db.select().from(users);
    console.log("✅ 取得 users 資料：", allUsers);
  } catch (err) {
    console.error("❌ 連線或查詢失敗:", err);
  }
}

testDB();
