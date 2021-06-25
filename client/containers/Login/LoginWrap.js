import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import LoginForm from './Login';
import RegForm from './Reg';
import './Login.scss';
import intl from "react-intl-universal";

const TabPane = Tabs.TabPane;

@connect(state => ({
  loginWrapActiveKey: state.user.loginWrapActiveKey,
  canRegister: state.user.canRegister
}))
export default class LoginWrap extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    form: PropTypes.object,
    loginWrapActiveKey: PropTypes.string,
    canRegister: PropTypes.bool
  };

  render() {
    const { loginWrapActiveKey, canRegister } = this.props;
    {/** show only login when register is disabled */}
    return (
      <Tabs
        defaultActiveKey={loginWrapActiveKey}
        className="login-form"
        tabBarStyle={{ border: 'none' }}
      >
        <TabPane tab={intl.get('Login.LoginWrap.登录')} key="1">
          <LoginForm />
        </TabPane>
        <TabPane tab={intl.get('Login.LoginWrap.注册')} key="2">
          {canRegister ? <RegForm /> : <div style={{minHeight: 200}}>{intl.get('Login.LoginWrap.管理员已禁止注册，请')}</div>}
        </TabPane>
      </Tabs>
    );
  }
}
