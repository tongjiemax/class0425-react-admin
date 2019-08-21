//这个模块是编辑模板板块 还要进行编辑器的校验

import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import PropTypes from 'prop-types';
import htmlToDraft from 'html-to-draftjs';
import './index.less'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class EditorConvertToHTML extends Component {
    static propTypes = {
        editorChange: PropTypes.func.isRequired
    };
    state = {
        editorState: EditorState.createEmpty(),
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
            //editorState,这个是我编辑器实时写入的值
        });
        //用收集数据的方法把value值给到父组件的value值 然后 就可以进行校验
        const text = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.props.editorChange(text)
    };

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}

                    editorClassName="product-editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
                {/*<textarea
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />*/}
                {/*上面注释代码 是把里面输入的值 转化为下面的html框进行显示*/}
            </div>
        );
    }
}