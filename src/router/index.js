import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '~/views/Home'
import About from '~/views/About'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/about',
      component: About
    }
  ]
})
