<template>
  <v-container>
    <v-dialog v-model="dialog" max-width="1000px">
      <group-detaile :group="group" :closeFunc="closeGroup" />
    </v-dialog>

    <v-card>
      <v-data-iterator
        :items="groups"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :search="search"
        hide-default-footer
      >
        <template v-slot:header>
          <v-toolbar flat>
            <v-row justify="end">
              <v-col cols="6">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Поиск пользователя"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-toolbar>
        </template>

        <template v-slot:default="props">
          <v-row class="ma-0">
            <v-col cols="1">
              ID
            </v-col>
            <v-col cols="5">
              Название группы
            </v-col>
          </v-row>
          <v-row class="ma-0">
            <v-col
              cols="12"
              v-for="group in props.items"
              :key="group.id"
              class="pa-0"
            >
              <v-card @click="showGroup(group.id)">
                <v-container fluid class="pt-1 mb-1">
                  <v-row class="pb-1">
                    <v-col cols="1" class="pa-0">{{ group.id }}</v-col>
                    <v-col cols="4" class="pa-0">{{ group.name }}</v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-row>
            <v-col cols="3" offset="1">
              <span class="grey--text">Items per page</span>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    text
                    color="primary"
                    class="ml-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ itemsPerPage }}
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(number, index) in itemsPerPageArray"
                    :key="index"
                    @click="updateItemsPerPage(number)"
                  >
                    <v-list-item-title>{{ number }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col cols="3" offset="4">
              <span class="mr-4 grey--text">
                Page {{ page }} of {{ numberOfPages }}
              </span>
              <v-btn text @click="formerPage">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn text @click="nextPage">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-card>
  </v-container>
</template>

<script>
import GroupDetaile from "./GroupDetaile.vue";
export default {
  data() {
    return {
      search: "",
      itemsPerPage: 10,
      itemsPerPageArray: [5, 10, 15, 20],
      page: 1,
      group: {
        id: 0,
        name: "",
        permissions: [],
      },
      dialog: false,
    };
  },
  computed: {
    groups() {
      return this.$store.getters.groupList;
    },
    numberOfPages() {
      return Math.ceil(this.groups.length / this.itemsPerPage);
    },
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    showGroup(id) {
      this.$store
        .dispatch("getGroup", id)
        .then((group) => {
          this.group = group;
          this.dialog = true;
        })
        .catch(() => {
          if (!this.$store.getters.isLoggedIn) {
            this.$router.push("/login");
          }
        });
    },
    closeGroup() {
      this.dialog = false;
    },
  },
  mounted() {
    this.$store.dispatch("getGroupList").catch((error) => {
      if (error.response.data.error === undefined) {
        this.$toasted.error(error);
      } else {
        this.$toasted.error(error.response.data.error);
      }
      if (!this.$store.getters.isLoggedIn) {
        this.$router.push("/login");
      }
    });
  },
  components: {
    GroupDetaile,
  },
};
</script>
