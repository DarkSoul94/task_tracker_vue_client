<template>
  <div>
    <v-navigation-drawer 
		v-model="show"
		absolute
    disable-resize-watcher
    disable-route-watcher
    app
		> 
		<v-list>
      <v-list-item
      v-for="url in urls"
      :key="url.path"
      link
      :to="url.path"
      >
        <v-list-item-content>
          {{url.name}}
        </v-list-item-content>
      </v-list-item>
    </v-list>
		</v-navigation-drawer>

    <v-app-bar color="blue" dense app>
      <v-app-bar-nav-icon 
      @click.stop="show = !show"
      v-if="this.$store.getters.isLoggedIn"
      >
        <img src="@/assets/images/menu.png" />
      </v-app-bar-nav-icon>
      <v-toolbar-title>Task tracker</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn 
      icon @click="logout"
      v-if="this.$store.getters.isLoggedIn"
      >
        <v-img src="@/assets/images/logout.png" alt="logout" contain height="40px"></v-img>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
	data(){
		return{
			show: false,
      urls: [
        {name: "Список задач", path: "/task-list"},
        {name: "Отчёты", path: "/reports"},
        {name: "Настройки", path: "/settings"},
      ],
		}
	},
  methods: {
    logout() {
      this.$store
        .dispatch("logout")
        .then(() => this.$router.push({ name: "login" }))
        .catch((error) => console.log(error));
    },
    inverseSidebarState() {
      this.$store.commit("inverseSideBarState");
    },
  },
};
</script>
