import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/api', authRoutes)

app.listen(PORT, () => {
    console.log(`伺服器啟動於 http://localhost:${PORT}`)
})
