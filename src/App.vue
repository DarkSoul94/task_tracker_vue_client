<template>
  <v-app>
    <Header />
    <v-main>
      <router-view></router-view>
    </v-main>
    
  </v-app>
</template>

<script>
import Header from "@/components/Header";

export default {
  components: {
    Header,
  },
};
</script>

<style lang="scss">
@import "assets/style.css";
</style>
