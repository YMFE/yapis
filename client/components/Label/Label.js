import React, { Component } from 'react';
import { Icon, Input, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import './Label.scss';
import intl from "react-intl-universal";

export default class Label extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputShow: false,
      inputValue: ''
    };
  }
  static propTypes = {
    onChange: PropTypes.func,
    desc: PropTypes.string,
    cat_name: PropTypes.string
  };
  toggle = () => {
    this.setState({ inputShow: !this.state.inputShow });
  };
  handleChange = event => {
    this.setState({ inputValue: event.target.value });
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.desc === nextProps.desc) {
      this.setState({
        inputShow: false
      });
    }
  }
  render() {
    return (
      <div>
        {this.props.desc && (
          <div className="component-label">
            {!this.state.inputShow ? (
              <div>
                <p>
                  {this.props.desc} &nbsp;&nbsp;
                  <Tooltip title={intl.get('Label.Label.编辑简介')}>
                    <Icon onClick={this.toggle} className="interface-delete-icon" type="edit" />
                  </Tooltip>
                </p>
              </div>
            ) : (
              <div className="label-input-wrapper">
                <Input onChange={this.handleChange} defaultValue={this.props.desc} size="small" />
                <Icon
                  className="interface-delete-icon"
                  onClick={() => {
                    this.props.onChange(this.state.inputValue);
                    this.toggle();
                  }}
                  type="check"
                />
                <Icon className="interface-delete-icon" onClick={this.toggle} type="close" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
