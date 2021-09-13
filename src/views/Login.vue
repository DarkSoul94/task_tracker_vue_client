<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="4">
        <v-form>
          <v-text-field
            v-model="userName"
            label="User name"
            :counter="40"
            required
            type="text"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            :counter="40"
            required
            type="password"
            v-on:keyup.enter="submit"
          ></v-text-field>

          <v-row justify="center">
            <v-col cols="2">
              <v-btn @click="submit">login</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
      password: "",
      loginStatus: false,
    };
  },
  created: function() {
    if (localStorage.getItem("user")) {
      this.routeToTaskList();
    }
  },
  methods: {
    routeToTaskList() {
      this.$router.push("/task-list");
    },
    submit() {
      this.login();
    },
    login() {
      let userName = this.userName;
      let password = this.password;
      this.$store
        .dispatch("signIn", { userName, password })
        .then(this.routeToTaskList)
        .catch((error) => {
          if (error.response.data.error === undefined) {
            this.$toasted.error(error);
          } else {
            this.$toasted.error(error.response.data.error);
          }
        });
    },
  },
};
</script>
