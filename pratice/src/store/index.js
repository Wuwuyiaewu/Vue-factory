import { createStore } from 'vuex'

export default createStore({
    state: {
        time_change: 0
    },
    getters: {},
    mutations: {
        time_mutation(state, payload) {
            state.time_change += payload
        }
    },
    actions: {
        time_action(context, payload) {
            context.commit('time_mutation', payload)
        }
    },
    modules: {}
})