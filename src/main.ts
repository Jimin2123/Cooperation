import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import KakaoSDK from "vue-kakao-sdk";
import "./plugins/toast";

const apiKey = process.env.VUE_APP_KAKAO_APP_JS_KEY;
Vue.use(KakaoSDK, { apiKey });
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
