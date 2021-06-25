import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { Alert, Modal, Row, Col, Icon, Collapse, Input, Tooltip } from 'antd';
import MockList from './MockList.js';
import MethodsList from './MethodsList.js';
import VariablesSelect from './VariablesSelect.js';
import { trim } from '../../common.js';
import intl from "react-intl-universal";

const { handleParamsValue } = require('common/utils.js');
const Panel = Collapse.Panel;

// 深拷贝
function deepEqual(state) {
  return JSON.parse(JSON.stringify(state));
}

function closeRightTabsAndAddNewTab(arr, index, name, params) {
  let newParamsList = [].concat(arr);
  newParamsList.splice(index + 1, newParamsList.length - index);
  newParamsList.push({
    name: '',
    params: []
  });

  let curParams = params || [];
  let curname = name || '';
  newParamsList[index] = {
    ...newParamsList[index],
    name: curname,
    params: curParams
  };
  return newParamsList;
}

class ModalPostman extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    handleCancel: PropTypes.func,
    handleOk: PropTypes.func,
    inputValue: PropTypes.any,
    envType: PropTypes.string,
    id: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      methodsShow: false,
      methodsShowMore: false,
      methodsList: [],
      constantInput: '',
      activeKey: '1',
      methodsParamsList: [
        {
          name: '',
          params: [],
          type: 'dataSource'
        }
      ]
    };
  }

  componentWillMount() {
    let { inputValue } = this.props;
    this.setState({
      constantInput: inputValue
    });
    // this.props.inputValue && this.handleConstantsInput(this.props.inputValue, 0);
    inputValue && this.handleInitList(inputValue);
  }

  handleInitList(val) {
    val = val.replace(/^\{\{(.+)\}\}$/g, '$1');
    let valArr = val.split('|');

    if (valArr[0].indexOf('@') >= 0) {
      this.setState({
        activeKey: '2'
      });
    } else if (valArr[0].indexOf('$') >= 0) {
      this.setState({
        activeKey: '3'
      });
    }

    let paramsList = [
      {
        name: trim(valArr[0]),
        params: [],
        type: 'dataSource'
      }
    ];

    for (let i = 1; i < valArr.length; i++) {
      let nameArr = valArr[i].split(':');

      let paramArr = nameArr[1] && nameArr[1].split(',');
      paramArr =
        paramArr &&
        paramArr.map(item => {
          return trim(item);
        });
      let item = {
        name: trim(nameArr[0]),
        params: paramArr || []
      };
      paramsList.push(item);
    }

    this.setState(
      {
        methodsParamsList: paramsList
      },
      () => {
        this.mockClick(valArr.length)();
      }
    );
  }

  mockClick(index) {
    return (curname, params) => {
      let newParamsList = closeRightTabsAndAddNewTab(
        this.state.methodsParamsList,
        index,
        curname,
        params
      );
      this.setState({
        methodsParamsList: newParamsList
      });
    };
  }
  //  处理常量输入
  handleConstantsInput = val => {
    val = val.replace(/^\{\{(.+)\}\}$/g, '$1');
    this.setState({
      constantInput: val
    });
    this.mockClick(0)(val);
  };

  handleParamsInput = (e, clickIndex, paramsIndex) => {
    let newParamsList = deepEqual(this.state.methodsParamsList);
    newParamsList[clickIndex].params[paramsIndex] = e;
    this.setState({
      methodsParamsList: newParamsList
    });
  };

  // 方法
  MethodsListSource = props => {
    return (
      <MethodsList
        click={this.mockClick(props.index)}
        clickValue={props.value}
        params={props.params}
        paramsInput={this.handleParamsInput}
        clickIndex={props.index}
      />
    );
  };

  //  处理表达式
  handleValue(val) {
    return handleParamsValue(val, {});
  }

  // 处理错误
  handleError() {
    return (
      <Alert
        message={intl.get('ModalPostman.index.请求“变量集”尚未运')}
        type="warning"
      />
    );
  }

  // 初始化
  setInit() {
    let initParamsList = [
      {
        name: '',
        params: [],
        type: 'dataSource'
      }
    ];
    this.setState({
      methodsParamsList: initParamsList
    });
  }
  // 处理取消插入
  handleCancel = () => {
    this.setInit();
    this.props.handleCancel();
  };

  // 处理插入
  handleOk = installValue => {
    this.props.handleOk(installValue);
    this.setInit();
  };
  // 处理面板切换
  handleCollapse = key => {
    this.setState({
      activeKey: key
    });
  };

  render() {
    const { visible, envType } = this.props;
    const { methodsParamsList, constantInput } = this.state;

    const outputParams = () => {
      let str = '';
      let length = methodsParamsList.length;
      methodsParamsList.forEach((item, index) => {
        let isShow = item.name && length - 2 !== index;
        str += item.name;
        item.params.forEach((item, index) => {
          let isParams = index > 0;
          str += isParams ? ' , ' : ' : ';
          str += item;
        });
        str += isShow ? ' | ' : '';
      });
      return '{{ ' + str + ' }}';
    };

    return (
      <Modal
        title={
          <p>
            <Icon type="edit" /> {intl.get('ModalPostman.index.高级参数设置')}</p>
        }
        visible={visible}
        onOk={() => this.handleOk(outputParams())}
        onCancel={this.handleCancel}
        wrapClassName="modal-postman"
        width={1024}
        maskClosable={false}
        okText={intl.get('ModalPostman.index.插入')}
      >
        <Row className="modal-postman-form" type="flex">
          {methodsParamsList.map((item, index) => {
            return item.type === 'dataSource' ? (
              <Col span={8} className="modal-postman-col" key={index}>
                <Collapse
                  className="modal-postman-collapse"
                  activeKey={this.state.activeKey}
                  onChange={this.handleCollapse}
                  bordered={false}
                  accordion
                >
                  <Panel header={<h3 className="mock-title">{intl.get('ModalPostman.index.常量')}</h3>} key="1">
                    <Input
                      placeholder={intl.get('ModalPostman.index.基础参数值')}
                      value={constantInput}
                      onChange={e => this.handleConstantsInput(e.target.value, index)}
                    />
                  </Panel>
                  <Panel header={<h3 className="mock-title">{intl.get('ModalPostman.index.mock数据')}</h3>} key="2">
                    <MockList click={this.mockClick(index)} clickValue={item.name} />
                  </Panel>
                  {envType === 'case' && (
                    <Panel
                      header={
                        <h3 className="mock-title">
                          {intl.get('ModalPostman.index.变量&nbsp;')}<Tooltip
                            placement="top"
                            title={intl.get('ModalPostman.index.YApi 提供了强大')}
                          >
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </h3>
                      }
                      key="3"
                    >
                      <VariablesSelect
                        id={this.props.id}
                        click={this.mockClick(index)}
                        clickValue={item.name}
                      />
                    </Panel>
                  )}
                </Collapse>
              </Col>
            ) : (
              <Col span={8} className="modal-postman-col" key={index}>
                <this.MethodsListSource index={index} value={item.name} params={item.params} />
              </Col>
            );
          })}
        </Row>
        <Row className="modal-postman-expression">
          <Col span={6}>
            <h3 className="title">{intl.get('ModalPostman.index.表达式')}</h3>
          </Col>
          <Col span={18}>
            <span className="expression-item">{outputParams()}</span>
          </Col>
        </Row>
        <Row className="modal-postman-preview">
          <Col span={6}>
            <h3 className="title">{intl.get('ModalPostman.index.预览')}</h3>
          </Col>
          <Col span={18}>
            <h3>{this.handleValue(outputParams()) || (outputParams() && this.handleError())}</h3>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default ModalPostman;
