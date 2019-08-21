import React, {Component} from 'react';
import { Link,withRouter } from "react-router-dom";
import {Icon, Menu} from "antd";
import { menuList } from '../config/index'
const { SubMenu } = Menu;
const { Item } = Menu;
class NavLeft extends Component {
    constructor(props) {
        super(props); // 必须声明prop，否则this.props就是undefined
        //三级路由需要使用startsWith来进行判断
        let { pathname } = this.props.location;
        if (pathname.startsWith('/product')) {
            pathname = '/product'
        }
        this.menus = this.createMenu(pathname);

        this.state = {
            selectedKey: ''
        }
    }
    static getDerivedStateFromProps(nextProps) {
        let { pathname } = nextProps.location;
        if (pathname.startsWith('/product')) {
            pathname = '/product'
        }
        return {
            selectedKey: pathname
        }
    }
    createList = (menu) => {
        console.log(menu);
        return <Item key={menu.key}>
            <Link to={menu.key}>
                <Icon type={menu.icon} />
                <span>{menu.title}</span>
            </Link>
        </Item>
        /*return可以调用方法得到的结果*/
    };
    createMenu = (path) => {
        return menuList.map((menu) => {
            if (menu.children) {
                //如果有是二级组件
                return <SubMenu
                    key={menu.key}
                    title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>}>
                    {
                        //在里面进行map
                        menu.children.map((item) => {
                            if (path === item.key) {
                                this.newKey = menu.key;
                            }
                            return this.createList(item)
                        })
                    }
                </SubMenu>
            }else {
                //是一级组件
                return this.createList(menu)
            }
        })
    };
    render() {
        /*defaultOpenKeys展开那个组件的方法*/
        return <Menu theme="dark" selectedKeys={[this.state.selectedKey]} defaultOpenKeys={[this.newKey]} mode="inline">
            {
                //在组件内 数组可以自己展开
                //path跟里面的key地址相同 刷新是定在那里 defaultOpenKeys表示展开哪个组件
                this.menus
            }
        </Menu>
    }
}
export default withRouter(NavLeft)