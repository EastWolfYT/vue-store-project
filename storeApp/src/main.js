import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/style.css'

const app = createApp(App)

app.use(router).use(store).mount('#app') // dołączamy router i store do apki vue