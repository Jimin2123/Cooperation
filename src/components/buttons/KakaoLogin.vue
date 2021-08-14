<template>
  <v-card-actions>
    <v-btn block id="kakao" @click="kakaoLogin">
      <v-icon left dark>mdi-account</v-icon>
      카카오 로그인</v-btn
    >
  </v-card-actions>
</template>

<script lang="ts">
import { UserInfo } from "@/interfaces/User.interface";
import Vue from "vue";

export default Vue.extend({
  methods: {
    kakaoLogin() {
      const _this = this;
      Kakao.Auth.login({});
      Kakao.Auth.login({
        success: function (authObj) {
          // Kakao.Auth.setAccessToken(authObj.access_token);
          Kakao.API.request({
            url: "/v2/user/me",
            success: function (res) {
              const token = authObj.access_token;
              _this.$emit("modal");
              const user = _this.updateUser(res);
              _this.$emit("kakao", user);
            },
            fail: function (err) {
              _this.$emit("error", err);
            },
          });
        },
        fail: function (error) {
          _this.$emit("error", error);
        },
      });
    },
    updateUser(response: Kakao.API.ApiResponse): UserInfo {
      const account = response["kakao_account"];
      const user: UserInfo = {
        provider: "Kakao",
        userID: response["id"],
        userNickName: account.profile.nickname,
        profile_image_url: account.profile.profile_image_url,
        connected_at: response["connected_at"],
      };
      if (account.email_needs_agreement === false) {
        user.userEmail = account.email;
      }
      if (!account.gender_needs_agreement === false) {
        user.gender = account.gender;
      }
      return user;
    },
  },
});
</script>

<style scoped>
#kakao {
  background-color: #ffd400;
  border-color: #ffd400;
}
</style>
