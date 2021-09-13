<template>
  <v-container>
    <NewTask />
    <v-dialog v-model="dialog" max-width="1000px">
      <task-detaile :task="task" :closeFunc="closeTask" />
    </v-dialog>
    <v-data-iterator
      :items="taskList"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar flat>
          <v-row>
            <v-col cols="5">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Поиск пользователя"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-select
                v-model="sortBy"
                flat
                hide-details
                :items="keys"
                label="Сортировка"
              >
                <v-col cols="2">
                  <v-btn-toggle v-model="sortDesc" mandatory>
                    <v-btn large depressed color="blue" :value="false">
                      <v-icon>mdi-arrow-up</v-icon>
                    </v-btn>
                    <v-btn large depressed color="blue" :value="true">
                      <v-icon>mdi-arrow-down</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-select>
            </v-col>
          </v-row>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            lg="3"
            md="4"
            sm="6"
            xs="12"
            v-for="task in props.items"
            :key="task.id"
            @click="showTask(task.id)"
          >
            <v-card>
              <v-container fluid>
                <v-row>
                  <v-col cols="7">
                    <span v-if="task.priority" style="color:red"
                      >Приоритетная</span
                    >
                  </v-col>
                  <v-col cols="5">
                    <v-chip small>{{
                      task.creation_date | date("date")
                    }}</v-chip>
                  </v-col>
                </v-row>

                <v-row>
                  <v-card-title>{{ task.name }}</v-card-title>
                </v-row>

                <v-divider></v-divider>

                <v-row>
                  <v-col>
                    <span>Статус: {{ task.status.name }}</span>
                  </v-col>
                </v-row>

                <v-row align="center">
                  <v-col cols="7">
                    <div>
                      <v-btn
                        @click.stop="trackTask(task.id, !task.tracked)"
                        :color="task.tracked ? 'green' : 'red'"
                        >track</v-btn
                      >
                    </div>
                  </v-col>
                  <v-col cols="5">
                    <v-chip>{{ task.in_work_time }}</v-chip>
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
  </v-container>
</template>

<script>
import NewTask from "@/components/task_list/NewTask";
import TaskDetaile from "@/components/task_list/TaskDetaile";

export default {
  data() {
    return {
      search: "",
      itemsPerPage: 8,
      itemsPerPageArray: [4, 8, 12, 16, 20],
      page: 1,
      sortDesc: false,
      sortBy: "name",
      keys: [
        "id",
        "name",
        "creation_date",
        "in_work_time",
        "priority",
        "exec_order",
      ],
      dialog: false,
      task: {},
      default_period: 10,
      period: 10,
    };
  },
  computed: {
    taskList() {
      return this.$store.getters.taskList;
    },
    numberOfPages() {
      return Math.ceil(this.taskList.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  methods: {
    showTask(id) {
      this.$store
        .dispatch("getTask", id)
        .then((task) => {
          this.task = task;
          if (task.project === null) {
            this.task.project = {
              id: 0,
              name: "",
            };
          }
          if (task.developer === null) {
            this.task.developer = {
              id: 0,
              name: "",
            };
          }
          if (task.customer === null) {
            this.task.customer = {
              id: 0,
              name: "",
            };
          }

          this.dialog = true;
        })
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
    closeTask() {
      this.dialog = false;
    },
    trackTask(id, tracked) {
      let track = {
        task_id: id,
        status: tracked,
      };

      this.$store.dispatch("trackTask", track).catch((error) => {
        if (error.response.data.error === undefined) {
          this.$toasted.error(error);
        } else {
          this.$toasted.error(error.response.data.error);
        }
        if (!this.$store.getters.isLoggedIn) {
          this.$router.push("/login");
        }
      });
      this.getTaskList();
    },
    getTaskList() {
      this.$store.dispatch("getTaskList").catch((error) => {
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
    startTimer() {
      this.stopTimer();
      this.interval = window.setInterval(() => {
        this.updateTimer();
      }, 1000);
    },
    updateTimer() {
      this.period = this.period - 1;
      if (this.period <= 0) {
        this.period = this.default_period;
        this.getTaskList();
      }
    },
    stopTimer() {
      if (this.interval) {
        window.clearInterval(this.interval);
      }
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
  created() {
    this.getTaskList();
  },
  mounted() {
    this.startTimer();
  },
  beforeDestroy() {
    this.stopTimer();
  },
  components: {
    NewTask,
    TaskDetaile,
  },
};
</script>
