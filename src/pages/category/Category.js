import React, { Component,Fragment } from 'react';
import { Card,Button,Icon,Table,message,Modal  } from 'antd';
import { reqGetCategory } from '../../api/index';
import './index.less';
import AddCategoryForm from './add-category-form';
import { reqAddCategory } from '../../api/index';
import UpdateCategoryNameForm from './update-category-name-form';
import { reqUpdataCategory } from '../../api/index';
export default class Category extends Component {
    state = {
        categories: [],
        isShowAddCategory: false,
        isShowUpdateCategoryName: false,
        category: {},
        secondCategories: [],
        isShowSubCategory:false
    };
    addCategoryFormRef = React.createRef();
    updateCategoryNameFormRef = React.createRef();
    columns = [
        {
            title: '品类名称',
            dataIndex: 'name',
            /*render: text => <a>{text}</a>,*/
        },
        {
            title: '操作',
            className: 'column-money',
            /*dataIndex: 'operation',*/
            render: (category) => {
                return <Fragment>
                    <Button type="link" onClick={this.showUpdateCategoryName(category)}>修改名称</Button>
                    {
                        this.state.isShowSubCategory ? null : <Button type="link" onClick={this.handleCheck(category)}>查看其子品类</Button>
                    }
                </Fragment>
            }
        },
    ];
    handleCheck = (category) => {
        //查看其子品类的回调函数
        //请求二级分类的数据
        //这里需要使用闭包 在闭包中保存category
        return () => {
            reqGetCategory(category._id)
                .then((res) => {
                    console.log(res);
                    this.setState({
                        //定义一个二级数据的数组 进行页面展示
                        //给定一个状态值 看是否更新的是一个二级数据
                        //在把category更新为最开始的状态
                        secondCategories: res,
                        isShowSubCategory: true,
                        category
                    })
                })
                .catch((err) => {
                    message.error(err,3)
                })
        }
    };
    showUpdateCategoryName = (category) => {
        return () => {
            //通过闭包的方式把值存起来

            this.setState({
                isShowUpdateCategoryName: true,
                category
                //再把闭包的值传到子组件里面去
            })
        }
    };
    //以下方法时添加分类的方法
    addCategory = () => {
        //需要用From里面的方法 所以需要拿到From 用ref可以拿到其它组件的实例化对象
        this.addCategoryFormRef.current.validateFields((err,value) => {
            if (!err) {
                const { parentId, categoryName } = value;
                reqAddCategory(parentId,categoryName)
                    //首先判断现在在一级分类中 还是二级分类中
                    .then((res) => {
                        const { isShowSubCategory } = this.state;
                        const key = +parentId !== 0 ? 'secondCategories' : 'categories';
                        //是否为一级分类 还是 二级分类的添加类名 再该方法中来实现
                        if (!isShowSubCategory && +parentId !== 0) {
                            console.log(111);
                            return
                        }
                        message.success("添加分类成功",3);
                        this.setState({
                            [key]: [...this.state[key],res]
                        })
                        //关键：通过isShowSubCategory判断当前是否在哪个几级分类
                        //通过parentId判断请求的是一级分类 还是二级分类 如果请求的是一级分类 添加到一级分类的数组中 如果是二级分类
                        //添加到二级分类的数组里面去
                    })
                    .catch((err) => {
                        message.error(err,3)
                    })
                    .finally(() => {
                        this.setState({
                            isShowAddCategory: false
                        });
                        this.addCategoryFormRef.current.resetFields();
                    })
            }
        })
    };
    componentDidMount() {
        reqGetCategory(0)
            .then((res) => {
                this.setState({
                    categories:res
                })
            })
            .catch((err) => {
                message.error(err,3)
            })
    }
    handleClick = () => {
        this.setState({
            isShowAddCategory: true
        })
    };
    hideModal = (key) => {
        return () => {
            this.setState({
                [key]: false
            })
        }
    };
    //以下时修改类名的方法
    updateCategoryName = () => {
        this.updateCategoryNameFormRef.current.validateFields((err,values) => {
            if (!err) {
                const { categoryName } = values;
                const categoryId = this.state.category._id;
                reqUpdataCategory(categoryId, categoryName)
                    .then((res) => {
                        //数组保持不变 更新状态
                        const key = this.state.isShowSubCategory ? 'secondCategories' : 'categories';
                        this.setState({
                            [key]: this.state[key].map((item) => {
                                if (item._id === categoryId) {
                                    item.name = categoryName;
                                }
                                return item
                            })
                        })
                    })
                    .catch((err) => {
                        message.error(err,3)
                    })
                    .finally(() => {
                        this.setState({
                            isShowUpdateCategoryName: false
                        });
                        this.updateCategoryNameFormRef.current.resetFields();
                    })
            }
        })
    };
    goBack = () => {
        this.setState({
            isShowSubCategory: false
        })
    };
    render() {
        const { categories,isShowAddCategory,isShowUpdateCategoryName,category,secondCategories,isShowSubCategory } = this.state;
        return <div>
            <Card title={
                isShowSubCategory ? <div><Button type="link" onClick={this.goBack}>一级分类</Button><Icon type="arrow-right"/><span className="span">{category.name}</span></div> : "一级分类"
            } extra={<Button type="primary" onClick={this.handleClick}><Icon type="plus"/>添加品类</Button>}>
                <Table
                    columns={this.columns}
                    dataSource={ isShowSubCategory ? secondCategories : categories }
                    bordered
                    pagination={{
                        showQuickJumper: true, // 显示快速跳转
                        showSizeChanger: true, // 显示修改每页显示数量
                        pageSizeOptions: ['3', '6', '9', '12'], // 修改每页显示数量
                        defaultPageSize: 3 // 默认显示数量
                    }}
                    rowKey="_id"
                />
                <Modal
                    title="添加分类"
                    visible={isShowAddCategory}
                    onOk={this.addCategory}
                    onCancel={this.hideModal('isShowAddCategory')}
                    okText="确认"
                    cancelText="取消"
                >
                    <AddCategoryForm categories={categories} ref={this.addCategoryFormRef}/>
                </Modal>
                <Modal
                    title="更新分类"
                    visible={isShowUpdateCategoryName}
                    onOk={this.updateCategoryName}
                    onCancel={this.hideModal('isShowUpdateCategoryName')}
                    okText="确认"
                    cancelText="取消"
                    width={400}
                >
                    <UpdateCategoryNameForm  category = {category} ref={this.updateCategoryNameFormRef}/>
                </Modal>
            </Card>
        </div>;
    }
}
//接下来判断如果在一级标签里添加一级标签 则更新
//          如果在一级标签里添加二级标签 则不更新

//          如果在二级标签里添加二级标签 则更新
//          如果在二级标签里添加一级标签 则更新