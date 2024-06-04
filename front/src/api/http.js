import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8081';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.interceptors.request.use((config) => {
    // config 是 axios 配置对象
    // 获取token
    let token = window.localStorage.getItem('token');
    // 添加token
    token && (config.headers.Authorization = token)
    return config;
}, (error) => {
    // 请求出错
    return Promise.reject(error);
});


axios.interceptors.response.use((response) => {
    // 响应成功，根据后台返回数据统一处理错误码
    switch (response.data.code) {
        case 5005:
            // 提示内容及操作
            ElementUI.Message({
	            message: "登录超时，请重新登录验证！",
	            type: 'warning'
	        });
	        router.push('/login')
            break;
        case 401:
            // 提示内容及操作
            break;
        // 更多状态提示...
    }
    return response;
}, (error) => {
    // 响应失败
    return Promise.reject(error);
})


Vue.prototype.$http = axios