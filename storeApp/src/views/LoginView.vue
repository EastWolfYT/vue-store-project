<template>
  <div>
    <Header />

    <div class="loginView">
      <div class="loginBox">

        <div v-if="logged" class="infoBox">
          <h1>Info</h1>
          <p>You are succesfully logged in</p>
        </div>

        <form v-else @submit="onSubmit">
          <h1>Login</h1>

          <div v-show="error" class="errorBox">{{ error }}</div>

          <input
            v-model="email"
            type="text"
            placeholder="Email"
          />

          <input
            v-model="password"
            type="password"
            placeholder="Password"
          />

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

export default {
  name: "LoginView",
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
      logged: false, // czy user jest zalogowany
      loading: false // czy ma sie pokazac loader przy logowaniu
    }
  },

  computed: {
    // przycisk aktywny dopiero kiedy oba pola cos maja
    disabled() {
      return !this.email || !this.password
    }
  },

  methods: {
    onSubmit(e) {
      e.preventDefault();

      this.error = ""; // czyszczenie starego bledu
      this.logged = false; // czyszczenie poprzedniego stanu logowania
      this.loading = true; // wlaczenie loadera

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex emaila

      // sprawdzneie czy mail jest ogolnie poprawnie wpisany
      if (!emailPattern.test(this.email)) {
        this.error = "Please enter a valid email address.";
        this.loading = false;
        return;
      }

      // wysylanie danych do store a store kontaktuje sie z api i serwerem
      this.$store.dispatch("LOGIN_USER", { email: this.email, password: this.password })
        .then(() => {
          // po zakonczeniu sprawdzam czy store naprawde dostal usera
          const user = this.$store.getters.GET_CURRENT_USER;

          // jesli jest email to logowanie sie udalo
          if (user && user.email) {
            this.logged = true;
            // this.$router.push("/");
          } 
          // no a jak nie ma to nie udalo sie zalogowac
          else {
            this.error = "niepoprawne dane logowania";
            this.logged = false;
          }
        })
        .catch(() => {
          this.error = "niepoprawne dane logowania";
          this.logged = false;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
}
</script>

<style scoped>
.loginView {
    min-height: calc(100vh - 120px);
    display: flex;
    justify-content: center;
    align-items: center;
}

.loginBox {
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

@media (max-width: 420px) {
    .loginBox {
        width: 92%;
        padding: 25px 20px;
    }
}
</style>