import './ProjectCard.scss';
import React, { PureComponent as Component } from 'react';
import { Card, Icon, Tooltip, Modal, Alert, Input, message } from 'antd';
import { connect } from 'react-redux';
import { delFollow, addFollow } from '../../reducer/modules/follow';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { debounce } from '../../common';
import constants from '../../constants/variable.js';
import produce from 'immer';
import { getProject, checkProjectName, copyProjectMsg } from '../../reducer/modules/project';
import { trim } from '../../common.js';
import intl from "react-intl-universal";

const confirm = Modal.confirm;

@connect(
  state => {
    return {
      uid: state.user.uid,
      currPage: state.project.currPage
    };
  },
  {
    delFollow,
    addFollow,
    getProject,
    checkProjectName,
    copyProjectMsg
  }
)
@withRouter
class ProjectCard extends Component {
  constructor(props) {
    super(props);
    this.add = debounce(this.add, 400);
    this.del = debounce(this.del, 400);
  }

  static propTypes = {
    projectData: PropTypes.object,
    uid: PropTypes.number,
    inFollowPage: PropTypes.bool,
    callbackResult: PropTypes.func,
    history: PropTypes.object,
    delFollow: PropTypes.func,
    addFollow: PropTypes.func,
    isShow: PropTypes.bool,
    getProject: PropTypes.func,
    checkProjectName: PropTypes.func,
    copyProjectMsg: PropTypes.func,
    currPage: PropTypes.number
  };

  copy = async projectName => {
    const id = this.props.projectData._id;

    let projectData = await this.props.getProject(id);
    let data = projectData.payload.data.data;
    let newData = produce(data, draftData => {
      draftData.preName = draftData.name;
      draftData.name = projectName;
    });

    await this.props.copyProjectMsg(newData);
    message.success(intl.get('ProjectCard.ProjectCard.项目复制成功'));
    this.props.callbackResult();
  };

  // 复制项目的二次确认
  showConfirm = () => {
    const that = this;

    confirm({
      title: intl.get('ProjectCard.ProjectCard.确认复制') + that.props.projectData.name + intl.get('ProjectCard.ProjectCard.项目吗？'),
      okText: intl.get('ProjectCard.ProjectCard.确认'),
      cancelText: intl.get('ProjectCard.ProjectCard.取消'),
      content: (
        <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: '25px' }}>
          <Alert
            message={`该操作将会复制 ${
              that.props.projectData.name
            } 下的所有接口集合，但不包括测试集合中的接口`}
            type="info"
          />
          <div style={{ marginTop: '16px' }}>
            <p>
              <b>{intl.get('ProjectCard.ProjectCard.项目名称:')}</b>
            </p>
            <Input id="project_name" placeholder={intl.get('ProjectCard.ProjectCard.项目名称')} />
          </div>
        </div>
      ),
      async onOk() {
        const projectName = trim(document.getElementById('project_name').value);

        // 查询项目名称是否重复
        const group_id = that.props.projectData.group_id;
        await that.props.checkProjectName(projectName, group_id);
        that.copy(projectName);
      },
      iconType: 'copy',
      onCancel() {}
    });
  };

  del = () => {
    const id = this.props.projectData.projectid || this.props.projectData._id;
    this.props.delFollow(id).then(res => {
      if (res.payload.data.errcode === 0) {
        this.props.callbackResult();
        // message.success('已取消关注！');  // 星号已做出反馈 无需重复提醒用户
      }
    });
  };

  add = () => {
    const { uid, projectData } = this.props;
    const param = {
      uid,
      projectid: projectData._id,
      projectname: projectData.name,
      icon: projectData.icon || constants.PROJECT_ICON[0],
      color: projectData.color || constants.PROJECT_COLOR.blue
    };
    this.props.addFollow(param).then(res => {
      if (res.payload.data.errcode === 0) {
        this.props.callbackResult();
        // message.success('已添加关注！');  // 星号已做出反馈 无需重复提醒用户
      }
    });
  };

  render() {
    const { projectData, inFollowPage, isShow } = this.props;
    return (
      <div className="card-container">
        <Card
          bordered={false}
          className="m-card"
          onClick={() =>
            this.props.history.push('/project/' + (projectData.projectid || projectData._id))
          }
        >
          <Icon
            type={projectData.icon || 'star-o'}
            className="ui-logo"
            style={{
              backgroundColor:
                constants.PROJECT_COLOR[projectData.color] || constants.PROJECT_COLOR.blue
            }}
          />
          <h4 className="ui-title">{projectData.name || projectData.projectname}</h4>
        </Card>
        <div
          className="card-btns"
          onClick={projectData.follow || inFollowPage ? this.del : this.add}
        >
          <Tooltip
            placement="rightTop"
            title={projectData.follow || inFollowPage ? intl.get('ProjectCard.ProjectCard.取消关注') : intl.get('ProjectCard.ProjectCard.添加关注')}
          >
            <Icon
              type={projectData.follow || inFollowPage ? 'star' : 'star-o'}
              className={'icon ' + (projectData.follow || inFollowPage ? 'active' : '')}
            />
          </Tooltip>
        </div>
        {isShow && (
          <div className="copy-btns" onClick={this.showConfirm}>
            <Tooltip placement="rightTop" title={intl.get('ProjectCard.ProjectCard.复制项目')}>
              <Icon type="copy" className="icon" />
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}

export default ProjectCard;
