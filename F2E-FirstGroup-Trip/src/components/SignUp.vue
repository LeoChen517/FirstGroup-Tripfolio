<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const showSection = ref('loginSection')
const email = ref('')
const nickname = ref('')
const password = ref('')
const isLogin = ref(false)

function showLogin() {
    showSection.value = 'loginSection'
}

function showSignUp() {
    showSection.value = 'signUpSection'
}

function clearText() {
    email.value = ''
    nickname.value = ''
    password.value = ''
}

// 註冊
async function signUp() {
    if (email.value && nickname.value && password.value) {
    try {
        await axios.post('https://tripfolio/users', {
        user: {
            email: email.value,
            nickname: nickname.value,
            password: password.value
        }
    })
        clearText()
        showLogin()
    } catch (err) {
        const errText = err.response?.data?.error?.join('<br />') || '未知錯誤'
        Swal.fire({
            title: '系統發生錯誤',
            html: errText,
            icon: 'error',
            confirmButtonText: '確認'
            })
        }
    }
}

// 登入
async function login() {
    if (email.value && password.value) {
    try {
        const resp = await axios.post('https://tripfolio/users/sign_in', {
        user: {
            email: email.value,
            password: password.value
        }
        })
        const token = resp.headers.authorization
        localStorage.setItem('USER_NAME', email.value)
        clearText()
        isLogin.value = true
    } catch {
        Swal.fire({
            title: '錯誤',
            html: '登入失敗',
            icon: 'error',
            confirmButtonText: '確認'
            })
        }
    }
}
</script>