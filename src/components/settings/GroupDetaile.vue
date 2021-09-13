<template>
  <v-container>
    <v-card>
      <v-card-title>{{ group.name }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-treeview 
        selectable 
        selection-type="leaf"
        v-model="selected"
        :items="fullPermissions"
        > </v-treeview>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" @click="closeFunc" text>Закрыть</v-btn>
        <v-btn color="blue" @click="updateGroup" text>Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ["group", "closeFunc"],
  data() {
    return {
      selected: [],
      items: [
        {
          id: "item 1",
          name: "item 1",
          children: [
            {id: "item 2", name: "children 1" },
            {id: "item 3", name: "children 2" },
            {id: "item 8", name: "children 3", children:[
              {id: "item 4", name: "children children"},
            ] },
            {id: "item 5", name: "children 4"}
          ],
        },
        {
          id: "item 6",
          name: "item 2",
          children: [
            {id: "item 7", name: "children 1" },
          ],
        },
      ],
    };
  },
  methods:{
    updateGroup(){
      console.log(this.selected)
    }
  },
  computed:{
    fullPermissions(){
      console.log(this.$store.getters.fullPermisssions)
      return this.$store.getters.fullPermisssions;
    },
  },
  mounted(){
    this.$store.dispatch("getFullPermissions").catch((error) => {
      if (error.response.data.error === undefined) {
        this.$toasted.error(error);
      } else {
        this.$toasted.error(error.response.data.error);
      }
      if (!this.$store.getters.isLoggedIn) {
        this.$router.push("/login");
      }
    });
  }

};
</script>
