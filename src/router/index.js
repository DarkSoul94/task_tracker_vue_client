import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store/index.js"

Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes:[
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("@/views/Login.vue")
    },
    {
      path: "/task-list",
      name: "task list",
      component: () => import("@/views/TaskList.vue")
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/views/Settings.vue")
    }
  ]
})

router.beforeEach((to, from, next) => {
  let publicPages = ["/login"]
  let authRequired = !publicPages.includes(to.path)
  let loggedIn = store.getters.isLoggedIn
  
  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next()
})

export default router
