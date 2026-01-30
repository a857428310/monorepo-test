import { createApp } from 'vue'
import '@ais/tailwind/index.css'
import './assets/styles/common.less'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 导入 Element Plus 样式
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
