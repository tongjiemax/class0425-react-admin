import React,{Component} from 'react';
import { Form,Input,Select } from 'antd';
import PropTypes from 'prop-types';
const { Option } = Select;
const { Item } = Form;
class AddCategoryForm extends Component{
    static propTypes = {
        categories:PropTypes.array.isRequired
    };
    render() {
        const { categories,form:{ getFieldDecorator } } = this.props;
        return <Form>
                <Item label="所属分类">
                    {
                        getFieldDecorator(
                            'parentId',
                            {
                                initialValue: '0'
                            }
                        )(
                            <Select>
                                <Option key="0" value="0">一级分类</Option>
                                {
                                    categories.map((item) => {
                                        return <Option key={item._id} value={item._id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        )
                    }
            </Item>
            <Item label="分类名称">
                {
                    getFieldDecorator(
                        'categoryName',
                        {
                            rules: [
                                { required:true,message: '请输入分类' }
                            ]
                        }
                    )(
                        <Input/>
                    )
                }
            </Item>
        </Form>
    }
}
export default Form.create()(AddCategoryForm);