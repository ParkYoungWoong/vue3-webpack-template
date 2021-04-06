import { createApp } from 'vue'
import App from './App.vue'
import store from './store'  // Same as './store/index.js'

createApp(App)
  .use(store)
  .mount('#app')
