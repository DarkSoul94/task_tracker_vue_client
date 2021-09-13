<template>
  <v-card>
    <v-card-title>{{ task.name }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <span>Дата создания: </span>
            <v-chip small>{{ task.creation_date | date("date") }}</v-chip>
          </v-col>
          <v-col cols="6">
            <span>Время в работе: </span>
            <v-chip small>{{ task.in_work_time }}</v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="task.description"
              label="Описание"
              outlined
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="task.author.id"
              label="Автор"
              :items="users"
              item-text="name"
              item-value="id"
              outlined
              readonly
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="task.status.id"
              label="Статус"
              :items="taskStatuses"
              item-text="name"
              item-value="id"
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="task.customer.id"
              label="Заказчик"
              :items="users"
              item-text="name"
              item-value="id"
              outlined
            ></v-select>
          </v-col>

          <v-col cols="6">
            <v-select
              v-model="task.developer.id"
              label="Разработчик"
              :items="users"
              item-text="name"
              item-value="id"
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="task.category.id"
              label="Категория"
              :items="categories"
              item-text="name"
              item-value="id"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="task.project.id"
              label="Проект"
              item-text="name"
              item-value="id"
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-switch
              color="primary"
              v-model="task.priority"
              label="Срочная задача"
            ></v-switch>
          </v-col>
          <v-col cols="6" offset="2">
            <v-select
              v-model="task.exec_order"
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
      <v-btn color="blue" @click="closeFunc" text>Закрыть</v-btn>
      <v-btn color="blue" @click="updateTask" text>Сохранить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["task", "closeFunc"],
  data() {
    return {
      execOrderArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  },
  methods: {
    updateTask() {
      this.$store.dispatch("updateTask", this.task).catch((error) => {
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
  computed: {
    categories() {
      return this.$store.getters.categoryList;
    },
    users() {
      return this.$store.getters.userList;
    },
    taskStatuses() {
      return this.$store.getters.taskStatuses;
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
    this.$store.dispatch("getTaskStatusList").catch((error) => {
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
