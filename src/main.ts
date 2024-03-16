import { createApp } from 'vue';
import { installPlugins } from '@/plugins';
import App from './App.vue';
import 'ress/dist/ress.min.css';

// mount app
installPlugins(createApp(App)).mount('#app');
