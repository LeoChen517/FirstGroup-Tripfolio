import axios from "axios"
import Swal from "sweetalert2"


const Main = () => ({
    showSection: "loginSection",
    email: "",
    nickname: "",
    password: "",
    isLogin: false,
    
    clearText() {
        this.email = "";
        this.nickname = "";
        this.password = "";
    },
    showLogin() {
        this.showSection = "loginSection";
    },
    showSignUp() {
        this.showSection = "signUpSection";
    },
    
    async logout() {
        const url = "https://todoo.5xcamp.us/users/sign_out";
        const token = localStorage.getItem(TOKEN_NAME);

        if (token) {
            try {
                const config = { headers: { Authorization: token } };
                await axios.delete(url, config);
            } catch {}

            this.isLogin = false;
            localStorage.removeItem(TOKEN_NAME);
            this.todos = [];
            this.showLogin();
        }
    },
    async login() {
        if (this.email != "" && this.password != "") {
            const userData = {
                user: {
                    email: this.email,
                    password: this.password,
                },
            };

            try {
                const resp = await axios.post("https://todoo.5xcamp.us/users/sign_in", userData);
                const token = resp.headers.authorization;

                localStorage.setItem(TOKEN_NAME, token);
                this.clearText();
                this.isLogin = true;
                this.showTaskInput();
                this.getTodos();
            } catch (err) {
                Swal.fire({
                    title: "錯誤",
                    html: "登入失敗",
                    icon: "error",
                    confirmButtonText: "確認",
                });
            }
        }
    },
    async signUp() {
        if (this.email != "" && this.nickname != "" && this.password != "") {
            const userData = {
                user: {
                    email: this.email,
                    nickname: this.nickname,
                    password: this.password,
                },
            };

            try {
                await axios.post("https://todoo.5xcamp.us/users", userData);
                this.clearText();
                this.showLogin();
            } catch (err) {
                const errText = err.response.data.error.join("<br />");
                Swal.fire({
                    title: "系統發生錯誤",
                    html: errText,
                    icon: "error",
                    confirmButtonText: "確認",
                });
            }
        }
    },
});

// 2
function handleRegister() {
    const users = JSON.parse(localStorage.getItem('users') || '[]')

  // 檢查信箱是否已存在
    const isExists = users.find(user => user.email === form.value.email)
    if (isExists) {
        alert('信箱已註冊！')
        return
    }

  // 儲存新使用者
    const newUser = {
        id: Date.now(),
        ...form.value
        }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    alert('註冊成功！')
}



export default Main;