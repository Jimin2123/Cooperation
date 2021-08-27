import { User } from "@/types";
import { auth } from "@/plugins/firebase";
import crypto from "crypto-js";

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
  const login = await Kakao.Auth.login({
    success: (authObj) => {
      console.log(authObj);
      const token = Kakao.Auth.setAccessToken(authObj.access_token);
    },
  });
  const userInfo = await getKakaoUserInfo();
  const user = await updateKakaoUser(userInfo);

  return user;
}

async function getKakaoUserInfo() {
  let data: any;
  await Kakao.API.request({
    url: "/v2/user/me",
    success: (resp) => {
      console.log(resp);
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
    user["photoURL"] =
      currentUser.photoURL ||
      updatePhotoURL(currentUser.email || currentUser.uid);
    if (currentUser.displayName) user["displayName"] = currentUser.displayName;
    if (currentUser.phoneNumber) user["phoneNumber"] = currentUser.phoneNumber;

    if (!currentUser.photoURL) {
      currentUser.updateProfile({ photoURL: user["photoURL"] });
    }
    return user;
  }
};

const updateKakaoUser = async (response: Kakao.API.ApiResponse) => {
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

function updatePhotoURL(user: string): string {
  const icon = ["mm", "identicon", "monsterid", "wavatar", "retro"];
  const MD5Email = crypto.MD5(user);
  const hash = crypto.enc.Hex.stringify(MD5Email).trim();
  console.log(hash);
  const photoURL = `https://www.gravatar.com/avatar/${hash}.jpg?d=${icon[1]}`;

  return photoURL;
}
