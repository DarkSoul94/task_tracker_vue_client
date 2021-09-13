import Vue from 'vue'
import App from './App.vue'
import axios from "axios"
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import dateFilter from '@/filters/date.filter'
import 'bootstrap/dist/css/bootstrap.css'
import Toasted from 'vue-toasted';

Vue.config.productionTip = false
Vue.filter("date", dateFilter)
Vue.prototype.$http = axios
const token = localStorage.getItem("token")
if (token){
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token
}
Vue.use(Toasted, {
  position: "bottom-right",
  duration: 4000,
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')