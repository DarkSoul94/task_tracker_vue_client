<template>
  <v-container>
    <v-tabs v-model="selectedTab" centered>
      <v-tab>Пользователи</v-tab>
      <v-tab>Группы доступов</v-tab>
      <v-tab>Категории</v-tab>
      <v-tab>Проекты</v-tab>
    </v-tabs>
		<v-tabs-items v-model="selectedTab">
			<v-tab-item ><Users/></v-tab-item>
			<v-tab-item ><Groups/></v-tab-item>
			<v-tab-item >categoryes</v-tab-item>
			<v-tab-item >prodjects</v-tab-item>
		</v-tabs-items>
  </v-container>
</template>

<script>
import Users from "@/components/settings/UserList.vue"
import Groups from "@/components/settings/GroupList.vue"
export default {
  data() {
    return {
      selectedTab: null,
    };
  },
	components:{
		Users, Groups,
	},
	methods:{
	}
};
</script>
