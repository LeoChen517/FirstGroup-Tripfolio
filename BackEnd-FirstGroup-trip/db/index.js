import pg from 'pg'
import dotenv from 'dotenv'

// 載入 .env 檔案中的環境變數
dotenv.config()

// 建立 PostgreSQL 連線池
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

export default pool
