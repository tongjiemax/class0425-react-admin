import React, { Component } from 'react';
import { Form, Input, Icon, Button,message } from 'antd';
import { connect } from 'react-redux';
import { reqLogin } from '../../api/index'
import logo from '../../assets/image/logo.png';
import data from '../../utils/store';
import './logo.less';
import { setItem } from '../../utils/storage';
import {saveUser} from "../../redux/action-creators";
const Item = Form.Item;
class Login extends Component {
    //以下函数时登入功能提交的实现
    login = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //err表示错误
                //value 代表具体的值
                //没有错误 校验成功
                const {username,password} = values;
                reqLogin(username,password)
                    .then((response) => {
                        console.log(response);
                        //下一步 储存数据到内存里面
                        //data.user = response;
                        this.props.saveUser(response);
                        //也把数据存到本地
                        //response是对象 对象转化为JSON字符串
                        setItem(response);

                        this.props.history.replace('/')
                    })
                    .catch((error) => {
                        message.success(error,3);
                        this.props.form.resetFields(['password'])
                    })
            }
        });
    };
    validator = (rule, value, callback) => {
        //rule 校验的是哪一个
        //value校验的值
        //返回的具体提示
        const name = rule.field === 'username'?'用户名':'密码';

        if (!value) {
            callback(`${name}输入的值不能为空`);
        }else if (value.length < 4) {
            callback(`${name}输入的值不能少于4`);
        }else if (value.length > 10) {
            callback(`${name}输入的值不能超过10`);
        }
        callback();
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return <div className="login">
            <header>
                <img src={logo} alt="logo"/>
                <h1>React项目: 后台管理系统</h1>
            </header>
            <section className="login-section">
                <h2>用户登入</h2>
                <Form onSubmit={this.login}>
                    <Item>
                        {getFieldDecorator(
                            'username',
                            {
                            rules: [
                                {validator: this.validator}
                                ],
                        })(
                            <Input prefix={<Icon type="user"/>} placeholder="用户名"/>
                        )}
                    </Item>
                    <Item>
                        {getFieldDecorator(
                            'password',
                            {
                            rules: [{validator: this.validator}],
                        })(
                            <Input prefix={<Icon type="lock"/>} placeholder="密码"/>
                        )}
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit" className="login-btn">登入</Button>
                    </Item>
                </Form>
            </section>
        </div>
    }
}
export default connect(
    //登入前内存里面没有存数据 默认值是一个空对象 直接写null'
    null,
    { saveUser }
)(
    Form.create()(Login)
)