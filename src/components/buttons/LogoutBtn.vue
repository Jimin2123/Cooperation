<template>
  <v-card-actions>
    <v-spacer />
    <v-btn @click="logout" color="error">
      <v-icon>mdi-exit-to-app</v-icon>
      <span>로그아웃</span>
    </v-btn>
  </v-card-actions>
</template>

<script lang="ts">
import { auth } from "@/plugins/firebase";
import Vue from "vue";

export default Vue.extend({
  methods: {
    async logout() {
      const user = auth().currentUser;
      if (user !== null) {
        await auth().signOut();
      } else {
        this.kakaoLogout();
      }
      this.$emit("user", true);
    },
    kakaoLogout() {
      if (!Kakao.Auth.getAccessToken()) {
        this.$emit("user", false);
        return;
      }
      Kakao.Auth.logout(() => {
        this.$emit("user", true);
      });
    },
  },
});
</script>

<style scoped></style>
