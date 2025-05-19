<template>
    <main class="container py-5">
      <h1 class="mb-4">登入頁面</h1>
  
      <!-- 錯誤訊息提示 -->
      <div v-if="showError" class="alert alert-danger d-flex align-items-center" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" class="bi flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:" width="20">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 
          3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <div class="ms-2">登入失敗，請檢查帳號密碼</div>
      </div>
  
      <!-- 登入表單 -->
      <form v-if="!isLoggedIn" @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="email" required />
        </div>
  
        <div class="mb-3">
          <label for="password" class="form-label">密碼</label>
          <input v-model="password" type="password" class="form-control" id="password" required />
        </div>
  
        <button type="submit" class="btn btn-primary">登入</button>
        <button type="submit" class="btn btn-primary">註冊</button>
      </form>
  
      <!-- 登出按鈕 -->
      <div v-if="isLoggedIn">
        <p class="text-success">您已登入</p>
        <button class="btn btn-danger" @click="logout">登出</button>
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const TOKEN_NAME = 'user_token'
  const email = ref('')
  const password = ref('')
  const isLoggedIn = ref(false)
  const showError = ref(false)
  
  const clearText = () => {
    email.value = ''
    password.value = ''
  }
  
  const login = async () => {
    if (email.value === '' || password.value === '') {
    showError.value = true
    errorMessage.value = '請輸入 Email 和密碼'
    return
  }
    const userData = {
      user: {
        email: email.value,
        password: password.value
      }
    }
  
    try {
      const res = await axios.post('https://todoo.5xcamp.us/users/sign_in', userData)
      const token = res.headers.authorization
      localStorage.setItem(TOKEN_NAME, token)
      isLoggedIn.value = true
      showError.value = false
      clearText()
    } catch (err) {
      showError.value = true
      showError.value = true
    // 嘗試讀取 API 回傳錯誤訊息
    errorMessage.value = err.response?.data?.message || '登入失敗，請檢查帳號密碼'
    }
  }
  
  const logout = async () => {
    const token = localStorage.getItem(TOKEN_NAME)
    if (!token) return
  
    try {
      await axios.delete('https://todoo.5xcamp.us/users/sign_out', {
        headers: { Authorization: token }
      })
    } finally {
      localStorage.removeItem(TOKEN_NAME)
      isLoggedIn.value = false
      clearText()
    }
  }
  
  onMounted(() => {
    const token = localStorage.getItem(TOKEN_NAME)
    if (token) isLoggedIn.value = true
  })
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
  }
  </style>
  