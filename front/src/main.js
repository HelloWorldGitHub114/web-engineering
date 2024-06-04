import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router/router'
import store from './store'
import VueParticles from 'vue-particles'
import axios from 'axios';

import './api/http.js'
Vue.config.productionTip = false



Vue.use(VueParticles)
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
