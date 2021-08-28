import Vue from "vue";
import Vuex, { StoreOptions, ActionContext } from "vuex";
import userStore from "./modules/userStore";

export interface RootState {
  data: string;
  error: Error | null;
  loading: boolean;
}

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    data: "root",
    error: null,
    loading: false,
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      if (payload.msg) {
        const err = new Error(payload.msg);
        state.error = err;
      } else {
        state.error = payload;
      }
      Vue.toasted.global.error(state.error);

      setTimeout(() => {
        state.error = null;
      }, 8000);
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    //ActionContext 타입이 RootState이므로 위에 있으니 따로 지정안해줘도 됨.
    //기본적으로 RootState에서 관리하기 때문에 각 모듈별로 네임스페이스를 지정해줘야 해당 모듈만 데이터 변화가능.
    setError({ commit }, payload) {
      commit("setError", payload);
    },
    clearError({ commit }) {
      commit("clearError");
    },
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
  },
  modules: {
    userStore,
  },
};

export default new Vuex.Store(store);
