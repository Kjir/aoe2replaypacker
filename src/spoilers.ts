import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Spoiler from './SpoilerTool.vue'

const app = createApp(Spoiler)

app.use(createPinia())

app.mount('#app')
