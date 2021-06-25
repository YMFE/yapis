import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { changeStudyTip, finishStudy } from '../../reducer/modules/user.js';
import intl from "react-intl-universal";

@connect(
  null,
  {
    changeStudyTip,
    finishStudy
  }
)
class GuideBtns extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    changeStudyTip: PropTypes.func,
    finishStudy: PropTypes.func,
    isLast: PropTypes.bool
  };

  // 点击下一步
  nextStep = () => {
    this.props.changeStudyTip();
    if (this.props.isLast) {
      this.props.finishStudy();
    }
  };

  // 点击退出指引
  exitGuide = () => {
    this.props.finishStudy();
  };

  render() {
    return (
      <div className="btn-container">
        <Button className="btn" type="primary" onClick={this.nextStep}>
          {this.props.isLast ? intl.get('GuideBtns.GuideBtns.完 成') : intl.get('GuideBtns.GuideBtns.下一步')}
        </Button>
        <Button className="btn" type="dashed" onClick={this.exitGuide}>
          {intl.get('GuideBtns.GuideBtns.退出指引')}</Button>
      </div>
    );
  }
}
export default GuideBtns;
