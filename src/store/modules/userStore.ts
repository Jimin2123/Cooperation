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
    socialLogin({ commit, dispatch }, payload) {
      commit("setLoading", true, { root: true });
      commit("clearError", undefined, { root: true });
      let provider: any;
      if (payload.match("github")) {
        provider = new auth.GithubAuthProvider();
      } else if (payload.match("google")) {
        provider = new auth.GoogleAuthProvider();
      }
      if (!provider) {
        const message = "can't not find provider";
        commit("setError", { message: message }, { root: true });
        return;
      }
      auth()
        .signInWithPopup(provider)
        .then((user) => {
          dispatch("setToken");
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

    async setToken({ commit }, payload) {
      const currentUser = auth().currentUser;
      const idToken = await currentUser?.getIdToken();
      if (idToken) localStorage.setItem("firebase_token", idToken);
    },

    async kakao({ commit, dispatch }) {
      commit("setLoading", true, { root: true });
      Kakao.Auth.login({
        success: (authObj) => {
          dispatch("getUserInfo");
          commit("setLoading", false, { root: true });
        },
        fail: (error) => {
          store.commit("setError", error, { root: true });
          store.commit("setLoading", false, { root: true });
        },
      });
    },

    async getUserInfo({ commit }, payload) {
      const kakaoToken = Kakao.Auth.getAccessToken();
      if (kakaoToken) {
        const user = await getKakaoUserInfo();
        if (user === undefined) return;
        const updateParams = await kakaoUpdateParams(user);
        commit("setUser", updateParams);
      }
      const firebaseToken = localStorage.getItem("firebase_token");
      if (firebaseToken) {
        const base64Payload = firebaseToken.split(".")[1];
        const payload = Buffer.from(base64Payload, "base64");
        const result = JSON.parse(payload.toString());
        console.log(result);
        const updateParams = await jwtUpdateParams(result);
        commit("setUser", updateParams);
      }
    },

    logout({ commit }) {
      if (Kakao.Auth.getAccessToken()) {
        Kakao.Auth.logout(() => {
          // console.log(Kakao.Auth.getAccessToken());
        });
      }
      const current = auth().currentUser;
      if (current) {
        auth().signOut();
        localStorage.removeItem("firebase_token");
      }
      commit("setUser", null);
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

function jwtUpdateParams(payload: any) {
  const updateParams: User = {
    provider: payload.firebase.sign_in_provider || "unknown",
    uid: payload.user_id,
  };

  if (payload.name) updateParams["displayName"] = payload.name;
  if (payload.email) {
    updateParams["email"] = payload.email;
    updateParams["emailVerified"] = payload.email_verified;
  }
  if (payload.email || payload.user_id) {
    updateParams["photoURL"] =
      payload.picture || updatePhotoURL(payload.email || payload.user_id);
  } else {
    updateParams["photoURL"] = payload.picture || null;
  }
  if (payload.phone_number) updateParams["phoneNumber"] = payload.phone_number;

  return updateParams;
}

async function getKakaoUserInfo() {
  let data: undefined | Kakao.API.ApiResponse;
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

  if (!account.email_needs_agreement) {
    user["email"] = account.email;
    user["emailVerified"] = account.is_email_verified;
  }
  user["photoURL"] =
    profile_image_url || updatePhotoURL(account.email || response.id);
  if (!account.age_range_needs_agreement) user["age_range"] = account.age_range;
  if (!account.birthday_needs_agreement) user["birthday"] = account.birthday;
  if (!account.gender_needs_agreement) user["gender"] = account.gender;

  return user;
};

function updatePhotoURL(user: string): string {
  const icon = ["mm", "identicon", "monsterid", "wavatar", "retro"];
  const MD5Email = crypto.MD5(user);
  const hash = crypto.enc.Hex.stringify(MD5Email).trim();
  const photoURL = `https://www.gravatar.com/avatar/${hash}.jpg?d=${icon[4]}`;

  return photoURL;
}

export default module;
