//这个模块 是 你需要更新的数据的方法 表示状态  对同一种数据进行不同的操作 所以有swith 所以根据判断来 显示改变更新数据

import {SAVE_USER,REMOVE_USER} from "./action-types";
import {combineReducers} from 'redux';
function user(prevState = {}, action) {
    switch (action.type) {
        case SAVE_USER:
            return action.data;
        case REMOVE_USER:
            return {};
        default:
            return {}
    }
}
export default combineReducers({
    user
    //把返回要更新的状态 放在store的state里面  其实就是
    //state = {
    // user： XXX}
    //在高阶组件中 (state) => ({user:state.user})
})