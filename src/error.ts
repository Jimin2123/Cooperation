import Vue from "vue";

Vue.config.errorHandler = (e) => {
  if (e.message) {
    Vue.prototype.$toasted.global.error(e.message);
  }
};

// 사용법 throw Error(에러);
