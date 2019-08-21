import React, { Component,lazy,Suspense } from 'react';
import { Link,Route } from 'react-router-dom';
import { Layout,message,Spin } from 'antd';
import data from "../../utils/store";
import './css.less';
import logo from '../../assets/image/logo.png'
//引入请求id合法的方法
import { reqValidateUser } from '../../api/index';
import NavLeft from '../../nav-left/NavLeft';
import HeaderMain from '../../nav-left/HeaderMain';
import { getItem } from '../../utils/storage';
import { connect } from 'react-redux';
import { saveUser } from '../../redux/action-creators';
//const应该放在import下面 语法规定
const Home = lazy(() => import(/*webpackChunkName : "home" , webpackPrefetch*/'../home/Home'));
const Category = lazy(() => import(/*webpackChunkName : "category"*/'../category/Category'));
const Product = lazy(() => import(/*webpackChunkName : "product"*/'../product/Product'));
const User = lazy(() => import(/*webpackChunkName : "role"*/'../role/index'));
const Role = lazy(() => import(/*webpackChunkName : "user"*/'../user/index'));
const ChartsBar = lazy(() => import(/*webpackChunkName : "chartsBar"*/'../charts/chartsBar'));
const ChartsLine = lazy(() => import(/*webpackChunkName : "chartsLine"*/'../charts/chartsLine'));
const ChartsPie = lazy(() => import(/*webpackChunkName : "chartsPie"*/'../charts/chartsPie'));

/*webpackPrefetch 的意思是 偷偷加载这个组件内容 预加载*/


/*import Home from '../home/Home';
import Category from '../category/Category';
import Product from '../product/Product';
import User from '../role/index';
import Role from '../user/index';
import ChartsBar from '../charts/chartsBar';
import ChartsLine from '../charts/chartsLine';
import ChartsPie from '../charts/chartsPie';*/

//懒加载 引入资源时让他让需加载 我需要加载这个文件的时候让它加载
const { Header, Content, Footer, Sider } = Layout;



//生命周期函数遇到异步代码 不会等待 和没写一样 发送ajax请求是异步代码
//以下方法是定义的一个方法 需要拿到返回值 在render方法中进行渲染

class Admin extends Component {
    //因为有页面变化  所以需要定义状态
    state = {
        isLoading: true,
        collapsed: false,
        isDisplay: "block"
    };
    onCollapse = collapsed => {
        this.setState({
            collapsed:!this.state.collapsed,
            isDisplay: collapsed ? "none" : "block"
        });
    };
    checkUserLogin = () => {
        if (!this.props.user._id) {
            //现在不是在组件内存中读取状态  是在redux里面读取状态
            const user = getItem();
            //把json字符转化为对象
            if (!user) {
                //如果本地没有数据
                this.props.history.replace('/login');
                return true;
            }
            //下面代码是向服务器发送请求 判断id是否合法 下面代码是异步方法 ajax请求
            reqValidateUser(user._id)//对象里面的id
                .then(() => {
                    /*data.user = user;*/
                    this.props.saveUser(user);
                    this.setState({
                        isLoading: false
                    })
                })
                .catch(() => {
                    message.error('请先登入',3);
                    this.props.history.replace('/login');
                });
            return true;
        }else {
            return false;
        }
    };
    render() {
        //重点 状态改变以后 重新渲染组件 调用render()方法
        const isLoading = this.checkUserLogin();
        const { isDisplay } = this.state;
        if (isLoading) return <Spin tip="Loading..." size="large" className="admin-loading"/>;
        return <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                <Link to="/home" className="admin-logo">
                    <img src={logo} alt="logo"/>
                    <h1 style={{display:isDisplay}}>尚硅谷后台</h1>
                </Link>
                <NavLeft />
                {/*左侧导航部分动态生成*/}
            </Sider>
            {/*左边导航部分Sider*/}
            <Layout>
                <Header className="header">
                    <HeaderMain />
                </Header>
                <Content style={{ margin: '70px 50px' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 550 }} className="content">
                        <Suspense fallback={<Spin tip="Loading..." size="large" className="admin-loading"/>}>
                            <Route path="/home" component={Home}/>
                            <Route path="/category" component={Category}/>
                            <Route path="/product" component={Product}/>
                            <Route path="/user" component={User}/>
                            <Route path="/role" component={Role}/>
                            <Route path="/charts/bar" component={ChartsBar}/>
                            <Route path="/charts/line" component={ChartsLine}/>
                            <Route path="/charts/pie" component={ChartsPie}/>
                        </Suspense>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
            {/*头部 内容 底部 以上Layout*/}
        </Layout>
        //以上判断id的目的是为了防止用户直接连接网址 跳过登入 所以通过id来判断用户是否登入过
    }
}
export default connect(
    (state) => ({user: state.user}),
    { saveUser }
)(Admin)
//connect 使用高阶组件 使得组件中有状态  和 改变