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
            <span v-bind="attrs" v-on="on" text class="pa-0">Cooperation</span>
          </template>
          <span>Bottom tooltip</span>
        </v-tooltip>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon><v-icon>mdi-magnify</v-icon></v-btn>
      <v-btn icon v-if="!user"><v-icon>mdi-account</v-icon></v-btn>
      <v-btn icon v-else>
        <v-avatar size="30px">
          <v-img
            src="https://avatars2.githubusercontent.com/u/67082137?s=460&u=f69e0bb8fbf80e5c67c541ae99bd4868100a5e17&v=4"
          >
          </v-img>
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="draw" app>
      <v-list-item>
        <v-list-item-avatar size="40px" color="grey"></v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Cooperation</v-list-item-title>
          <v-list-item-subtitle>웹 사이트 버전</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click.stop="draw = false">
            <v-icon size="16px" light>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider />
      <!-- 유저 -->
      <v-expansion-panels v-if="user" focusable max="255px">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-list-item>
              <v-list-item-avatar>
                <v-img
                  src="https://avatars2.githubusercontent.com/u/67082137?s=460&u=f69e0bb8fbf80e5c67c541ae99bd4868100a5e17&v=4"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>유저 이름</v-list-item-title>
                <v-list-item-subtitle>등급</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <template v-slot:actions>
              <v-icon color="primary">$expand</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item
                v-for="ui in navItems.userItems"
                :key="ui.title"
                link
              >
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
    <v-main> <router-view /> </v-main>
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
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import navList from "@/assets/Json/navList.json";

export default Vue.extend({
  data() {
    return {
      draw: false,
      user: false,
      navItems: navList,
    };
  },
});
</script>

<style scoped></style>
