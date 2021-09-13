import { Promise } from "core-js"
import Vue from "vue"

export default{
    state:{
        taskList: [],
        taskStatuses: [],
        trackTaskID: 5,
    },
    getters:{
        taskList: (state) => state.taskList,
        taskStatuses: (state) => state.taskStatuses,
        isTrack: (state) => !!state.trackTaskID,

    },
    mutations:{
        getTasks(state, tasks){
            state.taskList = tasks
        },
        getTaskStatuses(state, statuses){
            state.taskStatuses = statuses
        },
        setTreckedTask(state, taskID){
            state.trackTaskID = taskID;
        },
    },
    actions:{
        createTask(ctx, task){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/tasks",
                    method: "POST",
                    data: task,
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
        updateTask(ctx, task){
            return new Promise((resolve, reject) =>{
                let axios = Vue.prototype.$http
                axios({
                    url: "",
                    method: "POST",
                    data: task
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
        getTask(ctx, taskID){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/tasks/task",
                    method: "GET",
                    params: {
                        id: taskID
                    }
                }).then((response) => {
                    resolve(response.data.data)
                }).catch((error) => {
                    if (error.response.status === 401) {
                        ctx.commit("logout")
                      }
                    reject(error)
                })
            })
        },
        getTaskList(ctx){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/tasks",
                    method: "GET",
                }).then((response) => {
                    let result = response.data.data

                    for(let task of result){
                        task.creation_date = new Date(task.creation_date)
                      }
                
                    ctx.commit("getTasks", result)
                    resolve(result)
                }).catch((error) => {
                    if (error.response.status === 401){
                        ctx.dispatch("logout")
                    }
                    reject(error)
                })
            })
        },
        getTaskStatusList(ctx){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/tasks/statuses",
                    method: "GET",
                }).then((response) => {
                    let result = response.data.data
                    ctx.commit("getTaskStatuses", result)
                    resolve(response)
                }).catch((error) => {
                    if (error.response.status === 401){
                        ctx.dispatch("logout")
                    }
                    reject(error)
                })
            })
        },
        trackTask(ctx, track){
            return new Promise((resolve, reject) => {
                let axios = Vue.prototype.$http
                axios({
                    url: "/task_tracker/tasks/track",
                    method: "POST",
                    data: track
                }).then((response) => {
                    resolve(response)
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