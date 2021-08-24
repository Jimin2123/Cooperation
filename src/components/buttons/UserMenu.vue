<template>
  <v-menu fixed :offset-x="true" :offset-y="true">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-avatar size="30px">
          <v-img :src="user.photoURL" />
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in userItems" :key="index">
        <v-list-item-avatar>
          <v-img :src="item.image" v-if="item.image"></v-img>
          <v-icon v-else :style="item.style" :color="item.color">{{
            item.icon
          }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <LogoutBtn @user="updateLogoutInfo" />
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import LogoutBtn from "@/components/buttons/LogoutBtn.vue";
import { auth } from "@/plugins/firebase";

export default Vue.extend({
  components: {
    LogoutBtn,
  },
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      userItems: [
        {
          title: "닉네임",
          image: this.user.photoURL,
          subtitle: this.user.displayName,
        },
        {
          title: "이메일",
          icon: "",
          subtitle: this.user.email,
          style: "",
          color: "",
        },
        {
          title: "권한 등급",
          icon: "mdi-badge-account-alert-outline",
          subtitle: this.user.grade,
        },
        {
          title: "나의 페이지",
          subtitle: "내 정보 확인",
          icon: "mdi-account-search",
          subIcon: "mdi-arrow-right-bold-circle-outline",
        },
      ],
    };
  },
  methods: {
    updateUserItems(): void {
      if (this.user.provider == "kakaocorp.com") {
        this.userItems[1].image =
          "https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/service/453a624d017900001.png";
      } else if (this.user.provider == "google.com") {
        this.userItems[1].icon = "mdi-google";
        this.userItems[1].style =
          "color: rgb(221, 75, 57); caret-color: rgb(221, 75, 57);";
      } else if (this.user.provider === "github.com") {
        this.userItems[1].icon = "mdi-github";
        this.userItems[1].style =
          "color: rgb(36, 42, 46); caret-color: rgb(36, 42, 46);";
      } else if (this.user.provider === "password") {
        this.checkEmailVerified();
      }
      if (this.user.grade === undefined) {
        this.userItems[2].subtitle = "손님";
      }
    },
    updateLogoutInfo(value: boolean) {
      this.$emit("user", value);
    },
    checkEmailVerified() {
      if (!this.user.emailVerified) {
        this.userItems[1].icon = "mdi-email-alert-outline";
        this.userItems[1].color = "error";
      } else {
        this.userItems[1].icon = "mdi-email-check-outline";
        this.userItems[1].color = "success";
      }
    },
  },
  created() {
    this.updateUserItems();
  },
});
</script>

<style scoped></style>
