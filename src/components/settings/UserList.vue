<template>
  <v-container>
    <v-card>
      <v-data-iterator
        :items="users"
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
            <v-col cols="4">
              Имя пользователя
            </v-col>
            <v-col cols="3">
              Отдел
            </v-col>
            <v-col cols="4">
              Группа
            </v-col>
          </v-row>
          <v-row class="ma-0">
            <v-col
              cols="12"
              v-for="user in props.items"
              :key="user.id"
              class="pa-0"
            >
              <v-card>
                <v-container fluid class="mb-1 pb-1">
                  <v-row class="pb-1">
                    <v-col cols="1" class="pt-1 pl-1">{{ user.id }}</v-col>
                    <v-col cols="4" class="pt-1 pl-1">{{ user.name }}</v-col>
                    <v-col cols="3" class="pt-1 pl-1">{{
                      user.department
                    }}</v-col>
                    <v-col cols="4" class="pa-0">
                      <div style="height: 50px;">
                        <v-select
                          v-model="user.group_id"
                          :items="groups"
                          item-text="name"
                          item-value="id"
                          outlined
                          dense
                          @change="updateUser(user)"
                        ></v-select>
                      </div>
                    </v-col>
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
export default {
  data() {
    return {
      search: "",
      itemsPerPage: 10,
      itemsPerPageArray: [5, 10, 15, 20],
      page: 1,
    };
  },
  computed: {
    users() {
      return this.$store.getters.userList;
    },
    groups() {
      return this.$store.getters.groupList;
    },
    numberOfPages() {
      return Math.ceil(this.users.length / this.itemsPerPage);
    },
  },
  methods: {
    updateUser(user) {
      this.$store
        .dispatch("updateUser", user)
        .then(this.$toasted.success("Пользователь обновлен"))
        .catch((error) => {
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
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
  },
  mounted() {
    this.$store.dispatch("getUserList").catch((error) => {
      if (error.response.data.error === undefined) {
        this.$toasted.error(error);
      } else {
        this.$toasted.error(error.response.data.error);
      }
      if (!this.$store.getters.isLoggedIn) {
        this.$router.push("/login");
      }
    });

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
};
</script>
