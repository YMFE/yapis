import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Row, Col, Input } from 'antd';
import './ProjectTag.scss';
import intl from "react-intl-universal";

class ProjectTag extends Component {
  static propTypes = {
    tagMsg: PropTypes.array,
    tagSubmit: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      tag: [{ name: '', desc: '' }]
    };
  }

  initState(curdata) {
    let tag = [
      {
        name: '',
        desc: ''
      }
    ];
    if (curdata && curdata.length !== 0) {
      curdata.forEach(item => {
        tag.unshift(item);
      });
    }

    return { tag };
  }
  componentDidMount() {
    this.handleInit(this.props.tagMsg);
  }

  handleInit(data) {
    let newValue = this.initState(data);
    this.setState({ ...newValue });
  }

  addHeader = (val, index, name, label) => {
    let newValue = {};
    newValue[name] = [].concat(this.state[name]);
    newValue[name][index][label] = val;
    let nextData = this.state[name][index + 1];
    if (!(nextData && typeof nextData === 'object')) {
      let data = { name: '', desc: '' };
      newValue[name] = [].concat(this.state[name], data);
    }
    this.setState(newValue);
  };

  delHeader = (key, name) => {
    let curValue = this.state[name];
    let newValue = {};
    newValue[name] = curValue.filter((val, index) => {
      return index !== key;
    });
    this.setState(newValue);
  };

  handleChange = (val, index, name, label) => {
    let newValue = this.state;
    newValue[name][index][label] = val;
    this.setState(newValue);
  };

  render() {
    const commonTpl = (item, index, name) => {
      const length = this.state[name].length - 1;
      return (
        <Row key={index} className="tag-item">
          <Col span={6} className="item-name">
            <Input
              placeholder={`请输入 ${name} 名称`}
              // style={{ width: '200px' }}
              value={item.name || ''}
              onChange={e => this.addHeader(e.target.value, index, name, 'name')}
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder={intl.get('ProjectMessage.ProjectTag.请输入tag 描述信')}
              style={{ width: '90%', marginRight: 8 }}
              onChange={e => this.handleChange(e.target.value, index, name, 'desc')}
              value={item.desc || ''}
            />
          </Col>
          <Col span={2} className={index === length ? ' tag-last-row' : null}>
            {/* 新增的项中，只有最后一项没有有删除按钮 */}
            <Icon
              className="dynamic-delete-button delete"
              type="delete"
              onClick={e => {
                e.stopPropagation();
                this.delHeader(index, name);
              }}
            />
          </Col>
        </Row>
      );
    };

    return (
      <div className="project-tag">
        {this.state.tag.map((item, index) => {
          return commonTpl(item, index, 'tag');
        })}
      </div>
    );
  }
}

export default ProjectTag;
