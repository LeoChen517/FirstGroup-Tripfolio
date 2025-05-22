<template>
    <h2>這是註冊頁面</h2>
    <form @submit.prevent="SingUp"></form>
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



const SingUp = () => {
    console.log(email.value, username.value, password.value, phone.value)

    const existsEmail = user.find(user => user.email === email.value)
    if (existsEmail) {
        Swal.fire({
            icon: 'error',
            title: '註冊失敗',
            text: '電子郵件已被註冊'
        })
        return
    }
    const existsUsername = user.find(user => user.username === username.value)
    if (existsUsername) {
        Swal.fire({
            icon: 'error',
            title: '註冊失敗',
            text:'帳號名稱已有人使用'
        })
        return
    }
    // 密碼驗證（8字以上 + 英文 + 數字 + 不可與帳號相同）
    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password.value)
    const notSameAsUsername = password.value !== username.value
        if (!isValidPassword || !notSameAsUsername) {
        Swal.fire({
            icon: 'error',
            title: '註冊失敗',
            text:'密碼須至少8字以上 + 英數混合 ， 不可與帳號相同'
        })
        return
    }
    // 電話驗證（10碼，09開頭）
    const isValidPhone = /^09\d{8}$/.test(phone.value)
        if (!isValidPhone) {
            Swal.fire({
            icon: 'error',
            title: '註冊失敗',
            text:'手機號碼格式錯誤，必須是 09 開頭的 10 碼數字'
        })
        return
    }

    const newUser = {
        id: Date.now(),
        email: email.value,
        username: username.value,
        password: password.value,
        phone: phone.value
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

  // 也可以設 currentUser 狀態，模擬登入
    localStorage.setItem('currentUser', JSON.stringify(newUser))

    alert('註冊成功！歡迎加入✨')
    router.push(`/member`) // 導向會員頁



    try {
        const response = await axios.post('https://api.example.com/signup', {
            email: email.value,
            nickname: nickname.value,
            password: password.value,
            phone: phone.value
        })
        if (response.status === 200) {
            Swal.fire({
                icon: 'success',
                title: '註冊成功',
                text: '註冊成功！畫面將導向會員頁'
            })
            router.push('/member')
            clearText()
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: '註冊失敗',
            text: error.response.data.message
        })
    }
}
</script>