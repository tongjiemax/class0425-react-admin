import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu,Icon,Layout,message,Spin } from 'antd';
import data from "../../utils/store";
import './css.less';
import logo from '../../assets/image/logo.png'
//引入请求id合法的方法
import { reqValidateUser } from '../../api/index';
import NavLeft from '../../nav-left/NavLeft';
import HeaderMain from '../../nav-left/HeaderMain';
//const应该放在import下面 语法规定
const { Header, Content, Footer, Sider } = Layout;



//生命周期函数遇到异步代码 不会等待 和没写一样 发送ajax请求是异步代码
//以下方法是定义的一个方法 需要拿到返回值 在render方法中进行渲染

export default class Admin extends Component {
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
        if (!data.user._id) {
            const user = JSON.parse(localStorage.getItem('user'));
            //把json字符转化为对象
            if (!user) {
                //如果本地没有数据
                this.props.history.replace('/login');
                return true;
            }
            //下面代码是向服务器发送请求 判断id是否合法 下面代码是异步方法 ajax请求
            reqValidateUser(user._id)//对象里面的id
                .then(() => {
                    data.user = user;
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
                <Content style={{ margin: '0 16px' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>Bill is a cat.</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
            {/*头部 内容 底部 以上Layout*/}
        </Layout>
        //以上判断id的目的是为了防止用户直接连接网址 跳过登入 所以通过id来判断用户是否登入过
    }
}