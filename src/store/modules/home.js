import mockRequest from '@/utils/mockRequest'
const actions = {
   async getData(context){
        let result = await mockRequest.get('/home/list')
        if(result.code == 20000){
            context.commit('GET_DATA',result.data);
        }
        
    }
};
const state = {
    homeResult:{},
};
const mutations = {
    GET_DATA(state,data){
        state.homeResult = data;
    }
};
const getters = {};

export default {
    namespaced: true,
    actions,
    state,
    mutations,
    getters
}