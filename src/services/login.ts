import { UserInfo } from "@/interfaces/User.interface";
import { auth } from "@/plugins/firebase";

export const login = async (provide: string): Promise<UserInfo | undefined> => {
  let provider = null;
  if (provide.match("github")) {
    provider = await github();
  } else if (provide.match("google")) {
    provider = await google();
  }

  if (!provider) {
    const user = await kakao();
    return user;
  }

  await auth().signInWithPopup(provider);
  try {
    const user = await updateUser();
    return user;
  } catch (error) {
    return error;
  }
};

function github() {
  const provider = new auth.GithubAuthProvider();
  provider.addScope("repo");
  try {
    return provider;
  } catch (error) {
    return error;
  }
}

function google() {
  const provider = new auth.GoogleAuthProvider();
  provider.setCustomParameters({
    login_hint: "user@example.com",
  });
  try {
    return provider;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function kakao() {
  const login = await Kakao.Auth.login({});
  const token = await Kakao.Auth.getAccessToken();
  const reqUser = await requestKakaoUser();
  const user = await kakaoUpdateUser(reqUser);

  return user;
}

async function requestKakaoUser() {
  let data: any;
  await Kakao.API.request({
    url: "/v2/user/me",
    success: (resp) => {
      data = resp;
    },
    fail: (error) => {
      console.log(error);
    },
  });
  return data;
}

const updateUser = async () => {
  const currentUser = auth().currentUser;
  const providerId = currentUser?.providerData[0]?.providerId ?? "unknown";
  if (currentUser !== null) {
    const user: UserInfo = {
      provider: providerId,
      uid: currentUser.uid,
    };
    user["email"] = currentUser.email ?? undefined;
    user["displayName"] = currentUser.displayName ?? undefined;
    user["photoURL"] = currentUser.photoURL ?? undefined;

    return user;
  }
};

const kakaoUpdateUser = async (response: Kakao.API.ApiResponse) => {
  const account = response["kakao_account"];
  const user: UserInfo = {
    uid: response?.id,
    provider: "kakaocorp.com",
    displayName: account.profile.nickname,
    photoURL: account.profile.profile_image_url,
  };
  if (account.email_needs_agreement === false) {
    user.email = account.email;
  }
  if (!account.gender_needs_agreement === false) {
    user.gender = account.gender;
  }

  return user;
};
