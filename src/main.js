import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/base.css'
import vuescroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'

Vue.config.productionTip = false

Vue.use(vuescroll)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
