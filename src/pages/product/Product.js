import React, { Component } from 'react';

import { Route,Switch,Redirect } from 'react-router-dom';

import Detail from './detail/index';
import Index from './index/index';
import Save from './save-updata/index'

export default class Product extends Component {
    render() {
        return <Switch>
            <Route path="/product/index" component={Index}/>
            <Route path="/product/detail" component={Detail}/>
            <Route path="/product/saveupdate" component={Save}/>
            <Redirect to="/product/index"/>
            {/*重定向 跳转到路径是/product/index的组件*/}
        </Switch>;
    }
}