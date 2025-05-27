<template>
	<main class="pl-[100px] pt-[100px]">
		<h1 class="text-2xl font-bold mb-6">登入頁面</h1>

		<div v-if="showError" class="flex items-start gap-2 bg-pink-500 text-red-800 border border-red-400 px-4 py-3 rounded mb-4">
			<i class="fas fa-triangle-exclamation text-xl mt-1"></i>
			<div>{{ errorMessage }}</div>
		</div>

		<form v-if="!isLoggedIn" @submit.prevent="login" class="space-y-6">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input v-model="email" type="email" id="email" required
					class="mb-5 block w-1/2 rounded-md border border-gray-300 shadow-sm p-2" />
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">密碼</label>
				<input v-model="password" type="password" id="password" required
					class="mb-5 block w-1/2 rounded-md border border-gray-300 shadow-sm p-2 " />
			</div>

			<div class="flex justify-end gap-[20px] mt-[10px] w-1/2">
				<button type="submit" class="w-[100px] bg-blue-200 text-black py-2 rounded transition">登入</button>
				<button type="button" class="w-[100px] bg-gray-200 text-black py-2 rounded transition">註冊</button>
			</div>
		</form>

		<div v-if="isLoggedIn" class="mt-6">
			<p class="text-green-600 font-semibold mb-4">您已登入</p>
			<button @click="logout" class="bg-red-600 text-black py-2 px-4 rounded transition">登出</button>
		</div>
	</main>
</template>

  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const TOKEN_NAME = 'user_token'
  const email = ref('')
  const password = ref('')
  const isLoggedIn = ref(false)
  const showError = ref(false)
  const errorMessage = ref('')
  
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
		email: email.value,
		password: password.value
	}
  
    try {
      const res = await axios.post('http://localhost:3000/api/login'
, userData)
    const token = res.data.token
    localStorage.setItem(TOKEN_NAME, token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    isLoggedIn.value = true
    showError.value = false
    clearText()
    } catch (err) {
      showError.value = true
      errorMessage.value = err.response?.data?.message || '登入失敗，請檢查郵件與密碼'
    }
  }
  
  const logout = async () => {
    const token = localStorage.getItem(TOKEN_NAME)
    if (!token) return
  

    localStorage.removeItem(TOKEN_NAME)
    isLoggedIn.value = false
    clearText()
    
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
  