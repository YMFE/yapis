import React, { PureComponent as Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Home, Group, Project, Follows, AddProject, Login } from './containers/index';
import { Alert, Select } from 'antd';
import User from './containers/User/User.js';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import MyPopConfirm from './components/MyPopConfirm/MyPopConfirm';
import { checkLoginState } from './reducer/modules/user';
import { requireAuthentication } from './components/AuthenticatedComponent';
import Notify from './components/Notify/Notify';
import * as i18nHelper from './i18n';


const plugin = require('client/plugin.js');

const LOADING_STATUS = 0;

const alertContent = () => {
  const ua = window.navigator.userAgent,
    isChrome = ua.indexOf('Chrome') && window.chrome;
  if (!isChrome) {
    return (
      <Alert
        style={{ zIndex: 99 }}
        message={'YApi 的接口测试等功能仅支持 Chrome 浏览器，请使用 Chrome 浏览器获得完整功能。'}
        banner
        closable
      />
    );
  }
};

let AppRoute = {
  home: {
    path: '/',
    component: Home
  },
  group: {
    path: '/group',
    component: Group
  },
  project: {
    path: '/project/:id',
    component: Project
  },
  user: {
    path: '/user',
    component: User
  },
  follow: {
    path: '/follow',
    component: Follows
  },
  addProject: {
    path: '/add-project',
    component: AddProject
  },
  login: {
    path: '/login',
    component: Login
  }
};
// 增加路由钩子
plugin.emitHook('app_route', AppRoute);

@connect(
  state => {
    return {
      loginState: state.user.loginState,
      curUserRole: state.user.role
    };
  },
  {
    checkLoginState
  }
)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: LOADING_STATUS,
      lng: i18nHelper.getLocale(),
    };
  }

  static propTypes = {
    checkLoginState: PropTypes.func,
    loginState: PropTypes.number,
    curUserRole: PropTypes.string
  };

  componentDidMount() {
    this.props.checkLoginState();
  }

  changeLng = (lng) => {
    i18nHelper.switchLng(lng)
      .then(() => {
        // After loading CLDR locale data, start to render
        this.setState({ lng });
      });
  }

  showConfirm = (msg, callback) => {
    // 自定义 window.confirm
    // http://reacttraining.cn/web/api/BrowserRouter/getUserConfirmation-func
    let container = document.createElement('div');
    document.body.appendChild(container);
    ReactDOM.render(<MyPopConfirm msg={msg} callback={callback} />, container);
  };

  route = status => {
    let r;
    if (status === LOADING_STATUS) {
      return <Loading visible />;
    } else {

      const lngSel = <Select value={this.state.lng} onChange={e=>this.changeLng(e)}>
        {i18nHelper.availableLng.map(k => <Select.Option key={k} value={k}>{k}</Select.Option>)}
      </Select>

      r = (
        <Router getUserConfirmation={this.showConfirm}>
          <div className="g-main">
            <div className="router-main">
              {this.props.curUserRole === 'admin' && <Notify />}
              {alertContent()}
              {this.props.loginState !== 1 ? <Header addone={lngSel} /> : null}
              <div className="router-container">
                {Object.keys(AppRoute).map(key => {
                  let item = AppRoute[key];
                  return key === 'login' ? (
                    <Route key={key} path={item.path} component={item.component} />
                  ) : key === 'home' ? (
                    <Route key={key} exact path={item.path} component={item.component} />
                  ) : (
                        <Route
                          key={key}
                          path={item.path}
                          component={requireAuthentication(item.component)}
                        />
                      );
                })}
              </div>
              {/* <div className="router-container">
                <Route exact path="/" component={Home} />
                <Route path="/group" component={requireAuthentication(Group)} />
                <Route path="/project/:id" component={requireAuthentication(Project)} />
                <Route path="/user" component={requireAuthentication(User)} />
                <Route path="/follow" component={requireAuthentication(Follows)} />
                <Route path="/add-project" component={requireAuthentication(AddProject)} />
                <Route path="/login" component={Login} />
                {/* <Route path="/statistic" component={statisticsPage} /> */}
              {/* </div> */}
            </div>
            <Footer />
          </div>
        </Router>
      );
    }
    return r;
  };

  render() {
    return this.route(this.props.loginState);
  }
}
