<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-subheader v-if="!createForm">이메일 로그인</v-subheader>
    <v-subheader v-else>이메일 회원가입</v-subheader>
    <v-text-field
      label="NickName"
      v-model="nickName"
      prepend-icon="mdi-account-box-outline"
      type="text"
      :color="color"
      outlined
      :rules="nickNameRules"
      required
      v-if="createForm"
    ></v-text-field>
    <v-text-field
      label="E-mail"
      v-model="email"
      prepend-icon="mdi-account"
      type="text"
      :color="color"
      :rules="emailRules"
      outlined
      required
    ></v-text-field>
    <v-text-field
      label="Password"
      v-model="password"
      prepend-icon="mdi-lock"
      type="password"
      :color="color"
      outlined
      :rules="passwordRules"
      required
    ></v-text-field>
    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="!createForm"
        :color="color"
        outlined
        :disabled="!valid"
        @click="login"
        block
        >로그인</v-btn
      >
      <v-btn
        v-else
        :color="color"
        outlined
        block
        :disabled="!valid"
        @click="register"
        >회원가입</v-btn
      >
    </v-card-actions>
    <v-card-title v-if="!createForm">
      <v-btn class="primary--text" text>비밀번호를 잊으셨나요?</v-btn>
      <v-spacer />
      <v-btn class="primary--text" text @click="$emit('updateForm')"
        >아직 회원이 아니신가요?</v-btn
      >
    </v-card-title>
  </v-form>
</template>

<script lang="ts">
import { auth } from "@/plugins/firebase";
import Vue from "vue";

export default Vue.extend({
  props: {
    modal: {
      type: Boolean,
    },
    createForm: {
      type: Boolean,
    },
  },
  data() {
    return {
      email: "",
      password: "",
      nickName: "",
      valid: true,
      color: "light-blue lighten-2",
      emailRules: [
        (v: string) => !!v || "이메일을 입력하세요",
        (v: string) => /.+@.+\..+/.test(v) || "이메일 형식으로 입력하세요.",
      ],
      passwordRules: [
        (v: string) => !!v || "비밀번호를 입력하세요",
        (v: string) => (v && v.length >= 6) || "최소 6글자 이상 입력하세요.",
      ],
      nickNameRules: [(v: string) => !!v || "닉네임을 입력하세요"],
    };
  },
  methods: {
    async login() {
      const check = (
        this.$refs.form as Vue & { validate: () => boolean }
      ).validate();

      if (!check) return;
      this.$store.dispatch("userStore/email", {
        email: this.email,
        password: this.password,
      });
    },

    async register() {
      const check = (
        this.$refs.form as Vue & { validate: () => boolean }
      ).validate();

      if (!check) return;

      try {
        await auth().createUserWithEmailAndPassword(this.email, this.password);
        await auth().currentUser?.sendEmailVerification();
        const user = auth().currentUser;
        user?.updateProfile({
          displayName: this.nickName,
        });
        this.login();
      } catch (error) {
        throw Error(error);
      }
    },
  },
  watch: {
    modal() {
      let refForm: HTMLFormElement = this.$refs.form as HTMLFormElement;
      refForm.reset();
    },
    createForm() {
      let refForm: HTMLFormElement = this.$refs.form as HTMLFormElement;
      refForm.reset();
      if (this.createForm) {
        this.color = "teal accent-4";
      } else {
        this.color = "light-blue lighten-2";
      }
    },
  },
});
</script>

<style scoped></style>
