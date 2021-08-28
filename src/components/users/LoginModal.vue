<template>
  <v-dialog
    min-width="380px"
    max-width="500px"
    :value="loginModal"
    @click:outside="updateModal"
  >
    <v-card :loading="loading">
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-toolbar :color="toolbarBtn.color" dark flat dense height="48px">
        <v-toolbar-title>{{ toolbarBtn.title }}</v-toolbar-title>
        <v-spacer />
        <v-btn text dark @click="createForm = !createForm">
          <v-icon left>{{ toolbarBtn.icon }}</v-icon>
          <span>{{ toolbarBtn.name }}</span>
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
            @updateForm="updateForm"
          />
          <div class="hr-sect">소셜 로그인</div>
          <v-card-actions v-for="(btn, i) in buttons" :key="i">
            <LoginBtn
              :name="btn.name"
              :icon="btn.icon"
              :key="i"
              @modal="updateModal"
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
import { mapGetters } from "vuex";

export default Vue.extend({
  components: {
    LoginForm,
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
      headerLoading: false,
      toolbarBtn: {
        title: "로그인",
        icon: "mdi-account-plus",
        name: "회원가입",
        color: "primary",
      },
      buttons: [
        { name: "google Login", icon: "mdi-google" },
        { name: "kakao Login", icon: "mdi-account" },
        { name: "github Login", icon: "mdi-github" },
      ],
    };
  },
  methods: {
    updateModal() {
      this.$emit("modal");
    },
    updateForm() {
      this.createForm = true;
    },
  },
  computed: {
    ...mapGetters(["loading", "error"]),
  },
  watch: {
    createForm() {
      const button = [
        {
          title: "로그인",
          icon: "mdi-account-plus",
          name: "회원가입",
          color: "primary",
        },
        {
          title: "회원가입",
          icon: "mdi-account",
          name: "로그인",
          color: "teal accent-5",
        },
      ];
      if (this.createForm) {
        this.toolbarBtn = button[1];
      } else {
        this.toolbarBtn = button[0];
      }
    },
    loading(value) {
      const err = this.error;
      if (!value && !err) {
        this.updateModal();
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
