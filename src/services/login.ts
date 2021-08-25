import { User } from "@/types";
import { auth } from "@/plugins/firebase";
import VueKakaoSdkPlugin from "vue-kakao-sdk";

export const login = async (provide: string): Promise<User | undefined> => {
  let provider = null;
  if (provide.match("github")) {
    provider = await github();
  } else if (provide.match("google")) {
    provider = await google();
  }

  if (!provider && provide.match("kakao")) {
    const user = await kakao();
    return user;
  } else {
    await auth().signInWithPopup(provider);
    try {
      const user = await updateUser();
      return user;
    } catch (error) {
      return error;
    }
  }
};

function github() {
  const provider = new auth.GithubAuthProvider();
  provider.addScope("repo");
  try {
    return provider;
  } catch (error) {
    return { errCode: error.code, message: "로그인 제공중 에러 발생" };
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
    return error;
  }
}

async function kakao() {
  const login = await Kakao.Auth.login({});
  const userInfo = await getKakaoUserInfo();
  const user = await kakaoUpdateUser(userInfo);
  await updateKakaoUser(user);
  return user;
}

async function getKakaoUserInfo() {
  let data: any;
  await Kakao.API.request({
    url: "/v2/user/me",
    success: (resp) => {
      data = resp;
    },
    fail: (error) => {
      data = error;
    },
  });
  return data;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const updateUser = async () => {
  const currentUser = auth().currentUser;
  const providerId = currentUser?.providerData[0]?.providerId ?? "unknown";
  if (currentUser !== null) {
    const user: User = {
      provider: providerId,
      uid: currentUser.uid,
      emailVerified: currentUser.emailVerified,
    };

    if (currentUser.email) user["email"] = currentUser.email;
    if (currentUser.displayName) user["displayName"] = currentUser.displayName;
    if (currentUser.photoURL) user["photoURL"] = currentUser.photoURL;
    if (currentUser.phoneNumber) user["phoneNumber"] = currentUser.phoneNumber;

    return user;
  }
};

const updateKakaoUser = async (user: User) => {
  const currentUser = auth().currentUser;
  currentUser
    ?.updateProfile(user)
    .then(() => {
      console.log("성공");
    })
    .catch((err) => {
      console.log(err);
    });
};

const kakaoUpdateUser = async (response: Kakao.API.ApiResponse) => {
  const account = response["kakao_account"];

  const { nickname, profile_image_url } = account["profile"];
  const user: User = {
    uid: response?.id,
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
    profile_image_needs_agreement,
  } = account;

  if (!age_range_needs_agreement) user.age_range = age_range;
  if (!birthday_needs_agreement) user.birthday = birthday;
  if (!email_needs_agreement) {
    user.email = email;
    user.emailVerified = is_email_verified;
  }
  if (!gender_needs_agreement) user.gender = gender;
  if (!profile_image_needs_agreement) user.photoURL = profile_image_url;
  if (!birthday_needs_agreement) user.birthday = birthday;

  return user;
};
