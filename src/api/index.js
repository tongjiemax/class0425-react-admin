//定义请求登入的方法

import axiosInstance from './ajax';

export const reqLogin = (username,password) => axiosInstance.post('/login',{username, password});

//定义一个请求id的方法

export const reqValidateUser = (id) => axiosInstance.post('/validate/user', {id});
