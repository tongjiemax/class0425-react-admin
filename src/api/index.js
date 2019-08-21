//定义请求登入的方法

import axiosInstance from './ajax';
import jsonp from 'jsonp';

export const reqLogin = (username,password) => axiosInstance.post('/login',{username, password});

//定义一个请求id的方法

export const reqValidateUser = (id) => axiosInstance.post('/validate/user', {id});


//定义请求天气的方法

export const reqWeather = (cityName) => {
    return new Promise((resolve, reject) => {
        jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=${cityName}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
            {},
            function (err,data) {
                //data代表请求成功的数据
                if (err) {
                    //失败
                    reject("请求失败")
                }else {
                    const {weather,dayPictureUrl} = data.results[0].weather_data[0];
                    resolve({
                        weather,
                        dayPictureUrl
                    })
                }
            })
    })
};

//获取分类列表
export const reqGetCategory = (parentId) => axiosInstance.get('/manage/category/list', {
    params: {
        parentId
    }
});

//添加分类的请求方法
export const reqAddCategory = (parentId, categoryName) => axiosInstance.post('/manage/category/add', {parentId, categoryName});

//定义一个修改名称的请求方法

export const reqUpdataCategory = (categoryId, categoryName) => axiosInstance.post('/manage/category/update', {categoryId, categoryName});

//定义一个获取产品列表的方法 这种方式是后台请求数据
export const reqGetProduct = (pageNum,pageSize) => axiosInstance.get('manage/product/list', {
    params: {
        pageNum,
        pageSize
    }
});
//定义了一个添加商品的方法
export const reqAddProduct = ({ name, desc, price, detail, categoryId, pCategoryId }) => axiosInstance.post('/manage/product/add', { name, desc, price, detail, categoryId, pCategoryId });

//定义一个添加角色的方法

export const reqAddRole = (name) => axiosInstance.post('/manage/role/add', { name });

//获取角色列表

export const reqGetRole = () => axiosInstance.get('/manage/role/list');

