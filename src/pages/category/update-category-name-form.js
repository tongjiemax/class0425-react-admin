import React, { Component } from 'react';
import { Form,Input } from 'antd';
import PropTypes from 'prop-types';
const { Item } = Form;
class UpdateCategoryNameForm extends Component {
    static propTypes = {
        category:PropTypes.object.isRequired
    };
    validator = (rule,value,callback) => {
        if (!value) {
            callback("输入的值不能为空")
        }else if (value === this.props.name) {
            callback("两次输入的值不相等")
        }else {
            callback()
        }
    };
    render() {
        const { form : { getFieldDecorator },category : { name } } = this.props;
        console.log(name);
        return <Form>
            <Item>
                {
                    getFieldDecorator(
                        'categoryName',
                        {
                            initialValue: name,
                            rules: [
                                {validator: this.validator}
                            ]
                        }
                    )(
                        <Input />
                    )
                }
            </Item>
        </Form>
    }
}
export default Form.create()(UpdateCategoryNameForm);