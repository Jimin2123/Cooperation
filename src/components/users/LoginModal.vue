<template>
  <v-dialog
    min-width="380px"
    max-width="500px"
    :value="loginModal"
    @click:outside="updateModal"
  >
    <v-card>
      <v-toolbar :color="toolbarColor" dark flat dense height="48px">
        <v-toolbar-title v-if="!createForm">로그인</v-toolbar-title>
        <v-toolbar-title v-else>회원가입</v-toolbar-title>
        <v-spacer />
        <v-btn text dark @click="createForm = !createForm">
          <v-icon left>{{ toolbarBtnIcon }}</v-icon>
          <span>{{ toolbarBtnName }}</span>
        </v-btn>
        <v-btn @click="updateModal" fab icon dark>
          <v-icon size="16px">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-card outlined class="mt-10 pa-3">
          <LoginForm
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
import LoginForm from "@/components/users/LoginForm.vue";
import LoginBtn from "@/components/buttons/LoginBtn.vue";
import { User } from "@/types";

export default Vue.extend({
  components: {
    LoginForm,
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
      toolbarBtnIcon: "mdi-account-plus",
      toolbarBtnName: "회원가입",
      toolbarColor: "primary",
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
    updateLoginInfo(value: User | null) {
      this.$emit("user", value);
    },
  },
  watch: {
    createForm() {
      if (this.createForm) {
        this.toolbarBtnIcon = "mdi-account";
        this.toolbarBtnName = "로그인";
        this.toolbarColor = "teal accent-5";
      } else {
        this.toolbarBtnIcon = "mdi-account-plus";
        this.toolbarBtnName = "회원가입";
        this.toolbarColor = "primary";
      }
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
