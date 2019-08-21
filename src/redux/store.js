import { createStore,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';//处理异步代码的逻辑
import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';


const store = createStore(reducers,composeWithDevTools(applyMiddleware(thunk)));
export default store;