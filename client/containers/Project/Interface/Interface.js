import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Layout } from 'antd';
import { Route, Switch, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';
const { Content, Sider } = Layout;

import './interface.scss';

import InterfaceMenu from './InterfaceList/InterfaceMenu.js';
import InterfaceList from './InterfaceList/InterfaceList.js';
import InterfaceContent from './InterfaceList/InterfaceContent.js';

import InterfaceColMenu from './InterfaceCol/InterfaceColMenu.js';
import InterfaceColContent from './InterfaceCol/InterfaceColContent.js';
import InterfaceCaseContent from './InterfaceCol/InterfaceCaseContent.js';
import { getProject } from '../../../reducer/modules/project';
import { setColData } from '../../../reducer/modules/interfaceCol.js';
import intl from "react-intl-universal";

const contentRouter = {
  path: '/project/:id/interface/:action/:actionId',
  exact: true
};

const InterfaceRoute = props => {
  let C;
  if (props.match.params.action === 'api') {
    if (!props.match.params.actionId) {
      C = InterfaceList;
    } else if (!isNaN(props.match.params.actionId)) {
      C = InterfaceContent;
    } else if (props.match.params.actionId.indexOf('cat_') === 0) {
      C = InterfaceList;
    }
  } else if (props.match.params.action === 'col') {
    C = InterfaceColContent;
  } else if (props.match.params.action === 'case') {
    C = InterfaceCaseContent;
  } else {
    const params = props.match.params;
    props.history.replace('/project/' + params.id + '/interface/api');
    return null;
  }
  return <C {...props} />;
};

InterfaceRoute.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
};

@connect(
  state => {
    return {
      isShowCol: state.interfaceCol.isShowCol
    };
  },
  {
    setColData,
    getProject
  }
)
class Interface extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    isShowCol: PropTypes.bool,
    getProject: PropTypes.func,
    setColData: PropTypes.func
    // fetchInterfaceColList: PropTypes.func
  };

  constructor(props) {
    super(props);
    // this.state = {
    //   curkey: this.props.match.params.action === 'api' ? 'api' : 'colOrCase'
    // }
  }

  onChange = action => {
    let params = this.props.match.params;
    if (action === 'colOrCase') {
      action = this.props.isShowCol ? 'col' : 'case';
    }
    this.props.history.push('/project/' + params.id + '/interface/' + action);
  };
  async componentWillMount() {
    this.props.setColData({
      isShowCol: true
    });
    // await this.props.fetchInterfaceColList(this.props.match.params.id)
  }
  render() {
    const { action } = this.props.match.params;
    // const activeKey = this.state.curkey;
    const activeKey = action === 'api' ? 'api' : 'colOrCase';

    return (
      <Layout style={{ minHeight: 'calc(100vh - 156px)', marginLeft: '24px', marginTop: '24px' }}>
        <Sider style={{ height: '100%' }} width={300}>
          <div className="left-menu">
            <Tabs type="card" className="tabs-large" activeKey={activeKey} onChange={this.onChange}>
              <Tabs.TabPane tab={intl.get('Interface.Interface.接口列表')} key="api" />
              <Tabs.TabPane tab={intl.get('Interface.Interface.测试集合')} key="colOrCase" />
            </Tabs>
            {activeKey === 'api' ? (
              <InterfaceMenu
                router={matchPath(this.props.location.pathname, contentRouter)}
                projectId={this.props.match.params.id}
              />
            ) : (
              <InterfaceColMenu
                router={matchPath(this.props.location.pathname, contentRouter)}
                projectId={this.props.match.params.id}
              />
            )}
          </div>
        </Sider>
        <Layout>
          <Content
            style={{
              height: '100%',
              margin: '0 24px 0 16px',
              overflow: 'initial',
              backgroundColor: '#fff'
            }}
          >
            <div className="right-content">
              <Switch>
                <Route exact path="/project/:id/interface/:action" component={InterfaceRoute} />
                <Route {...contentRouter} component={InterfaceRoute} />
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Interface;
