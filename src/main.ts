import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import {loadHistory, current_chat } from './modules/main_logic'
import { loadRole } from './modules/role'




const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');