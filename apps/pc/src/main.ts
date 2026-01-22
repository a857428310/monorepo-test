import { createApp } from 'vue'
import '@ais/tailwind/index.css'
import './assets/styles/common.less'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
