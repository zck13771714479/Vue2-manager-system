import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, constantRoutes, anyRoutes, asyncRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        routes: [],
        buttons: [],
        roles: [],
        resutlAsyncRoutes: [],
        finalRoutes: [],
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INFO: (state, data) => {
        state.name = data.name;
        state.avatar = data.avatar;
        state.routes = data.routes;
        state.buttons = data.buttons;
        state.roles = data.roles;
    },
    SET_FINAL_ROUTES: (state, routes) => {
        state.resutlAsyncRoutes = routes;
        let tmp = constantRoutes.concat(state.resutlAsyncRoutes, anyRoutes);
        state.finalRoutes = tmp;
        router.addRoutes(state.finalRoutes);
    }
}

function computeAsyncRoute(async, routes) {
    return async.filter(item => {
        if (routes.indexOf(item.name) !== -1) {
            if (item.children && item.children.length > 0) {
                item.children = computeAsyncRoute(item.children, routes); //函数的返回值是数组，递归寻找
            }
            return true;
        }
    })
}
const actions = {
    // user login
    async login({ commit }, userInfo) {
        const { username, password } = userInfo
        let result = await login({ username: username.trim(), password: password });
        if (result.code == 20000) {
            //获取token，并放入仓库
            commit('SET_TOKEN', result.data.token);
            setToken(result.data.token);
            return 'ok';
        } else {
            return Promise.reject(new Error('fail'));
        }
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response
                // console.log(data);
                if (!data) {
                    return reject('Verification failed, please Login again.')
                }
                //通过token获取用户信息
                commit('SET_INFO', data);
                commit('SET_FINAL_ROUTES', computeAsyncRoute(asyncRoutes, data.routes));
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    async logout({ commit, state }) {
        let result = await logout(state.token);
        if (result.code == 20000) {
            removeToken() // must remove  token  first
            resetRouter()
            commit('RESET_STATE')
            return 'ok'
        } else {
            return Promise.reject('fail');
        }
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

