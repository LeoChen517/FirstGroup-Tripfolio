<template>
    <h2>註冊頁面</h2>
    <form @submit.prevent="SingUp">
        <input v-model="email" type="email" placeholder="請輸入電子郵件" />
        <input v-model="username" type="text" placeholder="請輸入帳號" />
        <input v-model="password" type="password" placeholder="請輸入密碼" />
        <input v-model="phone" placeholder="請輸入手機號碼" />
        <button>註冊</button>
    </form>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const email = ref('')
const username = ref('')
const password = ref('')
const phone = ref('')
const router = useRouter()



const SingUp = async () => {
    console.log(email.value, username.value, password.value, phone.value)

    if (!email.value || !username.value || !password.value || !phone.value) {
        Swal.fire({
            icon: 'error',
            title: '欄位未填寫',
            text: '請填寫所有欄位'
        });
        return;
    }

    const existsEmail = user.find(user => user.email === email.value)
    if (existsEmail) {
        Swal.fire({
            icon: 'error',
            title: '電子郵件重複註冊',
            text: '電子郵件已被註冊'
        })
        return;
    }
    const existsUsername = user.find(user => user.username === username.value)
    if (existsUsername) {
        Swal.fire({
            icon: 'error',
            title: '帳號重複註冊',
            text:'帳號名稱已有人使用'
        })
        return;
    }
    // 密碼驗證（8字以上 + 英文 + 數字 + 不可與帳號相同）
    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password.value)
    const notSameAsUsername = password.value !== username.value
        if (!isValidPassword || !notSameAsUsername) {
        Swal.fire({
            icon: 'error',
            title: '密碼不符合格式',
            text:'密碼須至少8字以上 + 英數混合 ， 不可與帳號相同'
        })
        return;
    }
    // 電話驗證（10碼，09開頭）
    const isValidPhone = /^09\d{8}$/.test(phone.value)
        if (!isValidPhone) {
            Swal.fire({
            icon: 'error',
            title: '手機號碼不符合格式',
            text:'手機號碼格式錯誤，必須是 09 開頭的 10 碼數字'
        })
        return;
    }

    const newUser = {
        user:{
            id: Date.now(),
            email: email.value,
            username: username.value,
            password: password.value,
            phone: phone.value
        }
    }

    // 使用 axios 發送 POST 請求
    // 建立完後端更改為新的URL
    try {
        await axios.post("https://todoo.5xcamp.us/users", newUser);
        this.clearText();

        await Swal.fire({
            icon: 'success',
            title: '註冊成功',
            text: '註冊成功！歡迎加入✨',
            timer: 2000, // 2s auto-close + 自動跳轉
            showConfirmButton: false, // 不顯示確認按鈕
        }); 

        router.push(`/profile`) 
        // 等 Swal 的確認按鈕被按下後才導向會員頁

    } catch (err) {
        const errText = err.response?.data?.error?.join("<br />") || "註冊失敗，請稍後重試";
        Swal.fire({
            icon: 'error',
            title: '註冊失敗',
            html: errText,
        });
    }
}

</script>