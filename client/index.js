import './styles/common.scss';
import './styles/theme.less';
import { LocaleProvider } from 'antd';
import * as i18nHelper from './i18n'; // side effect, load languages
import './plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './Application';
import { Provider } from 'react-redux';
import createStore from './reducer/create';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
// import zhCN from 'antd/lib/locale-provider/zh_CN';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={{locale:i18nHelper.getLocale()}}>
      <App />
    </LocaleProvider>
  </Provider>,
  document.getElementById('yapi')
);
