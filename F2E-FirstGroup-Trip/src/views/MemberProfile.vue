<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
defineProps()

//確認會員登入 抓id
const memberId = localStorage.getItem('memberId') || '1'
if (!memberId) {
  alert('請先登入會員')
  throw new Error('memberId 不存在')
}

const profileData = ref({
    name: '',
    gender: '',
    phone: '',
    email: '',
    birthday: '',
    avatar: '',
}) 

const avatarFile = ref(null)

//換大頭照
const uploadAvatar = (event) => {
    avatarFile.value = event.target.files[0]
    if(avatarFile.value) {
        profileData.value.avatar = URL.createObjectURL(avatarFile.value)
    }
}

//儲存大頭貼
const saveAvatar = async () => {
    if(!avatarFile.value) {
        alert('請先選擇圖片')
        return
    }

    const formData = new FormData()
    formData.append('avatar', avatarFile.value)
    formData.append('memberId', memberId)

    try {
        const res = await axios.post('http://localhost:3000/api/upload-avatar', formData)
        profileData.value.avatar = res.data.path
        alert('大頭貼上傳成功')
    } catch (err) {
        console.error('上傳失敗', err)
        alert('上傳失敗')
    }
}

//載入會員資料
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/members/${memberId}`)
    const data = res.data
    // 只針對生日顯示時差處理
    if (data.birthday) {
      const date = new Date(data.birthday)
      const adjustedDate = new Date(date.getTime() + (8 * 60 * 60 * 1000))
      data.birthday = adjustedDate.toISOString().slice(0, 10)
    }
    profileData.value = data
  } catch (error) {
    console.error('讀取會員資料失敗', error)
  }
})


const phoneError = ref('');

//手機號碼格式
watch(() => profileData.value.phone,(newPhone) => {
    const phoneNumber = /^09\d{8}$/;
    if(!phoneNumber.test(newPhone)){
        phoneError.value = '手機格式錯誤，範例：0912345678';
    } else {
        phoneError.value = '';
    }
})

//儲存會員資料送去資料庫
const saveProfile = async () => {
    try {
        const res = await axios.put(`http://localhost:3000/api/members/${memberId}`,profileData.value)
        alert('儲存成功')
        profileData.value = res.data
    } catch (err) {
        console.log('更新失敗：', err)
        alert('儲存失敗')
    }
}

const passwordData = ref({
    oldPassword:'',
    newPassword:'',
    confirmPassword:''
})

const showOld = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

//判斷密碼欄位
const changePassword = async () => {
    if(!passwordData.value.oldPassword || !passwordData.value.newPassword || !passwordData.value.confirmPassword){
        alert('請填寫所有欄位');
        return;
    }
    if(passwordData.value.newPassword  !== passwordData.value.confirmPassword){
        alert('新密碼輸入不一致，請重新輸入');
        return;
    }
    try{
        const res = await axios.put(`http://localhost:3000/api/members/${memberId}/password`, { oldPassword:passwordData.value.oldPassword,newPassword:passwordData.value.newPassword
         })
    alert('密碼修改成功');

    passwordData.value.oldPassword = '';
    passwordData.value.newPassword = '';
    passwordData.value.confirmPassword = '';
    } catch(err) {
    const errorMessage = err.response?.data?.error || '密碼修改失敗，請稍後再試';
        alert(errorMessage);
        console.error('密碼修改失敗', err);
  }
}
</script>

<template>
    <div class="profile">

        <h2>資料修改</h2>

            <img :src="profileData.avatar && profileData.avatar.startsWith('/uploads') ? `http://localhost:3000${profileData.avatar}` : profileData.avatar" alt="大頭貼" />
            <input type="file" @change="uploadAvatar" />
            <button @click="saveAvatar">儲存大頭貼</button>

        <form @submit.prevent="saveProfile">
            <span>名稱：</span>
            <input type="text" v-model="profileData.name" placeholder="名稱" maxlength="10"/>
            <span>性別：</span>
            <select name="" id="" v-model="profileData.gender">
                <option value="male">男</option>
                <option value="female">女</option>
            </select>
            <div>
                <span>手機號碼：</span>
                <input type="tel" v-model="profileData.phone" placeholder="手機號碼" maxlength="10"/>
                <p v-if="phoneError" style="color:red">{{ phoneError }}</p>
            </div>
            <!-- <input type="email" v-model="profileData.email" placeholder="電子郵件" /> -->
            <span>生日：</span>
            <input type="date" v-model="profileData.birthday"/>
            <button type="submit">儲存會員資料</button>
        </form>

        <h2>密碼修改</h2>
        <form @submit.prevent="changePassword">
            <div>
                <input :type="showOld? 'text' : 'password'" v-model="passwordData.oldPassword" placeholder="舊密碼" />
                <span @click="showOld = !showOld">
                    <i :class="showOld ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
            </div>
            <div>
                <input :type="showNew? 'text' : 'password'" v-model="passwordData.newPassword" placeholder="新密碼" />
                <span @click="showNew = !showNew">
                    <i :class="showNew ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>            
            </div>
            <div>
                <input :type="showConfirm? 'text' : 'password'" v-model="passwordData.confirmPassword" placeholder="再次輸入新密碼" />
                <span @click="showConfirm = !showConfirm">
                    <i :class="showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
            </div>            
            <button type="submit">送出修改密碼</button>
        </form>
    </div>
</template>


<style>

</style>