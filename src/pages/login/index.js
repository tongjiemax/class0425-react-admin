import React, { Component } from 'react';
import { Form, Input, Icon, Button,message } from 'antd';

import { reqLogin } from '../../api/index'
import logo from '../../assets/image/logo.png';
import data from '../../utils/store';
import './logo.less';
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
                        data.user = response;
                        //也把数据存到本地
                        //response是对象 对象转化为JSON字符串
                        localStorage.setItem('user',JSON.stringify(response));

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
                               /* {
                                    required: true,//不能为空
                                    message: '请输入用户名'
                                },
                                {
                                    min: 4,
                                    message: '最小不能少于4'
                                },
                                {
                                    max: 10,
                                    message: '不能超过10'
                                }*/
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
export default Form.create()(Login);