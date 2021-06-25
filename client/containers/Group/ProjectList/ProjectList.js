import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import {
  addProject,
  fetchProjectList,
  delProject,
  changeUpdateModal
} from '../../../reducer/modules/project';
import ProjectCard from '../../../components/ProjectCard/ProjectCard.js';
import ErrMsg from '../../../components/ErrMsg/ErrMsg.js';
import { autobind } from 'core-decorators';
import { setBreadcrumb } from '../../../reducer/modules/user';

import './ProjectList.scss';
import intl from "react-intl-universal";

@connect(
  state => {
    return {
      projectList: state.project.projectList,
      userInfo: state.project.userInfo,
      tableLoading: state.project.tableLoading,
      currGroup: state.group.currGroup,
      currPage: state.project.currPage
    };
  },
  {
    fetchProjectList,
    addProject,
    delProject,
    changeUpdateModal,
    setBreadcrumb
  }
)
class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      protocol: 'http://',
      projectData: []
    };
  }
  static propTypes = {
    form: PropTypes.object,
    fetchProjectList: PropTypes.func,
    addProject: PropTypes.func,
    delProject: PropTypes.func,
    changeUpdateModal: PropTypes.func,
    projectList: PropTypes.array,
    userInfo: PropTypes.object,
    tableLoading: PropTypes.bool,
    currGroup: PropTypes.object,
    setBreadcrumb: PropTypes.func,
    currPage: PropTypes.number,
    studyTip: PropTypes.number,
    study: PropTypes.bool
  };

  // 取消修改
  @autobind
  handleCancel() {
    this.props.form.resetFields();
    this.setState({
      visible: false
    });
  }

  // 修改线上域名的协议类型 (http/https)
  @autobind
  protocolChange(value) {
    this.setState({
      protocol: value
    });
  }

  // 获取 ProjectCard 组件的关注事件回调，收到后更新数据

  receiveRes = () => {
    this.props.fetchProjectList(this.props.currGroup._id, this.props.currPage);
  };

  componentWillReceiveProps(nextProps) {
    this.props.setBreadcrumb([{ name: '' + (nextProps.currGroup.group_name || '') }]);

    // 切换分组
    if (this.props.currGroup !== nextProps.currGroup && nextProps.currGroup._id) {
      this.props.fetchProjectList(nextProps.currGroup._id, this.props.currPage);
    }

    // 切换项目列表
    if (this.props.projectList !== nextProps.projectList) {
      // console.log(nextProps.projectList);
      const data = nextProps.projectList.map((item, index) => {
        item.key = index;
        return item;
      });
      this.setState({
        projectData: data
      });
    }
  }

  render() {
    let projectData = this.state.projectData;
    let noFollow = [];
    let followProject = [];
    for (var i in projectData) {
      if (projectData[i].follow) {
        followProject.push(projectData[i]);
      } else {
        noFollow.push(projectData[i]);
      }
    }
    followProject = followProject.sort((a, b) => {
      return b.up_time - a.up_time;
    });
    noFollow = noFollow.sort((a, b) => {
      return b.up_time - a.up_time;
    });
    projectData = [...followProject, ...noFollow];

    const isShow = /(admin)|(owner)|(dev)/.test(this.props.currGroup.role);

    const Follow = () => {
      return followProject.length ? (
        <Row>
          <h3 className="owner-type">{intl.get('ProjectList.ProjectList.我的关注')}</h3>
          {followProject.map((item, index) => {
            return (
              <Col xs={8} lg={6} xxl={4} key={index}>
                <ProjectCard projectData={item} callbackResult={this.receiveRes} />
              </Col>
            );
          })}
        </Row>
      ) : null;
    };
    const NoFollow = () => {
      return noFollow.length ? (
        <Row style={{ borderBottom: '1px solid #eee', marginBottom: '15px' }}>
          <h3 className="owner-type">{intl.get('ProjectList.ProjectList.我的项目')}</h3>
          {noFollow.map((item, index) => {
            return (
              <Col xs={8} lg={6} xxl={4} key={index}>
                <ProjectCard projectData={item} callbackResult={this.receiveRes} isShow={isShow} />
              </Col>
            );
          })}
        </Row>
      ) : null;
    };

    const OwnerSpace = () => {
      return projectData.length ? (
        <div>
          <NoFollow />
          <Follow />
        </div>
      ) : (
        <ErrMsg type="noProject" />
      );
    };

    return (
      <div style={{ paddingTop: '24px' }} className="m-panel card-panel card-panel-s project-list">
        <Row className="project-list-header">
          <Col span={16} style={{ textAlign: 'left' }}>
            {this.props.currGroup.group_name} {intl.get('ProjectList.ProjectList.分组共 (')}{projectData.length}{intl.get('ProjectList.ProjectList.) 个项目')}</Col>
          <Col span={8}>
            {isShow ? (
              <Link to="/add-project">
                <Button type="primary">{intl.get('ProjectList.ProjectList.添加项目')}</Button>
              </Link>
            ) : (
              <Tooltip title={intl.get('ProjectList.ProjectList.您没有权限,请联系该')}>
                <Button type="primary" disabled>
                  {intl.get('ProjectList.ProjectList.添加项目')}</Button>
              </Tooltip>
            )}
          </Col>
        </Row>
        <Row>
          {/* {projectData.length ? projectData.map((item, index) => {
            return (
              <Col xs={8} md={6} xl={4} key={index}>
                <ProjectCard projectData={item} callbackResult={this.receiveRes} />
              </Col>);
          }) : <ErrMsg type="noProject" />} */}
          {this.props.currGroup.type === 'private' ? (
            <OwnerSpace />
          ) : projectData.length ? (
            projectData.map((item, index) => {
              return (
                <Col xs={8} lg={6} xxl={4} key={index}>
                  <ProjectCard
                    projectData={item}
                    callbackResult={this.receiveRes}
                    isShow={isShow}
                  />
                </Col>
              );
            })
          ) : (
            <ErrMsg type="noProject" />
          )}
        </Row>
      </div>
    );
  }
}

export default ProjectList;
