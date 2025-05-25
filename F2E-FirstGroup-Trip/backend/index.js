const express = require('express');
const cors = require('cors');
const pool = require("./db");

const app = express();
require('dotenv').config();

const multer = require('multer');
const path = require('path');
const upload = multer({ dest:'uploads/' })

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'))

//測試API
// app.get('api/test', (req, res) =>{
//     res.json({ message: '後端運作正常'});
// });

//新增會員列表api
app.get('/api/members/:id', async (req, res) => {
    const memberId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM members WHERE id = $1',[memberId]);
        if(result.rows.length===0){
            return res.status(404).json({ error:'會員不存在' })
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('查詢會員錯誤：', err);
        res.status(500).json({ error: '資料庫錯誤' });
    }
});


//上傳大頭貼API
app.post('/api/upload-avatar',upload.single('avatar'), async (req, res) => {
    const memberId = req.body.memberId;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null ;

    if(!filePath) {
        return res.status(400).json({ error: '沒有收到圖片'});
    }

    try{
        await pool.query('UPDATE members SET avatar = $1 WHERE id = $2', [filePath,memberId]);
        res.json({ message: '上傳成功', path: filePath});
    } catch (err) {
        console.error('資料庫錯誤', err);
        res.status(500).json({ error: '資料庫錯誤' });
    }
});


//會員資料修改api
app.put('/api/members/:id', async (req, res) => {
    const memberId = req.params.id;
    const { name, gender, phone, email, birthday } = req.body;
    try {
        const result = await pool.query('UPDATE members SET name = $1, gender = $2, phone = $3, email = $4, birthday = $5 WHERE id = $6 RETURNING *',
      [name, gender, phone, email, birthday, memberId]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('更新會員錯誤：', err);
        res.status(500).json({ error: err.message });
    }
});

//密碼修改驗證api
app.put('/api/members/:id/password', async (req, res) => {
    const memberId = req.params.id;
    const { oldPassword, newPassword } = req.body
    try {
        const result = await pool.query('SELECT password FROM members WHERE id = $1',[memberId]);
        if(result.rows.length===0){
            return res.status(404).json({ error:'會員不存在' })
        }
        const currentPassword = result.rows[0].password;
        if (oldPassword !== currentPassword) {
        return res.status(400).json({ error: '舊密碼不正確' });
        }
        await pool.query('UPDATE members SET password = $1 WHERE id = $2', [newPassword, memberId]);
        res.json({ message: '密碼已成功更新' });
    } catch (err) {
        console.error('密碼更新錯誤', err);
        res.status(500).json({ error: '資料庫錯誤' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`Server runnung on port ${PORT}`);
});