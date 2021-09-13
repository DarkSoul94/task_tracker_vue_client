<template>
  <div>
    <v-btn color="blue" bottom right fixed fab @click="showDialog">
      <v-img src="@/assets/images/add.png" height="40px" contain></v-img>
    </v-btn>

    <v-dialog v-model="show" max-width="800px">
      <v-card>
        <v-card-title>Новая задача</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="name"
                  label="Название задачи"
                  required
                  type="text"
                  rows="4"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="categoryID"
                  label="Категория"
                  :items="categories"
                  item-text="name"
                  item-value="id"
                  outlined
                ></v-select>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="projectID"
                  label="Проект"
                  item-text="name"
                  item-value="id"
                  outlined
                ></v-select>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="customerID"
                  label="Заказчик"
                  :items="users"
                  item-text="name"
                  item-value="id"
                  outlined
                ></v-select>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="developerID"
                  label="Разработчик"
                  :items="users"
                  item-text="name"
                  item-value="id"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  label="Описание"
                  outlined
                ></v-textarea>
              </v-col>
              <v-col cols="4">
                <v-switch
                  color="primary"
                  v-model="priority"
                  label="Срочная задача"
                ></v-switch>
              </v-col>
              <v-col cols="6" offset="2">
                <v-select
                  v-model="execOrder"
                  label="Приоритет выполнения"
                  :items="execOrderArray"
                  item-text="number"
                  item-value="number"
                  outlined
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue" text @click="show = false">Закрыть</v-btn>

          <v-btn color="blue" text @click="submit">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      execOrderArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      categoryID: 0,
      name: "",
      description: "",
      projectID: 0,
      developerID: 0,
      customerID: 0,
      priority: false,
      execOrder: 1,
    };
  },
  computed: {
    categories() {
      return this.$store.getters.categoryList;
    },
    users() {
      return this.$store.getters.userList;
    },
  },
  methods: {
    showDialog() {
      this.show = true;
      this.categoryID = 0;
      this.name = "";
      this.description = "";
    },
    submit() {
      this.show = false;
      this.create();
    },
    create() {
      let newTask = {
        name: this.name,
        description: this.description,
        category_id: this.categoryID,
        project_id: this.projectID || null,
        developer_id: this.developerID || null,
        customer_id: this.customerID || null,
        priority: this.priority,
        exec_order: this.execOrder,
      };

      this.$store
        .dispatch("createTask", newTask)
        .then(this.$toasted.success("Задача успешно создана"))
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
  },
  mounted() {
    this.$store.dispatch("getCategoryList").catch((error) => {
      if (error.response.data.error === undefined) {
        this.$toasted.error(error);
      } else {
        this.$toasted.error(error.response.data.error);
      }
      if (!this.$store.getters.isLoggedIn) {
        this.$router.push("/login");
      }
    });

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
  },
};
</script>
