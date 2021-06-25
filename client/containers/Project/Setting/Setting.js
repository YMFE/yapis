import React, { PureComponent as Component } from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import ProjectMessage from './ProjectMessage/ProjectMessage.js';
import ProjectEnv from './ProjectEnv/index.js';
import ProjectRequest from './ProjectRequest/ProjectRequest';
import ProjectToken from './ProjectToken/ProjectToken';
import ProjectMock from './ProjectMock/index.js';
import { connect } from 'react-redux';
const TabPane = Tabs.TabPane;
const plugin = require('client/plugin.js');

const routers = {}

import './Setting.scss';
import intl from "react-intl-universal";

@connect(state => {
  return {
    curProjectRole: state.project.currProject.role
  };
})
class Setting extends Component {
  static propTypes = {
    match: PropTypes.object,
    curProjectRole: PropTypes.string
  };
  render() {
    const id = this.props.match.params.id;
    plugin.emitHook('sub_setting_nav', routers);
    return (
      <div className="g-row">
        <Tabs type="card" className="has-affix-footer tabs-large">
          <TabPane tab={intl.get('Setting.Setting.项目配置')} key="1">
            <ProjectMessage projectId={+id} />
          </TabPane>
          <TabPane tab={intl.get('Setting.Setting.环境配置')} key="2">
            <ProjectEnv projectId={+id} />
          </TabPane>
          <TabPane tab={intl.get('Setting.Setting.请求配置')} key="3">
            <ProjectRequest projectId={+id} />
          </TabPane>
          {this.props.curProjectRole !== 'guest' ? (
            <TabPane tab={intl.get('Setting.Setting.token配置')} key="4">
              <ProjectToken projectId={+id} curProjectRole={this.props.curProjectRole} />
            </TabPane>
          ) : null}
          <TabPane tab={intl.get('Setting.Setting.全局mock脚本')} key="5">
            <ProjectMock projectId={+id} />
          </TabPane>
          {Object.keys(routers).map(key=>{
            const C = routers[key].component;
            return <TabPane tab={routers[key].name} key={routers[key].name}>
              <C projectId={+id} />
            </TabPane>
          })}
        </Tabs>
      </div>
    );
  }
}

export default Setting;
