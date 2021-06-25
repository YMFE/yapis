import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ProjectToken.scss';
import { getToken, updateToken } from '../../../../reducer/modules/project';
import { connect } from 'react-redux';
import { Icon, Tooltip, message, Modal } from 'antd';
import copy from 'copy-to-clipboard';
import intl from "react-intl-universal";

const confirm = Modal.confirm;

@connect(
  state => {
    return {
      token: state.project.token
    };
  },
  {
    getToken,
    updateToken
  }
)
class ProjectToken extends Component {
  static propTypes = {
    projectId: PropTypes.number,
    getToken: PropTypes.func,
    token: PropTypes.string,
    updateToken: PropTypes.func,
    curProjectRole: PropTypes.string
  };

  async componentDidMount() {
    await this.props.getToken(this.props.projectId);
  }

  copyToken = () => {
    copy(this.props.token);
    message.success(intl.get('ProjectToken.ProjectToken.已经成功复制到剪切板'));
  };

  updateToken = () => {
    let that = this;
    confirm({
      title: intl.get('ProjectToken.ProjectToken.重新生成key'),
      content: intl.get('ProjectToken.ProjectToken.重新生成之后，之前的'),
      okText: intl.get('ProjectToken.ProjectToken.确认'),
      cancelText: intl.get('ProjectToken.ProjectToken.取消'),
      async onOk() {
        await that.props.updateToken(that.props.projectId);
        message.success(intl.get('ProjectToken.ProjectToken.更新成功'));
      },
      onCancel() {}
    });
  };

  render() {
    return (
      <div className="project-token">
        <h2 className="token-title">{intl.get('ProjectToken.ProjectToken.工具标识')}</h2>
        <div className="message">
          {intl.get('ProjectToken.ProjectToken.每个项目都有唯一的标')}</div>
        <div className="token">
          <span>
            token: <span className="token-message">{this.props.token}</span>
          </span>
          <Tooltip title={intl.get('ProjectToken.ProjectToken.复制')}>
            <Icon className="token-btn" type="copy" onClick={this.copyToken} />
          </Tooltip>
          {this.props.curProjectRole === 'admin' || this.props.curProjectRole === 'owner' ? (
            <Tooltip title={intl.get('ProjectToken.ProjectToken.刷新')}>
              <Icon className="token-btn" type="reload" onClick={this.updateToken} />
            </Tooltip>
          ) : null}
        </div>
        <div className="blockquote">
          {intl.get('ProjectToken.ProjectToken.为确保项目内数据的安')}</div>
        <br />
        <h2  className="token-title">{intl.get('ProjectToken.ProjectToken.open接口：')}</h2>
        <p><a target="_blank" rel="noopener noreferrer"   href="https://hellosean1025.github.io/yapi/openapi.html">{intl.get('ProjectToken.ProjectToken.详细接口文档')}</a></p>
        <div>
          <ul className="open-api">
            <li>{intl.get('ProjectToken.ProjectToken./api/open/')}</li>
            <li>{intl.get('ProjectToken.ProjectToken./api/open/')}</li>
            <li>{intl.get('ProjectToken.ProjectToken./api/inter')}</li>
            <li>{intl.get('ProjectToken.ProjectToken./api/inter')}</li>
            <li>{intl.get('ProjectToken.ProjectToken./api/inter')}</li>
            <li>{intl.get('ProjectToken.ProjectToken./api/inter')}</li>
            <li>{intl.get('ProjectToken.ProjectToken./api/inter')}</li>
            <li>{intl.get('ProjectToken.ProjectToken./api/inter')}</li>
            <li>{intl.get('ProjectToken.ProjectToken./api/inter')}</li>
            <li>{intl.get('ProjectToken.ProjectToken./api/inter')}</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ProjectToken;
