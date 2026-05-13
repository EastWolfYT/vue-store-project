<template>
    <div>
        <Header />

        <div class="registerView">
            <div class="registerBox">

                <div v-if="registered" class="infoBox">
                    <h1>Thank you</h1>
                    <p>For registering</p>
                    <button @click="resetForm">back to register</button>
                </div>

                <div v-else-if="exists" class="infoBox">
                    <h1>Info</h1>
                    <p>User already exists.</p>
                    <button @click="resetForm">back to register</button>
                </div>

                <form v-else @submit="onSubmit">
                    <h1>Register</h1>

                    <div v-show="error" class="errorBox">{{ error }}</div>

                    <input v-model="email" type="text" placeholder="Email" />

                    <input v-model="password" type="password" placeholder="Password" />

                    <input v-model="repeatPassword" type="password" placeholder="Repeat password" />

                    <button type="submit" :disabled="disabled">Send</button>
                </form>

                <AppLoader v-show="loading" />
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import AppLoader from "@/components/AppLoader.vue"
import { registerUser } from "@/api"

export default {
    name: "RegisterView",
    components: {
        Header,
        Footer,
        AppLoader
    },

    data() {
        return {
            error: "",
            email: "",
            password: "",
            repeatPassword: "",
            exists: false,
            registered: false,
            loading: false
        }
    },

    computed: {
        disabled() {
            return !this.email || !this.password || !this.repeatPassword
        }
    },

    methods: {
        onSubmit(e) {
            e.preventDefault()

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            if (!emailPattern.test(this.email)) {
                this.error = "Please enter a valid email address."
                return
            }

            if (this.password.length < 3) {
                this.error = "Password must have at least 3 characters"
                return
            }

            if (this.password !== this.repeatPassword) {
                this.error = "Passwords are not the same"
                return
            }

            this.error = ""
            this.loading = true

            registerUser({
                email: this.email,
                password: this.password
            })
                .then((data) => {
                    if (data.status === "registered") {
                        this.registered = true
                    } else if (data.status === "exists") {
                        this.exists = true
                    }
                })
                .catch(() => {
                    this.error = "user nie zarejestrowany"
                })
                .finally(() => {
                    this.loading = false
                })
        },

        resetForm() {
            this.error = ""
            this.email = ""
            this.password = ""
            this.repeatPassword = ""
            this.exists = false
            this.registered = false
            this.loading = false
        }
    }
}
</script>

<style scoped>
.registerView {
    min-height: calc(100vh - 120px);
    display: flex;
    justify-content: center;
    align-items: center;
}

.registerBox {
    width: 360px;
    background: #f7f7f7;
    border-radius: 4px;
    padding: 35px 40px;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
    text-align: center;
}

form {
    display: flex;
    flex-direction: column;
}

h1 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 28px;
    margin-bottom: 30px;
    color: #19324d;
}

input {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    margin-bottom: 12px;
    border: 1px solid #6d7a87;
    border-radius: 4px;
    font-size: 16px;
}

button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

button:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    color: white;
    transform: scale(1.04);
}

button:disabled {
    background: #d9d9d9;
    cursor: default;
    transform: scale(1.00);
}

.errorBox {
    background: #fff3f3;
    border: 1px solid #e3b1b1;
    color: #e53935;
    padding: 10px;
    border-radius: 4px;
    font-size: 14px;
    margin-bottom: 12px;
    text-align: left;
    font-family: Arial, Helvetica, sans-serif;
}

.infoBox p {
    font-family: Arial, Helvetica, sans-serif;
    color: #333;
    margin-bottom: 20px;
}
</style>