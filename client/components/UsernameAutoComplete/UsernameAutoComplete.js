import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import axios from 'axios';
import intl from "react-intl-universal";

const Option = Select.Option;

/**
 * 用户名输入框自动完成组件
 *
 * @component UsernameAutoComplete
 * @examplelanguage js
 *
 * * 用户名输入框自动完成组件
 * * 用户名输入框自动完成组件
 *
 *s
 */

/**
 * 获取自动输入的用户信息
 *
 * 获取子组件state
 * @property callbackState
 * @type function
 * @description 类型提示：支持数组传值；也支持用函数格式化字符串：函数有两个参数(scale, index)；
 * 受控属性：滑块滑到某一刻度时所展示的刻度文本信息。如果不需要标签，请将该属性设置为 [] 空列表来覆盖默认转换函数。
 * @returns {object} {uid: xxx, username: xxx}
 * @examplelanguage js
 * @example
 * onUserSelect(childState) {
 *   this.setState({
 *     uid: childState.uid,
 *     username: childState.username
 *   })
 * }
 *
 */
class UsernameAutoComplete extends Component {
  constructor(props) {
    super(props);
    // this.lastFetchId = 0;
    // this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    dataSource: [],
    fetching: false
  };

  static propTypes = {
    callbackState: PropTypes.func
  };

  // 搜索回调
  handleSearch = value => {
    const params = { q: value };
    // this.lastFetchId += 1;
    // const fetchId = this.lastFetchId;
    this.setState({ fetching: true });
    axios.get('/api/user/search', { params }).then(data => {
      // if (fetchId !== this.lastFetchId) { // for fetch callback order
      //   return;
      // }
      const userList = [];
      data = data.data.data;

      if (data) {
        data.forEach(v =>
          userList.push({
            username: v.username,
            id: v.uid
          })
        );
        // 取回搜索值后，设置 dataSource
        this.setState({
          dataSource: userList
        });
      }
    });
  };

  // 选中候选词时
  handleChange = value => {
    this.setState({
      dataSource: [],
      // value,
      fetching: false
    });
    this.props.callbackState(value);
  };

  render() {
    let { dataSource, fetching } = this.state;

    const children = dataSource.map((item, index) => (
      <Option key={index} value={'' + item.id}>
        {item.username}
      </Option>
    ));

    // if (!children.length) {
    //   fetching = false;
    // }
    return (
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder={intl.get('UsernameAutoComplete.UsernameAutoComplete.请输入用户名')}
        filterOption={false}
        optionLabelProp="children"
        notFoundContent={fetching ? <span style={{ color: 'red' }}> {intl.get('UsernameAutoComplete.UsernameAutoComplete.当前用户不存在')}</span> : null}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
      >
        {children}
      </Select>
    );
  }
}

export default UsernameAutoComplete;
