// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
// import serviceAccount from "../key.json";
// import { UserInfo } from "../../src/interfaces/User.interface";

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
// });

// export function updateOrCreateUser(uid: string, obj: UserInfo) {
//   console.log("updating or creating a firebase user");
//   const updateParams: UserInfo = {
//     provider: obj.provider,
//     displayName: obj.displayName,
//   };
//   if (obj.displayName) {
//     updateParams["displayName"] = obj.displayName;
//   } else {
//     updateParams["displayName"] = obj.displayName;
//   }
//   if (obj.photoURL) {
//     updateParams["photoURL"] = obj.photoURL;
//   }
//   console.log(updateParams);

//   // 사용자 정보 갱신
//   return admin
//     .auth()
//     .updateUser(uid, updateParams)
//     .catch((error) => {
//       if (error.code === "auth/user-not-found") {
//         updateParams["uid"] = obj.uid;
//         if (obj.email) {
//           updateParams["email"] = obj.email;
//         }

//         // 신규 사용자 등록
//         return admin
//           .auth()
//           .createUser(updateParams)
//           .catch((err: any) => {
//             // 동일한 메일주소로 이미 가입되어 있는 경우에 사용자 검색하여 반환
//             if (err.code === "auth/email-already-exists") {
//               console.log(err);
//               // console.log('auth/email-already-exists --------------- ', email);
//               if (obj.email) return admin.auth().getUserByEmail(obj.email);
//               return null;
//             } else {
//               throw err;
//             }
//           });
//       }
//       throw error;
//     });
// }

// // // async function createFirebaseToken(kakaoAccessToken: string) {
// // //   try {
// // //     await updateOrCreateUser();
// // //     await admin.auth().createCustomToken(userId, { provider: "KAKAO" });
// // //   } catch (error) {
// // //     console.log(error);
// // //   }
// // // }
