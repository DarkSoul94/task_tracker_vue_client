import { Promise } from "core-js"
import Vue from "vue"

export default{
    state:{
        categoryList: [],
    },
    getters:{
        categoryList: (state) => state.categoryList,
    },
    mutations:{
        getCategories(state, categories){
            state.categoryList = categories
        },
    },
    actions:{
        getCategoryList(ctx){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/category/list",
                    method: "GET",
                }).then((response) => {
                    let result = response.data.data

                    ctx.commit("getCategories", result)
                    resolve(result)
                }).catch((error) => {
                    if (error.response.status === 401){
                        ctx.dispatch("logout")
                    }
                    reject(error)
                })
            })
        }
    },
}