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
import Vue from "vue";

export default Vue.extend({
  methods: {
    logout() {
      this.$store.dispatch("userStore/logout");
    },
  },
});
</script>

<style scoped></style>
