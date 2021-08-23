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
  const reqUser = await requestKakaoUser();
  const user = await kakaoUpdateUser(reqUser);

  return user;
}

async function requestKakaoUser() {
  let data: any = "";
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
      userID: currentUser.uid,
      userEmail: currentUser.email,
      userNickName: currentUser.displayName,
      profile_image_url: currentUser.photoURL,
    };
    return user;
  }
};

const kakaoUpdateUser = async (response: Kakao.API.ApiResponse) => {
  const account = response["kakao_account"];
  const user: UserInfo = {
    provider: "kakaocorp.com",
    userID: response?.id,
    userNickName: account.profile.nickname,
    profile_image_url: account.profile.profile_image_url,
    connected_at: response?.connected_at,
  };
  if (account.email_needs_agreement === false) {
    user.userEmail = account.email;
  }
  if (!account.gender_needs_agreement === false) {
    user.gender = account.gender;
  }
  return user;
};
