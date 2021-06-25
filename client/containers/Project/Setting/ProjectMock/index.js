import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Switch, Button, Icon, Tooltip, message } from 'antd';
import AceEditor from '../../../../components/AceEditor/AceEditor';
const FormItem = Form.Item;
import { updateProjectMock, getProject } from '../../../../reducer/modules/project';
import intl from "react-intl-universal";

const formItemLayout = {
  labelCol: {
    sm: { span: 4 }
  },
  wrapperCol: {
    sm: { span: 16 }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 16,
      offset: 11
    }
  }
};

@connect(
  state => {
    return {
      projectMsg: state.project.currProject
    };
  },
  {
    updateProjectMock,
    getProject
  }
)
@Form.create()
export default class ProjectMock extends Component {
  static propTypes = {
    form: PropTypes.object,
    match: PropTypes.object,
    projectId: PropTypes.number,
    updateProjectMock: PropTypes.func,
    projectMsg: PropTypes.object,
    getProject: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      is_mock_open: false,
      project_mock_script: ''
    };
  }

  handleSubmit = async () => {
    let params = {
      id: this.props.projectId,
      project_mock_script: this.state.project_mock_script,
      is_mock_open: this.state.is_mock_open
    };

    let result = await this.props.updateProjectMock(params);

    if (result.payload.data.errcode === 0) {
      message.success(intl.get('ProjectMock.index.保存成功'));
      await this.props.getProject(this.props.projectId);
    } else {
      message.success(intl.get('ProjectMock.index.保存失败,') + result.payload.data.errmsg);
    }
  };

  componentWillMount() {
    this.setState({
      is_mock_open: this.props.projectMsg.is_mock_open,
      project_mock_script: this.props.projectMsg.project_mock_script
    });
  }

  // 是否开启
  onChange = v => {
    this.setState({
      is_mock_open: v
    });
  };

  handleMockJsInput = e => {
    this.setState({
      project_mock_script: e.text
    });
  };

  render() {
    return (
      <div className="m-panel">
        <Form>
          <FormItem
            label={
              <span>
                {intl.get('ProjectMock.index.是否开启&nbsp;')}<a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://hellosean1025.github.io/yapi/documents/project.html#%E5%85%A8%E5%B1%80mock"
                >
                  <Tooltip title={intl.get('ProjectMock.index.点击查看文档')}>
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </a>
              </span>
            }
            {...formItemLayout}
          >
            <Switch
              checked={this.state.is_mock_open}
              onChange={this.onChange}
              checkedChildren={intl.get('ProjectMock.index.开')}
              unCheckedChildren={intl.get('ProjectMock.index.关')}
            />
          </FormItem>
          <FormItem label={intl.get('ProjectMock.index.Mock脚本')} {...formItemLayout}>
            <AceEditor
              data={this.state.project_mock_script}
              onChange={this.handleMockJsInput}
              style={{ minHeight: '500px' }}
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
              {intl.get('ProjectMock.index.保存')}</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
