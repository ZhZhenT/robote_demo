import Vue from 'vue'
import Router from 'vue-router'
// import Main from './Main.vue'
import Home from './views/Home.vue'
Vue.use(Router)

export default new Router({
  base: '/',
  routes: [
    {
      path: '/',
      component: Home
    }
  ]
})
