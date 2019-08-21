//创建几个生成action对象的工厂函数
import {SAVE_USER,REMOVE_USER} from './action-types';
//生成保存数据的方法的工厂函数
export const saveUser = (user) => ({type:SAVE_USER,data:user});

//下面是生成数据删除的工厂函数
export const removeUser = () => ({type: REMOVE_USER});

//这上面三个方法  在哪使用在哪里引入



