<template>
  <v-btn block :id="activeClass" dark @click="user">
    <v-icon left dark>{{ icon }}</v-icon>
    {{ name }}</v-btn
  >
</template>

<script lang="ts">
import { login } from "@/services/login";
import Vue from "vue";

export default Vue.extend({
  props: {
    name: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  data() {
    return {
      activeClass: "google",
    };
  },
  methods: {
    async user() {
      const user = await login(this.name);
      console.log(user);
      if (user) {
        this.$emit("user", user);
        this.$emit("modal");
      }
    },
    color() {
      if (this.icon === "mdi-google") {
        this.activeClass = "google";
      } else if (this.icon === "mdi-account") {
        this.activeClass = "kakao";
      } else if (this.icon === "mdi-github") {
        this.activeClass = "github";
      }
    },
  },
  beforeMount() {
    this.color();
  },
});
</script>

<style scoped>
#kakao {
  background-color: #ffd400;
  border-color: #ffd400;
}
#google {
  background-color: rgb(221, 75, 57);
  border-color: rgb(221, 75, 57);
}
#github {
  background-color: rgb(36, 42, 45);
  border-color: rgb(36, 42, 45);
}
</style>
