import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Spoiler from './Spoiler.vue'

const app = createApp(Spoiler)

app.use(createPinia())

app.mount('#app')
