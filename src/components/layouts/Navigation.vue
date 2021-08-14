<template>
  <v-navigation-drawer :value="nav" app>
    <v-list-item>
      <v-list-item-avatar size="40px" color="grey"></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>Cooperation</v-list-item-title>
        <v-list-item-subtitle>웹 사이트 버전</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn icon @click.stop="updateNav">
          <v-icon size="16px" light>mdi-close</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider />
    <!-- 유저 -->
    <v-expansion-panels v-if="user.userID" focusable max="255px">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="user.profile_image_url" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.userNickName }}</v-list-item-title>
              <v-list-item-subtitle>등급</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <template v-slot:actions>
            <v-icon color="primary">$expand</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-item v-for="ui in navItems.userItems" :key="ui.title" link>
              <v-list-item-icon>
                <v-icon>{{ ui.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>{{ ui.title }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-list>
      <v-list-group
        v-for="(item, i) in navItems.items"
        :key="i"
        :prepend-icon="item.icon"
        no-action
      >
        <template slot="activator" block>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(sub, j) in item.sub"
          :key="j"
          link
          :to="sub.to"
          class="pl-10"
        >
          <v-list-item-icon>
            <v-icon>{{ sub.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-if="sub.chip">
              {{ sub.title }} |
              <v-chip v-if="sub.chip" label small :color="sub.color">{{
                sub.chip
              }}</v-chip>
            </v-list-item-title>
            <v-list-item-title v-else>{{ sub.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import navList from "@/assets/JSON/navList.json";

export default Vue.extend({
  props: {
    nav: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
    },
  },
  data() {
    return {
      navItems: navList,
    };
  },
  methods: {
    updateNav() {
      const nav = false;
      this.$emit("nav", nav);
    },
  },
});
</script>

<style scoped></style>
