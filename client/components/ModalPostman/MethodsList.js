import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Icon, Input, Select, Tooltip } from 'antd';
import _ from 'underscore';
import intl from "react-intl-universal";

const Option = Select.Option;

// 深拷贝
function deepEqual(state) {
  return JSON.parse(JSON.stringify(state));
}

const METHODS_LIST = [
  { name: 'md5', type: false, params: [], desc: intl.get('ModalPostman.MethodsList.md5加密') },
  { name: 'lower', type: false, params: [], desc: intl.get('ModalPostman.MethodsList.所有字母变成小写') },
  { name: 'length', type: false, params: [], desc: intl.get('ModalPostman.MethodsList.数据长度') },
  { name: 'substr', type: true, component: 'doubleInput', params: [], desc: intl.get('ModalPostman.MethodsList.截取部分字符串') },
  { name: 'sha', type: true, component: 'select', params: ['sha1'], desc: intl.get('ModalPostman.MethodsList.sha加密') },
  { name: 'base64', type: false, params: [], desc: intl.get('ModalPostman.MethodsList.base64加密') },
  { name: 'unbase64', type: false, params: [], desc: intl.get('ModalPostman.MethodsList.base64解密') },
  { name: 'concat', type: true, component: 'input', params: [], desc: intl.get('ModalPostman.MethodsList.连接字符串') },
  { name: 'lconcat', type: true, component: 'input', params: [], desc: intl.get('ModalPostman.MethodsList.左连接') },
  { name: 'upper', type: false, desc: intl.get('ModalPostman.MethodsList.所有字母变成大写') },
  { name: 'number', type: false, desc: intl.get('ModalPostman.MethodsList.字符串转换为数字类型') }
];

class MethodsList extends Component {
  static propTypes = {
    show: PropTypes.bool,
    click: PropTypes.func,
    clickValue: PropTypes.string,
    paramsInput: PropTypes.func,
    clickIndex: PropTypes.number,
    params: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      list: METHODS_LIST,
      moreFlag: true
    };
  }

  showMore = () => {
    this.setState({
      moreFlag: false
    });
  };

  componentDidMount() {
    var index = _.findIndex(METHODS_LIST, { name: this.props.clickValue });

    let moreFlag = index > 3 ? false : true;
    this.setState({
      moreFlag
    });
  }

  inputComponent = props => {
    let clickIndex = props.clickIndex;
    let paramsIndex = props.paramsIndex;
    let params = props.params;
    return (
      <Input
        size="small"
        placeholder={intl.get('ModalPostman.MethodsList.请输入参数')}
        value={params[0]}
        onChange={e => this.handleParamsChange(e.target.value, clickIndex, paramsIndex, 0)}
      />
    );
  };

  doubleInputComponent = props => {
    let clickIndex = props.clickIndex;
    let paramsIndex = props.paramsIndex;
    let params = props.params;

    return (
      <div>
        <Input
          size="small"
          placeholder="start"
          value={params[0]}
          onChange={e => this.handleParamsChange(e.target.value, clickIndex, paramsIndex, 0)}
        />
        <Input
          size="small"
          placeholder="length"
          value={params[1]}
          onChange={e => this.handleParamsChange(e.target.value, clickIndex, paramsIndex, 1)}
        />
      </div>
    );
  };

  selectComponent = props => {
    const subname = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512'];
    let clickIndex = props.clickIndex;
    let paramsIndex = props.paramsIndex;
    let params = props.params;
    return (
      <Select
        value={params[0] || 'sha1'}
        placeholder={intl.get('ModalPostman.MethodsList.请选择')}
        style={{ width: 150 }}
        size="small"
        onChange={e => this.handleParamsChange(e, clickIndex, paramsIndex, 0)}
      >
        {subname.map((item, index) => {
          return (
            <Option value={item} key={index}>
              {item}
            </Option>
          );
        })}
      </Select>
    );
  };

  // 处理参数输入
  handleParamsChange(value, clickIndex, paramsIndex, index) {
    let newList = deepEqual(this.state.list);
    newList[paramsIndex].params[index] = value;
    this.setState({
      list: newList
    });
    this.props.paramsInput(value, clickIndex, index);
  }

  // 组件选择
  handleComponent(item, clickIndex, index, params) {
    let query = {
      clickIndex: clickIndex,
      paramsIndex: index,
      params
    };
    switch (item.component) {
      case 'select':
        return this.selectComponent(query);
      case 'input':
        return this.inputComponent(query);
      case 'doubleInput':
        return this.doubleInputComponent(query);
      default:
        break;
    }
  }

  render() {
    const { list, moreFlag } = this.state;
    const { click, clickValue, clickIndex, params } = this.props;
    let showList = moreFlag ? list.slice(0, 4) : list;

    return (
      <div className="modal-postman-form-method">
        <h3 className="methods-title title">{intl.get('ModalPostman.MethodsList.方法')}</h3>
        {showList.map((item, index) => {
          return (
            <Row
              key={index}
              type="flex"
              align="middle"
              className={'row methods-row ' + (item.name === clickValue ? 'checked' : '')}
              onClick={() => click(item.name, showList[index].params)}
            >
              <Tooltip title={item.desc}>
                <span>{item.name}</span>
              </Tooltip>
              <span className="input-component">
                {item.type &&
                  this.handleComponent(
                    item,
                    clickIndex,
                    index,
                    item.name === clickValue ? params : []
                  )}
              </span>
            </Row>
          );
        })}
        {moreFlag && (
          <div className="show-more" onClick={this.showMore}>
            <Icon type="down" />
            <span style={{ paddingLeft: '4px' }}>{intl.get('ModalPostman.MethodsList.更多')}</span>
          </div>
        )}
      </div>
    );
  }
}

export default MethodsList;
