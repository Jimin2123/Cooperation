<template>
  <v-app>
    <v-app-bar app color="white" flat>
      <v-app-bar-nav-icon
        class="ml-10"
        @click.stop="draw = !draw"
        v-if="!draw"
      />
      <v-toolbar-title v-if="!draw">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }" v-if="!draw">
            <router-link to="/" class="header-title">
              <span v-bind="attrs" v-on="on" text class="pa-0">
                Cooperation</span
              >
            </router-link>
          </template>
          <span>Bottom tooltip</span>
        </v-tooltip>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon><v-icon>mdi-magnify</v-icon></v-btn>
      <v-btn icon v-if="!user" @click="dialog = !dialog"
        ><v-icon>mdi-account</v-icon></v-btn
      >
      <UserMenu v-else :user="user" />
    </v-app-bar>
    <Navigation :nav="draw" :user="user" @nav="updateNav" />

    <v-main>
      {{ error }}
    </v-main>
    <v-footer absolute app color="white" class="pa-0">
      <v-card flat width="100%" light>
        <v-divider />
        <v-subheader light>
          <v-btn text class="caption">개인정보처리방침</v-btn>|<v-btn
            text
            class="caption"
            >이용약관</v-btn
          >
          <v-spacer />
          <span class="caption">
            &copy; {{ new Date().getFullYear() }} Shiba</span
          >
        </v-subheader>
      </v-card>
    </v-footer>

    <!-- 로그인 팝업 -->
    <LoginModal :loginModal="dialog" @modal="updateLoginModal" />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import LoginModal from "@/components/users/LoginModal.vue";
import UserMenu from "@/components/buttons/UserMenu.vue";
import Navigation from "@/components/layouts/Navigation.vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  components: {
    UserMenu,
    Navigation,
    LoginModal,
  },
  data() {
    return {
      draw: false,
      dialog: false,
    };
  },
  methods: {
    updateNav(value: boolean) {
      this.draw = value;
    },
    updateLoginModal() {
      this.dialog = false;
    },
  },
  computed: {
    ...mapGetters("userStore", ["user"]),
    ...mapGetters(["error"]),
  },
});
</script>

<style scoped>
.header-title {
  text-decoration: none;
}
</style>
