import { createApp } from 'vue';
import { installPlugins } from '@/plugins';
import App from './App.vue';

// mount app
installPlugins(createApp(App)).mount('#app');
