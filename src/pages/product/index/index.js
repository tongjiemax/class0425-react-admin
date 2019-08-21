import React,{ Component,Fragment } from 'react';

import { Card,Select,Input,Button,Icon,Table,message } from 'antd';
import { reqGetProduct } from '../../../api/index';

import './index.less'
const { Option } = Select;
export default class Index extends Component {
    state = {
        products: []
    };
    columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
        },
        {
            title: '商品描述',
            dataIndex: 'desc',
        },
        {
            title: '价格',
            dataIndex: 'price',
        },
        {
            title: '状态',
            /*dataIndex: 'name', 这个对应的是数据 如果没有这个属性 则内容就是render返回的值*/
            render: (product) => {
                return <Fragment>
                    <Button type="primary">上架</Button>
                    &nbsp;&nbsp;&nbsp;已下架
                </Fragment>
            }
        },
        {
            title: '操作',
            render: (product) => {
                return <Fragment>
                    <Button type="link">详情</Button>
                    <Button type="link" onClick={this.addChange(product)}>修改</Button>
                </Fragment>
            }
        },
    ];
    addChange = (product) => {
        return () => {
            //通过闭包的方式把product保存在函数里面
            this.props.history.push('/product/saveupdate',product)
        }
    };
    componentDidMount() {
        //pageNum,pageSize 如何这两个请求参数
        reqGetProduct(1,3)
            .then((res) => {
                message.success("获取列表成功")
                this.setState({
                    products: res.list
                })
            })
            .catch((err) => {
                message.error(err,3)
            })
    }
    goSaveUpdate = () => {
        this.props.history.push('/product/saveupdate')
    };
    render() {
        const { products } =this.state;
        return <Card title={
            <Fragment>
                <Select>
                    <Option key="1" value="1">根据商品名称</Option>
                    <Option key="2" value="2">根据商品描述</Option>
                </Select>
                <Input placeholder="关键字" className="input"/>
                <Button type="primary">搜索</Button>
            </Fragment>
        } extra={<Button type="primary" onClick={this.goSaveUpdate}><Icon type="plus"/>添加产品</Button>}>
            <Table
                columns={ this.columns }
                dataSource={products}
                bordered
                pagination={{
                    showQuickJumper: true, // 显示快速跳转
                    showSizeChanger: true, // 显示修改每页显示数量
                    pageSizeOptions: ['3', '6', '9', '12'], // 修改每页显示数量
                    defaultPageSize: 3 // 默认显示数量
                }}
                rowKey="_id"
            />
        </Card>
    }
}