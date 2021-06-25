import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, Button, message, Icon, Card, Alert, Modal, Switch, Row, Col, Tooltip } from 'antd';
import { fetchNewsData } from '../../../reducer/modules/news.js';
import {
  changeGroupMsg,
  fetchGroupList,
  setCurrGroup,
  fetchGroupMsg,
  updateGroupList,
  deleteGroup
} from '../../../reducer/modules/group.js';
const { TextArea } = Input;
import { trim } from '../../../common.js';
import _ from 'underscore';
import './GroupSetting.scss';
import intl from "react-intl-universal";

const confirm = Modal.confirm;

@connect(
  state => {
    return {
      groupList: state.group.groupList,
      currGroup: state.group.currGroup,
      curUserRole: state.user.role
    };
  },
  {
    changeGroupMsg,
    fetchGroupList,
    setCurrGroup,
    fetchGroupMsg,
    fetchNewsData,
    updateGroupList,
    deleteGroup
  }
)
class GroupSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currGroupDesc: '',
      currGroupName: '',
      showDangerOptions: false,
      custom_field1_name: '',
      custom_field1_enable: false,
      custom_field1_rule: false
    };
  }

  static propTypes = {
    currGroup: PropTypes.object,
    curUserRole: PropTypes.string,
    changeGroupMsg: PropTypes.func,
    fetchGroupList: PropTypes.func,
    setCurrGroup: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
    fetchNewsData: PropTypes.func,
    updateGroupList: PropTypes.func,
    deleteGroup: PropTypes.func,
    groupList: PropTypes.array
  };

  initState(props) {
    this.setState({
      currGroupName: props.currGroup.group_name,
      currGroupDesc: props.currGroup.group_desc,
      custom_field1_name: props.currGroup.custom_field1.name,
      custom_field1_enable: props.currGroup.custom_field1.enable
    });
  }

  // 修改分组名称
  changeName = e => {
    this.setState({
      currGroupName: e.target.value
    });
  };
  // 修改分组描述
  changeDesc = e => {
    this.setState({
      currGroupDesc: e.target.value
    });
  };

  // 修改自定义字段名称
  changeCustomName = e => {
    let custom_field1_rule = this.state.custom_field1_enable ? !e.target.value : false;
    this.setState({
      custom_field1_name: e.target.value,
      custom_field1_rule
    });
  };

  // 修改开启状态
  changeCustomEnable = e => {
    let custom_field1_rule = e ? !this.state.custom_field1_name : false;
    this.setState({
      custom_field1_enable: e,
      custom_field1_rule
    });
  };

  componentWillMount() {
    // console.log('custom_field1',this.props.currGroup.custom_field1)
    this.initState(this.props);
  }

  // 点击“查看危险操作”按钮
  toggleDangerOptions = () => {
    // console.log(this.state.showDangerOptions);
    this.setState({
      showDangerOptions: !this.state.showDangerOptions
    });
  };

  // 编辑分组信息
  editGroup = async () => {
    const id = this.props.currGroup._id;
    if (this.state.custom_field1_rule) {
      return;
    }
    const res = await this.props.changeGroupMsg({
      group_name: this.state.currGroupName,
      group_desc: this.state.currGroupDesc,
      custom_field1: {
        name: this.state.custom_field1_name,
        enable: this.state.custom_field1_enable
      },
      id: this.props.currGroup._id
    });

    if (!res.payload.data.errcode) {
      message.success(intl.get('GroupSetting.GroupSetting.修改成功！'));
      await this.props.fetchGroupList(this.props.groupList);
      this.props.updateGroupList(this.props.groupList);
      const currGroup = _.find(this.props.groupList, group => {
        return +group._id === +id;
      });
      this.props.setCurrGroup(currGroup);
      this.props.fetchGroupMsg(this.props.currGroup._id);
      this.props.fetchNewsData(this.props.currGroup._id, 'group', 1, 10);
    }
  };

  // 删除分组

  deleteGroup = async () => {
    const that = this;
    const { currGroup } = that.props;
    const res = await this.props.deleteGroup({ id: currGroup._id });
    if (!res.payload.data.errcode) {
      message.success(intl.get('GroupSetting.GroupSetting.删除成功'));
      await that.props.fetchGroupList();
      const currGroup = that.props.groupList[0] || { group_name: '', group_desc: '' };
      that.setState({ groupList: that.props.groupList });
      that.props.setCurrGroup(currGroup);
    }
  };

  // 删除分组的二次确认
  showConfirm = () => {
    const that = this;
    confirm({
      title: intl.get('GroupSetting.GroupSetting.确认删除') + that.props.currGroup.group_name + intl.get('GroupSetting.GroupSetting.分组吗？'),
      content: (
        <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: '25px' }}>
          <Alert
            message={intl.get('GroupSetting.GroupSetting.警告：此操作非常危险')}
            type="warning"
          />
          <div style={{ marginTop: '16px' }}>
            <p>
              <b>{intl.get('GroupSetting.GroupSetting.请输入分组名称确认此')}</b>
            </p>
            <Input id="group_name" />
          </div>
        </div>
      ),
      onOk() {
        const groupName = trim(document.getElementById('group_name').value);
        if (that.props.currGroup.group_name !== groupName) {
          message.error(intl.get('GroupSetting.GroupSetting.分组名称有误'));
          return new Promise((resolve, reject) => {
            reject('error');
          });
        } else {
          that.deleteGroup();
        }
      },
      iconType: 'delete',
      onCancel() {}
    });
  };

  componentWillReceiveProps(nextProps) {
    // 切换分组时，更新分组信息并关闭删除分组操作
    if (this.props.currGroup._id !== nextProps.currGroup._id) {
      this.initState(nextProps);
      this.setState({
        showDangerOptions: false
      });
    }
  }

  render() {
    return (
      <div className="m-panel card-panel card-panel-s panel-group">
        <Row type="flex" justify="space-around" className="row" align="middle">
          <Col span={4} className="label">
            {intl.get('GroupSetting.GroupSetting.分组名：')}</Col>
          <Col span={20}>
            <Input
              size="large"
              placeholder={intl.get('GroupSetting.GroupSetting.请输入分组名称')}
              value={this.state.currGroupName}
              onChange={this.changeName}
            />
          </Col>
        </Row>
        <Row type="flex" justify="space-around" className="row" align="middle">
          <Col span={4} className="label">
            {intl.get('GroupSetting.GroupSetting.简介：')}</Col>
          <Col span={20}>
            <TextArea
              size="large"
              rows={3}
              placeholder={intl.get('GroupSetting.GroupSetting.请输入分组描述')}
              value={this.state.currGroupDesc}
              onChange={this.changeDesc}
            />
          </Col>
        </Row>
        <Row type="flex" justify="space-around" className="row" align="middle">
          <Col span={4} className="label">
            {intl.get('GroupSetting.GroupSetting.接口自定义字段&nb')}<Tooltip title={intl.get('GroupSetting.GroupSetting.可以在接口中添加 额')}>
              <Icon type="question-circle-o" style={{ width: '10px' }} />
            </Tooltip> ：
          </Col>
          <Col span={12} style={{ position: 'relative' }}>
            <Input
              placeholder={intl.get('GroupSetting.GroupSetting.请输入自定义字段名称')}
              style={{ borderColor: this.state.custom_field1_rule ? '#f5222d' : '' }}
              value={this.state.custom_field1_name}
              onChange={this.changeCustomName}
            />
            <div
              className="custom-field-rule"
              style={{ display: this.state.custom_field1_rule ? 'block' : 'none' }}
            >
              {intl.get('GroupSetting.GroupSetting.自定义字段名称不能为')}</div>
          </Col>
          <Col span={2} className="label">
            {intl.get('GroupSetting.GroupSetting.开启：')}</Col>
          <Col span={6}>
            <Switch
              checked={this.state.custom_field1_enable}
              checkedChildren={intl.get('GroupSetting.GroupSetting.开')}
              unCheckedChildren={intl.get('GroupSetting.GroupSetting.关')}
              onChange={this.changeCustomEnable}
            />
          </Col>
        </Row>
        <Row type="flex" justify="center" className="row save">
          <Col span={4} className="save-button">
            <Button className="m-btn btn-save" icon="save" type="primary" onClick={this.editGroup}>
              {intl.get('GroupSetting.GroupSetting.保 存')}</Button>
          </Col>
        </Row>
        {/* 只有超级管理员能删除分组 */}
        {this.props.curUserRole === 'admin' ? (
          <Row type="flex" justify="center" className="danger-container">
            <Col span={24} className="title">
              <h2 className="content">
                <Icon type="exclamation-circle-o" /> {intl.get('GroupSetting.GroupSetting.危险操作')}</h2>
              <Button onClick={this.toggleDangerOptions}>
                {intl.get('GroupSetting.GroupSetting.查 看')}<Icon type={this.state.showDangerOptions ? 'up' : 'down'} />
              </Button>
            </Col>
            {this.state.showDangerOptions ? (
              <Card hoverable={true} className="card-danger" style={{ width: '100%' }}>
                <div className="card-danger-content">
                  <h3>{intl.get('GroupSetting.GroupSetting.删除分组')}</h3>
                  <p>{intl.get('GroupSetting.GroupSetting.分组一旦删除，将无法')}</p>
                  <p>{intl.get('GroupSetting.GroupSetting.只有超级管理员有权限')}</p>
                </div>
                <Button type="danger" ghost className="card-danger-btn" onClick={this.showConfirm}>
                  {intl.get('GroupSetting.GroupSetting.删除')}</Button>
              </Card>
            ) : null}
          </Row>
        ) : null}
      </div>
    );
  }
}

export default GroupSetting;
