<template>
  <v-dialog
    min-width="380px"
    max-width="500px"
    :value="loginModal"
    @click:outside="updateModal"
  >
    <v-card>
      <v-toolbar color="primary" dark flat dense height="48px">
        <v-toolbar-title>로그인</v-toolbar-title>
        <v-spacer />
        <v-btn text dark @click="createForm = !createForm">
          <div v-if="!createForm">
            <v-icon left>mdi-account-plus</v-icon>
            <span>회원가입</span>
          </div>
          <div v-else>
            <v-icon left>mdi-account</v-icon>
            <span>로그인</span>
          </div>
        </v-btn>
        <v-btn @click="updateModal" fab icon dark>
          <v-icon size="16px">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-card outlined class="mt-10 pa-3">
          <AuthForm
            @modal="updateModal"
            :modal="loginModal"
            :createForm="createForm"
            @email="updateLoginInfo"
          />
          <div class="hr-sect">소셜 로그인</div>
          <GoogleLoginBtn @modal="updateModal" @google="updateLoginInfo" />
          <KakaoLoginBtn
            @kakao="updateLoginInfo"
            @modal="updateModal"
            @error="kakaoError"
          />
          <v-card-actions>
            <v-btn block id="github" dark>
              <v-icon left dark> mdi-github</v-icon>
              깃허브 로그인</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import AuthForm from "@/components/layouts/auth/Auth.vue";
import KakaoLoginBtn from "@/components/buttons/KakaoLogin.vue";
import GoogleLoginBtn from "@/components/buttons/GoogleLogin.vue";
import { UserInfo } from "@/interfaces/User.interface";

export default Vue.extend({
  components: {
    AuthForm,
    GoogleLoginBtn,
    KakaoLoginBtn,
  },
  props: {
    loginModal: {
      type: Boolean,
    },
  },
  data() {
    return {
      createForm: false,
    };
  },
  methods: {
    updateModal() {
      let dialog = false;
      this.$emit("modal", dialog);
    },
    updateLoginInfo(value: UserInfo | null) {
      this.$emit("user", value);
    },
    kakaoError(value: Kakao.API.ApiError | Kakao.Auth.AuthError) {
      console.log(value);
    },
  },
});
</script>

<style scoped>
.hr-sect {
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: rgba(0, 0, 0, 0.35);
  font-size: 13px;
  margin: 5px 0px;
}
.hr-sect::before,
.hr-sect::after {
  content: "";
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.35);
  height: 1px;
  font-size: 0px;
  line-height: 0px;
  margin: 0px 16px;
}

#github {
  background-color: rgb(36, 42, 45);
  border-color: rgb(36, 42, 45);
}
</style>
