import React,{ Component,Fragment } from 'react';
//这个模块是添加商品具体信息的模块
import { Cascader,Icon,Card,Input,InputNumber,Button,message,Form } from 'antd';
import EditorConvertToHTML from './rich-text-editor';
import { reqGetCategory } from '../../../api/index';
import { reqAddProduct } from '../../../api/index';
const { Item } = Form;
class Save extends Component {
    state = {
        options: [],
        id:[]
    };
    submit = (e) => {
        e.preventDefault();
        //当进行提交时 进行表单验证 成功则跳转到/product/index 失败则重复操作 通过验证
        //以上操作的前提时编辑器的校验成功
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                const { name, desc, price, id, detail } = values;
                let pCategoryId, categoryId;
                // 得到categoryId / pCategoryId
                if (id.length === 1) {
                    pCategoryId = 0;
                    categoryId = id[0];
                } else {
                    pCategoryId = id[0];
                    categoryId = id[1];
                }
                //这里是添加商品的请求方法
                reqAddProduct({ name, desc, price, detail, categoryId, pCategoryId })
                    .then((res) => {
                        message.success('添加商品成功');
                        this.props.history.push('/product/index')
                    })
                    .catch(() => {
                        message.error('添加商品失败',3)
                    })
            }

        });

    };
    //第二步写编辑器
    componentDidMount() {
        reqGetCategory(0)
            .then((res) => {
                this.setState({
                    options: res.map((item) => {
                        return {
                            label:item.name,
                            value:item._id,
                            //value:item._id 因为当我添加商品请求时 需要id作为请求参数
                            isLeaf: false,
                        }
                    })
                })
            })
            .catch((err) => {
                message.error(err,3)
            })

    }
    loadData = (selectedOptions) => {
        // 找到最后一级菜单对象
        const targetOption = selectedOptions[selectedOptions.length - 1];
        // 给最后一级菜单对象添加了loading属性 --> 加载中图标显示
        targetOption.loading = true;

        // 发送请求，请求二级分类数据
        reqGetCategory(targetOption.value)
            .then((res) => {
                // 不要loading图标
                targetOption.loading = false;
                if (res.length === 0) {
                    targetOption.isLeaf = true;
                } else {
                    targetOption.children = res.map((category) => {
                        return {
                            label: category.name,
                            value: category._id,
                        }
                    });
                }
                // 更新状态 -- 重新渲染组件 -- 从而看到最新的二级分类
                this.setState({
                    options: [...this.state.options],
                });
            })
            .catch(() => {
                message.error('加载二级列表失败', 3);
            })


    };
    //在父组件中定义一个收集表单数据的方法
    editorChange = (text) => {
        console.log(text);
        this.props.form.setFields({
            detail:{
                value: text
            }
        })
    };
    goBack = () => {
        this.props.history.goBack()
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { options } = this.state;
        const { state } = this.props.location;
        const isShow = !!state;
        let id;
        if (isShow) {
            //修改商品 有数据
            //接下来判断 是否显示一级id 或者 二级id
            if (+state.pCategoryId === 0) {
            //里面只显示了一级元素
                id = [state.categoryId]
            }else {
             //里面不但有一级元素 还有二级元素
                id = [state.pCategoryId,state.categoryId]
            }
        }else {
            //添加商品 为空
            id = []
        }
        return <Card title={<Fragment><Icon type="arrow-left" onClick={this.goBack}/>&nbsp;&nbsp;&nbsp;{isShow ? '修改' : '添加'}商品</Fragment>}>
            <Form labelCol={{span:2}} wrapperCol={{span:8}} onSubmit={this.submit}>
                <Item label="商品名称">
                    {
                        getFieldDecorator(
                            'name',
                            {
                                rules:[
                                    {
                                        required : true , message:"输入的内容不能为空"
                                    }
                                ],
                                initialValue : isShow ? state.name : ''
                            }
                        )(
                            <Input placeholder="请输入商品名称" />
                        )
                    }
                </Item>
                <Item label="商品描述">
                    {
                        getFieldDecorator(
                            'desc',
                            {
                                rules:[
                                    {
                                        required : true , message:"输入的内容不能为空"
                                    }
                                ],
                                initialValue : isShow ? state.desc : ''
                            }
                        )(
                            <Input placeholder="请输入商品描述" />
                        )
                    }
                </Item>
                <Item label="商品分类">
                    {
                        getFieldDecorator(
                            'id',
                            {
                                rules:[
                                    {
                                        required : true , message:"输入的内容不能为空"
                                    }
                                ],
                                initialValue: id
                            }
                        )(
                            <Cascader
                                options={options}
                                loadData={this.loadData}
                            />

                        )
                    }
                </Item>
                <Item label="商品价格">
                    {
                        getFieldDecorator(
                            'price',
                            {
                                rules: [
                                    {
                                        required : true , message:"输入的内容不能为空"
                                    }
                                ],
                                initialValue : isShow ? state.price : ''
                            }
                        )(
                            <InputNumber
                                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/￥\s?|(,*)/g, '')}
                            />
                        )
                    }
                </Item>
                <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:20}}>
                    {
                        getFieldDecorator(
                            'detail',
                            {
                                rules:[
                                    {
                                        required : true , message:"输入的内容不能为空"
                                    }
                                ]
                            }
                        )(
                            <EditorConvertToHTML editorChange={this.editorChange}/>
                        )
                    }
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Item>
            </Form>
        </Card>
    }
}

export default Form.create()(Save)