<template>
        <h2 class="text-center text-xl font-semibold mb-4">註冊頁面</h2>
        <form
            class="flex flex-col gap-[10px] w-[300px] mx-auto"
            @submit.prevent="signUp"
        >
            <input
                v-model="email"
                type="email"
                placeholder="請輸入電子郵件"
                class="p-[8px] text-[14px] border border-[#aaa] rounded"
            />
            <input
                v-model="password"
                type="password"
                placeholder="請輸入密碼"
                class="p-[8px] text-[14px] border border-[#aaa] rounded"
            />
            <input
                v-model="phone"
                placeholder="請輸入手機號碼"
                class="p-[8px] text-[14px] border border-[#aaa] rounded"
            />
            <button
                type="submit"
                class="p-[10px] bg-[#6a5acd] text-white border-0 rounded cursor-pointer hover:bg-[#483d8b]"
            >
                註冊
            </button>
        </form>
</template>




<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const phone = ref('')
const router = useRouter()



const signUp = async () => {
    
    console.log(email.value, password.value, phone.value)

    if (!email.value || !password.value || !phone.value) {
        Swal.fire({
            icon: 'error',
            title: '欄位未填寫',
            text: '請填寫所有欄位'
        });
        return;
    }

    // 電子郵件驗證(僅限英數+ @ 與 .) 
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!isValidEmail.test(email.value)) {
        Swal.fire({
            icon: 'error',
            title: '電子郵件格式錯誤',
            text: '請輸入正確的電子郵件格式(僅限英數字母)'
        });
        return;
    }

    // 從 JSON Server 取得現有用戶
    const { data: user } = await axios.get("http://localhost:3000/users")

    const existsEmail = user.find(user => user.email === email.value)
    if (existsEmail) {
        Swal.fire({
            icon: 'error',
            title: '電子郵件重複註冊',
            text: '電子郵件已被註冊'
        })
        return;
    }

    // 密碼驗證（8字以上 + 英文 + 數字 + 不可與信箱相同）
    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password.value)
    const notSameAsEmail = password.value !== email.value
        if (!isValidPassword || !notSameAsEmail) {
        Swal.fire({
            icon: 'error',
            title: '密碼不符合格式',
            text:'密碼須至少8字以上 + 英數混合 ， 不可與信箱相同'
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

    // const newUser = {
    //     user:{
    //         id: Date.now(),
    //         email: email.value,
    //         password: password.value,
    //         phone: phone.value
    //     }
    // }

    // 使用 axios 發送 POST 請求
    // 使用 JSON Server 模擬後端API
    // 建立完後端更改為新的URL
    try {
        await axios.post("http://localhost:3000/users", {
            email: email.value,
            password: password.value,
            phone: phone.value
        });
        // 清空輸入欄位
        email.value = ''
        password.value = ''
        phone.value = ''

        await Swal.fire({
            icon: 'success',
            title: '註冊成功',
            text: '註冊成功！歡迎加入✨',
            timer: 3000, // 3s auto-close + 自動跳轉
            showConfirmButton: false, // 不顯示確認按鈕

            didClose: () => {
                router.push(`/profile`);
            }
        // 等 Swal 的確認按鈕被按下後才導向會員頁
        }); 
        

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


