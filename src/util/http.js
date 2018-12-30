import axios from 'axios'
import {domain} from '@/config'
import storage from '@/util/storage'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.post['Content-Type'] = 'application/json'

const instance = axios.create({
    baseURL: domain.api,
    headers: {
    }
})

instance.interceptors.request.use(
    config => {
        let token = storage.get('accessToken')
        if (token) {
            console.log('有' + token)
            config.headers.Authorization = token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    })

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
instance.interceptors.response.use(
        response => {
            return response
        },
        error => {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        alert(1)
                        // 这里写清除token的代码
                        // router.replace({
                        //     path: 'login',
                        //     query: {redirect: router.currentRoute.fullPath}   //登录成功后跳入浏览的当前页面
                        // })
                }
            }
            return Promise.reject(error.response.data)
        })

export default instance
