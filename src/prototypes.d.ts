import axios, { AxiosStatic } from "axios";
import firebase from "firebase/app";
import Toasted from "vue-toasted";
import Vue from "vue";

Vue.prototype.$axios = axios;
declare module "vue/types/vue" {
  interface Vue {
    $axios: AxiosStatic;
  }
}

Vue.prototype.$firebase = firebase;
declare module "vue/types/vue" {
  // 3. Vue에 보강할 내용을 선언
  interface Vue {
    $firebase: typeof firebase;
  }
}
