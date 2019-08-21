import React, {Component} from 'react';
import { Button,Modal,message } from 'antd';
import './index.less';
import { removeItem } from '../utils/storage';
import data from '../utils/store'
import { withRouter } from 'react-router-dom';
import { menuList } from '../config/index';
import dayjs from 'dayjs';
import { reqWeather } from '../api/index'
class HeaderMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            time: this.getTime(),
            weather: '晴',
            dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/qing.png'
        }

    }
    logOut = () => {
        Modal.confirm({
            title: '您确定要退出吗?',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                //移除本地数据
                removeItem();
                data.user = {};
                //跳转到登入
                this.props.history.replace('/login');
            },
        });
    };
    //当前时间不断的改变 所以设置计时器处理
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                time: this.getTime()
            })
        },1000);
        reqWeather("深圳")
            .then((res) => {
                //成功的promise 参数为resolve的值
                message.success("更新天气成功");
                this.setState(res)
            })
            .catch((err) => {
                message.error(err,3)
            })
    }
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.timer);
    }

    //初始化和更新都需要渲染
    //定义一个获取时间的方法
    getTime = () => {
        return dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    };
    static getDerivedStateFromProps(nextProps, prevState) {
        const { pathname } = nextProps.location;
        //点击登入 一开始跳转到首页
        if (pathname === '/') {
            return {
                title: "首页"
            }
        }
        for (let i = 0; i < menuList.length; i++) {
            const menu = menuList[i];
            if (menu.children) {
                //二级组件
                const children = menu.children;
                for (let j = 0; j < children.length; j++) {
                    const cMenu = children[j];
                    if (cMenu.key === pathname) {
                        return {
                            title:cMenu.title
                        }
                    }
                }
            }else {
                //一级组件
                if (menu.key === pathname) {
                    return {
                        title: menu.title
                    }
                }
            }
        }
    }
    render() {
        return <div className="header-main">
            <div className="header-main-top">
                <span>欢迎{data.user.username}</span>
                <Button type="link" onClick={this.logOut}>退出</Button>
            </div>
            <div className="header-main-bottom">
                <h3>{this.state.title}</h3>
                <div className="header-main-bottom-right">
                    <span>{this.state.time}</span>
                    <img src={this.state.dayPictureUrl}/>
                    <span>{this.state.weather}</span>
                </div>
            </div>
        </div>
    }
}
export default withRouter(HeaderMain);