import axios from 'axios';


//判断是生成环境 还是开发环境

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:5000';

//创建axis实例对象

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

//设置拦截器 在返回前处理信息
axiosInstance.interceptors.response.use(
    (response) => {
        const result = response.data;
        if (result.status === 0) {
            return result.data || {};
        }else {
            //这里面表示校验成功了 但是可能密码不对
            //返回失败的Promise 执行catch方法
            return Promise.reject(result.msg || '重新试试');
        }
    },
    //请求失败后的响应
    (error) => {
        return Promise.reject('网络出现故障 请刷新试试');
    }
);

export default axiosInstance;