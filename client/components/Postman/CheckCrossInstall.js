import React from 'react';
import { Alert } from 'antd';
import PropTypes from 'prop-types';
import intl from "react-intl-universal";

exports.initCrossRequest = function (fn) {
  let startTime = 0;
  let _crossRequest = setInterval(() => {
    startTime += 500;
    if (startTime > 5000) {
      clearInterval(_crossRequest);
    }
    if (window.crossRequest) {
      clearInterval(_crossRequest);
      fn(true);
    } else {
      fn(false);
    }
  }, 500);
  return _crossRequest;
};

CheckCrossInstall.propTypes = {
  hasPlugin: PropTypes.bool
};

function CheckCrossInstall(props) {
  const hasPlugin = props.hasPlugin;
  return (
    <div className={hasPlugin ? null : 'has-plugin'}>
      {hasPlugin ? (
        ''
      ) : (
        <Alert
          message={
            <div>
              {intl.get('Postman.CheckCrossInstall.重要：当前的接口测试')}{/* <div>
                <a
                  target="blank"
                  href="https://chrome.google.com/webstore/detail/cross-request/cmnlfmgbjmaciiopcgodlhpiklaghbok?hl=en-US"
                >
                  [Google 商店获取（需翻墙]
                </a>
              </div> */}
              <div>
                <a target="blank" href="https://juejin.im/post/5e3bbd986fb9a07ce152b53d">
                  {' '}
                  {intl.get('Postman.CheckCrossInstall.[谷歌请求插件详细安')}{' '}
                </a>
              </div>
            </div>
          }
          type="warning"
        />
      )}
    </div>
  );
}

export default CheckCrossInstall;
