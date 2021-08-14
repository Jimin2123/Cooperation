<template>
  <v-card-actions>
    <v-btn block id="google" dark @click="google">
      <v-icon left dark>mdi-google</v-icon>
      구글 로그인</v-btn
    >
  </v-card-actions>
</template>

<script lang="ts">
import { UserInfo } from "@/interfaces/User.interface";
import { auth } from "@/plugins/firebase";
import Vue from "vue";

export default Vue.extend({
  methods: {
    async google() {
      const provider = new auth.GoogleAuthProvider();
      provider.setCustomParameters({
        login_hint: "user@example.com",
      });
      try {
        await auth().signInWithPopup(provider);
        const user = this.updateUser();
        this.$emit("modal");
        this.$emit("google", user);
      } catch (error) {
        console.log(error);
        this.$emit("error", error);
      }
    },
    updateUser(): UserInfo | null {
      const currentUser = auth().currentUser;
      if (currentUser !== null) {
        const user: UserInfo = {
          provider: "Google",
          userID: currentUser.uid,
          userEmail: currentUser.email,
          userNickName: currentUser.displayName,
          profile_image_url: currentUser.photoURL,
        };
        return user;
      }
      return null;
    },
  },
});
</script>

<style scoped>
#google {
  background-color: rgb(221, 75, 57);
  border-color: rgb(221, 75, 57);
}
</style>
