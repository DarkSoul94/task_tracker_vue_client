import { Promise } from "core-js"
import Vue from "vue"

export default{
    state: {
        userList: [],
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        group: {},
        groupList: [],
        permissions: [],
    },
    getters:{
        isLoggedIn: (state) => !!state.token,
        userList: (state) => state.userList,
        groupList: (state) => state.groupList,
        fullPermisssions: (state) => state.permissions,
    },
    mutations: {
        auth_success(state, auth){
            state.user = auth.user
            state.token = auth.token
        },
        logout(state){
            state.user = {}
            state.token = ""
        },
        getUsers(state, users){
            state.userList = users
        },
        getGroups(state, groups){
            state.groupList = groups
        },
        getFullPermissions(state, fullPermisssions){
            state.permissions = fullPermisssions
        },
    },
    actions: {
        signIn(ctx, user){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/auth/signin",
                    data: {
                        username: user.userName, 
                        password: user.password,
                    },
                    method: "POST",
                }).then((responce) =>{
                    let token = "Bearer " + responce.data.data.token
                    let user = {
                        user_id: responce.data.data.user_id,
                        user_name: responce.data.data.user_name
                    }

                    axios.defaults.headers.common["Authorization"] = token
                    localStorage.setItem("token", token)
                    localStorage.setItem("user", JSON.stringify(user))
                    ctx.commit("auth_success", {
                        user: user,
                        token: token,
                    })
                    resolve(responce)
                }).catch((error) => {
                    localStorage.removeItem("token")
                    reject(error)
                })
            })
        },
        logout(ctx){
            return new Promise((resolve) => {
                ctx.commit("logout")
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                let axios = Vue.prototype.$http
                delete axios.defaults.headers.common["Authorization"]
                resolve()
            })
        },
        getUserList(ctx){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/settings/user/list",
                    method: "GET",
                }).then((response) => {
                    let result = response.data.data

                    ctx.commit("getUsers", result)
                    resolve(response)
                }).catch((error) => {
                    if (error.response.status === 401){
                        ctx.dispatch("logout")
                    }
                    reject(error)
                })
            })
        },
        getGroupList(ctx){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/settings/group/list",
                    method: "GET",
                }).then((response) => {
                    let result = response.data.data

                    ctx.commit("getGroups", result)
                    resolve(response)
                }).catch((error) => {
                    if (error.response.status === 401){
                        ctx.dispatch("logout")
                    }
                    reject(error)
                })
            })
        },
        updateUser(ctx, user){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/settings/user/update",
                    method: "POST",
                    data: {
                        user_id: user.id,
                        group_id: user.group_id
                    }
                }).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    if (error.response.status === 401){
                        ctx.dispatch("logout")
                    }
                    reject(error)
                })
            })
        },
        getGroup(ctx, id){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/settings/group/" + id,
                    method: "GET",
                }).then((response) => {
                    let result = response.data.data
                    resolve(result)
                }).catch((error) => {
                    if (error.response.status === 401){
                        ctx.dispatch("logout")
                    }
                    reject(error)
                })
            })
        },
        getFullPermissions(ctx){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/settings/permissions/list",
                    method: "GET",
                }).then((response) => {
                    let result = response.data;
                    ctx.commit("getFullPermissions", result)
                    resolve(response)
                }).catch((error) => {
                    if (error.response.status === 401){
                        ctx.dispatch("logout")
                    }
                    reject(error)
                })
            })
        },
    },
}