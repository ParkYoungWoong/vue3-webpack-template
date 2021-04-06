import { createApp } from 'vue'
import App from './App'
import router from './router' // Same as './router/index.js'

createApp(App)
  .use(router)
  .mount('#app')
