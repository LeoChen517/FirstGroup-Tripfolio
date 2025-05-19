<script setup>
import { ref, watch } from 'vue'
defineProps()


const uploadAvatar = (event) => {
    const file = event.target.files[0]
    if(file){
        profileData.value.avatarUrl = URL.createObjectURL(file)
    }
}

//這串是會員假資料，之後要改成串資料庫
const profileData = ref({
    avatar:'https://via.placeholder.com/50',
    name:'測試用戶',
    gender:'male',
    phone:'0912123456',
    email:'test@gmail.com',
    birthday:'1995-01-01'
})



const phoneError = ref('');

watch(() => profileData.value.phone,(newPhone) => {
    const phoneNumber = /^09\d{8}$/;
    if(!phoneNumber.test(newPhone)){
        phoneError.value = '手機格式錯誤，範例：0912345678';
    } else {
        phoneError.value = '';
    }
})

const saveProfile = () => {
    alert('儲存成功');
    return;
}


const passwordData = ref({
    oldPassword:'',
    newPassword:'',
    confirmPassword:''
})

const showOld = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const changePassword = () => {
    if(!passwordData.value.oldPassword || !passwordData.value.newPassword || !passwordData.value.confirmPassword){
        alert('請填寫所有欄位');
        return;
    }
    if(passwordData.value.newPassword  !== passwordData.value.confirmPassword){
        alert('新密碼輸入不一致，請重新輸入');
        return;
    }
    alert('密碼修改成功');

    passwordData.value.oldPassword = '';
    passwordData.value.newPassword = '';
    passwordData.value.confirmPassword = '';
}

</script>

<template>
    <div class="profile">

        <h2>資料修改</h2>
        
        <div class="avatar">
        <img v-bind:src="profileData.avatarUrl" alt="大頭貼" />
        <input type="file" @change="uploadAvatar" />
        </div>

        <form @submit.prevent="saveProfile">
            <input type="text" v-model="profileData.name" placeholder="名稱" maxlength="10"/>
            <select name="" id="" v-model="profileData.gender">
                <option value="male">男</option>
                <option value="female">女</option>
            </select>
            <div>
                <input type="tel" v-model="profileData.phone" placeholder="手機號碼" maxlength="10"/>
                <p v-if="phoneError" style="color:red">{{ phoneError }}</p>
            </div>
            <input type="email" v-model="profileData.email" placeholder="電子郵件" />
            <input type="date" v-model="profileData.birthday"/>
            <button type="submit">儲存資料</button>
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
            <button type="submit">修改密碼</button>
        </form>
    </div>
</template>


<style>

</style>