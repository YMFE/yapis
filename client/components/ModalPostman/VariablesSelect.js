import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import { connect } from 'react-redux';
import { fetchVariableParamsList } from '../../reducer/modules/interfaceCol.js';

const TreeNode = Tree.TreeNode;
const CanSelectPathPrefix = 'CanSelectPath-';

function deleteLastObject(str) {
  return str
    .split('.')
    .slice(0, -1)
    .join('.');
}

function deleteLastArr(str) {
  return str.replace(/\[.*?\]/g, '');
}

@connect(
  state => {
    return {
      currColId: state.interfaceCol.currColId
    };
  },
  {
    fetchVariableParamsList
  }
)
class VariablesSelect extends Component {
  static propTypes = {
    click: PropTypes.func,
    currColId: PropTypes.number,
    fetchVariableParamsList: PropTypes.func,
    clickValue: PropTypes.string,
    id: PropTypes.number,
    envType: PropTypes.string,
    variableSets: PropTypes.array
  };
  state = {
    records: [],
    expandedKeys: [],
    selectedKeys: []
  };

  handleRecordsData(id) {
    let newRecords = [];
    this.id = id;
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i]._id === id) {
        break;
      }
      newRecords.push(this.records[i]);
    }
    this.setState({
      records: newRecords
    });
  }

  async componentDidMount() {
    const { currColId, fetchVariableParamsList, clickValue, variableSets, envType } = this.props;

    if (envType === 'case') {
      let result = await fetchVariableParamsList(currColId);
      let records = result.payload.data.data;
      this.records = records.sort((a, b) => {
        return a.index - b.index;
      });
    } else {
      this.records = variableSets;
    }

    this.handleRecordsData(this.props.id);

    if (clickValue) {
      let isArrayParams = clickValue.lastIndexOf(']') === clickValue.length - 1;
      let key = isArrayParams ? deleteLastArr(clickValue) : deleteLastObject(clickValue);
      this.setState({
        expandedKeys: [key],
        selectedKeys: [CanSelectPathPrefix + clickValue]
      });
      // this.props.click(clickValue);
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (this.records && nextProps.id && this.id !== nextProps.id) {
      this.handleRecordsData(nextProps.id);
    }
  }

  handleSelect = key => {
    this.setState({
      selectedKeys: [key]
    });
    if (key && key.indexOf(CanSelectPathPrefix) === 0) {
      key = key.substr(CanSelectPathPrefix.length);
      this.props.click(key);
    } else {
      this.setState({
        expandedKeys: [key]
      });
    }
  };

  onExpand = keys => {
    this.setState({ expandedKeys: keys });
  };

  render() {
    const pathSelctByTree = (data, elementKeyPrefix = '$', deepLevel = 0) => {
      let keys = Object.keys(data);
      let TreeComponents = keys.map((key, index) => {
        let item = data[key],
          casename;
        if (deepLevel === 0) {
          elementKeyPrefix = '$';
          elementKeyPrefix = elementKeyPrefix + '.' + item._id;
          casename = item.casename;
          item = {
            params: item.params,
            body: item.body
          };
        } else if (Array.isArray(data)) {
          elementKeyPrefix =
            index === 0
              ? elementKeyPrefix + '[' + key + ']'
              : deleteLastArr(elementKeyPrefix) + '[' + key + ']';
        } else {
          elementKeyPrefix =
            index === 0
              ? elementKeyPrefix + '.' + key
              : deleteLastObject(elementKeyPrefix) + '.' + key;
        }
        if (item && typeof item === 'object') {
          const isDisable = Array.isArray(item) && item.length === 0;
          return (
            <TreeNode key={elementKeyPrefix} disabled={isDisable} title={casename || key}>
              {pathSelctByTree(item, elementKeyPrefix, deepLevel + 1)}
            </TreeNode>
          );
        }
        return <TreeNode key={CanSelectPathPrefix + elementKeyPrefix} title={key} />;
      });

      return TreeComponents;
    };

    return (
      <div className="modal-postman-form-variable">
        <Tree
          expandedKeys={this.state.expandedKeys}
          selectedKeys={this.state.selectedKeys}
          onSelect={([key]) => this.handleSelect(key)}
          onExpand={this.onExpand}
        >
          {pathSelctByTree(this.state.records)}
        </Tree>
      </div>
    );
  }
}

export default VariablesSelect;
