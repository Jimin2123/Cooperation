<template>
  <v-btn block :id="activeClass" dark @click="login">
    <v-icon left dark>{{ icon }}</v-icon>
    {{ name }}</v-btn
  >
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

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
      btn: null,
    };
  },
  computed: {
    ...mapGetters(["error"]),
  },
  methods: {
    login() {
      if (this.icon === "mdi-google") {
        this.$store.dispatch("userStore/socialLogin", "google");
      } else if (this.icon === "mdi-account") {
        this.$store.dispatch("userStore/kakao");
      } else if (this.icon === "mdi-github") {
        this.$store.dispatch("userStore/socialLogin", "github");
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
