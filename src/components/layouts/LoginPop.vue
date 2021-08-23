<template>
  <v-dialog
    min-width="380px"
    max-width="500px"
    :value="loginModal"
    @click:outside="updateModal"
  >
    <v-card>
      <v-toolbar color="primary" dark flat dense height="48px">
        <v-toolbar-title v-if="!createForm">로그인</v-toolbar-title>
        <v-toolbar-title v-else>회원가입</v-toolbar-title>
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
            @updateForm="updateForm"
          />
          <div class="hr-sect">소셜 로그인</div>
          <v-card-actions v-for="(btn, i) in buttons" :key="i">
            <LoginBtn
              :name="btn.name"
              :icon="btn.icon"
              @modal="updateModal"
              @user="updateLoginInfo"
            />
          </v-card-actions>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import AuthForm from "@/components/layouts/auth/Auth.vue";
import LoginBtn from "@/components/buttons/LoginBtn.vue";
import { UserInfo } from "@/interfaces/User.interface";

export default Vue.extend({
  components: {
    AuthForm,
    // GoogleLoginBtn,
    // KakaoLoginBtn,
    // GithubLoginBtn,
    LoginBtn,
  },
  props: {
    loginModal: {
      type: Boolean,
    },
  },
  data() {
    return {
      createForm: false,
      buttons: [
        { name: "google Login", icon: "mdi-google" },
        { name: "kakao Login", icon: "mdi-account" },
        { name: "github Login", icon: "mdi-github" },
      ],
    };
  },
  methods: {
    updateModal() {
      let dialog = false;
      this.$emit("modal", dialog);
    },
    updateForm() {
      this.createForm = true;
    },
    updateLoginInfo(value: UserInfo | null) {
      this.$emit("user", value);
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
</style>
