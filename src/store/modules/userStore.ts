import { Module } from "vuex";
import store, { RootState } from "@/store/index";
import { User } from "@/types";
import firebase, { auth } from "@/plugins/firebase";
import crypto from "crypto-js";

interface userStore {
  data: string;
  user: User | null;
}

const module: Module<userStore, RootState> = {
  namespaced: true, // 지정을 해줘야 RootState와 따로 동작한다. 없으면, RootState 변경시 같이 변경
  state: {
    data: "userStore",
    user: null,
  },
  // RootState와 똑같이 작성해도 상관없음
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    email({ commit }, payload) {
      commit("setLoading", true, { root: true });
      commit("clearError", undefined, { root: true });
      auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
          const providerId = "email&passowrd";
          const updateParams = firebaseUpdateParams(user, providerId);
          commit("setUser", updateParams);
          commit("setLoading", false, { root: true });
        })
        .catch((error) => {
          commit("setError", error, { root: true });
          commit("setLoading", false, { root: true });
        });
    },
    google({ commit }) {
      commit("setLoading", true, { root: true });
      commit("clearError", undefined, { root: true });
      const provider = new auth.GoogleAuthProvider();
      auth()
        .signInWithPopup(provider)
        .then((user) => {
          commit("setLoading", false, { root: true });
          const providerId = provider.providerId;
          const updateParams = firebaseUpdateParams(user, providerId);
          commit("setUser", updateParams);
        })
        .catch((error) => {
          commit("setError", error, { root: true });
          commit("setLoading", false, { root: true });
        });
    },
    github({ commit }) {
      commit("setLoading", true, { root: true });
      commit("clearError", undefined, { root: true });
      const provider = new auth.GithubAuthProvider();
      auth()
        .signInWithPopup(provider)
        .then((user) => {
          commit("setLoading", false, { root: true });
          const providerId = provider.providerId;
          const updateParams = firebaseUpdateParams(user, providerId);
          commit("setUser", updateParams);
        })
        .catch((error) => {
          commit("setError", error, { root: true });
          commit("setLoading", false, { root: true });
        });
    },
    logout({ commit }) {
      auth().signOut();
      commit("setUser", null);
    },
    async kakao({ commit }) {
      commit("setLoading", true, { root: true });
      await Kakao.Auth.login({});
      const userInfo = await getKakaoUserInfo();
      if (userInfo === undefined) return;
      const updateParams = await kakaoUpdateParams(userInfo);
      commit("setUser", updateParams);
      commit("setLoading", false, { root: true });
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
};

function firebaseUpdateParams(
  payload: firebase.auth.UserCredential,
  provider?: string
) {
  const userInfo = payload.user;
  const updateParams: User = {
    provider: provider || "unknown",
    uid: userInfo?.uid,
  };

  if (userInfo?.displayName) updateParams["displayName"] = userInfo.displayName;
  if (userInfo?.email) {
    updateParams["email"] = userInfo.email;
    updateParams["emailVerified"] = userInfo.emailVerified;
  }
  if (userInfo?.email || userInfo?.uid) {
    updateParams["photoURL"] =
      userInfo?.photoURL || updatePhotoURL(userInfo.email || userInfo.uid);
  } else {
    updateParams["photoURL"] = userInfo?.photoURL || null;
  }
  if (userInfo?.phoneNumber) updateParams["phoneNumber"] = userInfo.phoneNumber;

  return updateParams;
}

function updatePhotoURL(user: string): string {
  const icon = ["mm", "identicon", "monsterid", "wavatar", "retro"];
  const MD5Email = crypto.MD5(user);
  const hash = crypto.enc.Hex.stringify(MD5Email).trim();
  const photoURL = `https://www.gravatar.com/avatar/${hash}.jpg?d=${icon[4]}`;

  return photoURL;
}

async function getKakaoUserInfo() {
  let data: Kakao.API.ApiResponse | undefined;
  await Kakao.API.request({
    url: "/v2/user/me",
    success: (resp) => {
      data = resp;
    },
    fail: (error) => {
      store.commit("setError", error, { root: true });
      store.commit("setLoading", false, { root: true });
    },
  });
  return data;
}

const kakaoUpdateParams = async (response: Kakao.API.ApiResponse) => {
  const account = response["kakao_account"];

  const { nickname, profile_image_url } = account["profile"];
  const user: User = {
    uid: response.id,
    provider: "kakaocorp.com",
    displayName: nickname,
  };

  const {
    email_needs_agreement,
    is_email_verified,
    email,
    gender,
    birthday_needs_agreement,
    birthday,
    age_range_needs_agreement,
    gender_needs_agreement,
    age_range,
  } = account;

  if (!email_needs_agreement) {
    user["email"] = email;
    user["emailVerified"] = is_email_verified;
  }
  user["photoURL"] = profile_image_url || updatePhotoURL(email || response.id);
  if (!age_range_needs_agreement) user["age_range"] = age_range;
  if (!birthday_needs_agreement) user["birthday"] = birthday;
  if (!gender_needs_agreement) user["gender"] = gender;

  return user;
};
// 사용 예시 : this.$store.dispatch('moduleB/setRootData', 'test'); //ModuleState

export default module;
