import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Input, Icon, Tooltip, Select, message, Row, Col, Radio } from 'antd';
import { addProject } from '../../reducer/modules/project.js';
import { fetchGroupList } from '../../reducer/modules/group.js';
import { autobind } from 'core-decorators';
import { setBreadcrumb } from '../../reducer/modules/user';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import { pickRandomProperty, handlePath, nameLengthLimit } from '../../common';
import constants from '../../constants/variable.js';
import { withRouter } from 'react-router';
import './Addproject.scss';
import intl from "react-intl-universal";

const formItemLayout = {
  labelCol: {
    lg: { span: 3 },
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 21 },
    xs: { span: 24 },
    sm: { span: 14 }
  },
  className: 'form-item'
};

@connect(
  state => {
    return {
      groupList: state.group.groupList,
      currGroup: state.group.currGroup
    };
  },
  {
    fetchGroupList,
    addProject,
    setBreadcrumb
  }
)
@withRouter
class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [],
      currGroupId: null
    };
  }
  static propTypes = {
    groupList: PropTypes.array,
    form: PropTypes.object,
    currGroup: PropTypes.object,
    addProject: PropTypes.func,
    history: PropTypes.object,
    setBreadcrumb: PropTypes.func,
    fetchGroupList: PropTypes.func
  };

  handlePath = e => {
    let val = e.target.value;
    this.props.form.setFieldsValue({
      basepath: handlePath(val)
    });
  };

  // 确认添加项目
  @autobind
  handleOk(e) {
    const { form, addProject } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        values.group_id = values.group;
        values.icon = constants.PROJECT_ICON[0];
        values.color = pickRandomProperty(constants.PROJECT_COLOR);
        addProject(values).then(res => {
          if (res.payload.data.errcode == 0) {
            form.resetFields();
            message.success(intl.get('AddProject.AddProject.创建成功!'));
            this.props.history.push('/project/' + res.payload.data.data._id + '/interface/api');
          }
        });
      }
    });
  }

  async componentWillMount() {
    this.props.setBreadcrumb([{ name: intl.get('AddProject.AddProject.新建项目') }]);
    if (!this.props.currGroup._id) {
      await this.props.fetchGroupList();
    }
    if (this.props.groupList.length === 0) {
      return null;
    }
    this.setState({
      currGroupId: this.props.currGroup._id ? this.props.currGroup._id : this.props.groupList[0]._id
    });
    this.setState({ groupList: this.props.groupList });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="g-row">
        <div className="g-row m-container">
          <Form>
            <FormItem {...formItemLayout} label={intl.get('AddProject.AddProject.项目名称')}>
              {getFieldDecorator('name', {
                rules: nameLengthLimit(intl.get('AddProject.AddProject.项目'))
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label={intl.get('AddProject.AddProject.所属分组')}>
              {getFieldDecorator('group', {
                initialValue: this.state.currGroupId + '',
                rules: [
                  {
                    required: true,
                    message: intl.get('AddProject.AddProject.请选择项目所属的分组')
                  }
                ]
              })(
                <Select>
                  {this.state.groupList.map((item, index) => (
                    <Option
                      disabled={
                        !(item.role === 'dev' || item.role === 'owner' || item.role === 'admin')
                      }
                      value={item._id.toString()}
                      key={index}
                    >
                      {item.group_name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <hr className="breakline" />

            <FormItem
              {...formItemLayout}
              label={
                <span>
                  {intl.get('AddProject.AddProject.基本路径&nbsp;')}<Tooltip title={intl.get('AddProject.AddProject.接口基本路径，为空是')}>
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('basepath', {
                rules: [
                  {
                    required: false,
                    message: intl.get('AddProject.AddProject.请输入项目基本路径')
                  }
                ]
              })(<Input onBlur={this.handlePath} />)}
            </FormItem>

            <FormItem {...formItemLayout} label={intl.get('AddProject.AddProject.描述')}>
              {getFieldDecorator('desc', {
                rules: [
                  {
                    required: false,
                    message: intl.get('AddProject.AddProject.描述不超过144字!'),
                    max: 144
                  }
                ]
              })(<TextArea rows={4} />)}
            </FormItem>

            <FormItem {...formItemLayout} label={intl.get('AddProject.AddProject.权限')}>
              {getFieldDecorator('project_type', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: 'private'
              })(
                <RadioGroup>
                  <Radio value="private" className="radio">
                    <Icon type="lock" />{intl.get('AddProject.AddProject.私有')}<br />
                    <span className="radio-desc">{intl.get('AddProject.AddProject.只有组长和项目开发者')}</span>
                  </Radio>
                  <br />
                  {/* <Radio value="public" className="radio">
                    <Icon type="unlock" />公开<br />
                    <span className="radio-desc">任何人都可以索引并查看项目信息</span>
                  </Radio> */}
                </RadioGroup>
              )}
            </FormItem>
          </Form>
          <Row>
            <Col sm={{ offset: 6 }} lg={{ offset: 3 }}>
              <Button className="m-btn" icon="plus" type="primary" onClick={this.handleOk}>
                {intl.get('AddProject.AddProject.创建项目')}</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Form.create()(ProjectList);
