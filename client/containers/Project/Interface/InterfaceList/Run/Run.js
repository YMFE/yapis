import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';
import { message } from 'antd';
import { Postman } from '../../../../../components';
import AddColModal from './AddColModal';

// import {
// } from '../../../reducer/modules/group.js'

import './Run.scss';
import intl from "react-intl-universal";

@connect(state => ({
  currInterface: state.inter.curdata,
  currProject: state.project.currProject,
  curUid: state.user.uid
}))
@withRouter
export default class Run extends Component {
  static propTypes = {
    currProject: PropTypes.object,
    currInterface: PropTypes.object,
    match: PropTypes.object,
    curUid: PropTypes.number
  };

  state = {};

  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentWillReceiveProps() {}

  savePostmanRef = postman => {
    this.postman = postman;
  };

  saveCase = async (colId, caseName) => {
    const project_id = this.props.match.params.id;
    const interface_id = this.props.currInterface._id;
    const {
      case_env,
      req_params,
      req_query,
      req_headers,
      req_body_type,
      req_body_form,
      req_body_other
    } = this.postman.state;

    let params = {
      interface_id,
      casename: caseName,
      col_id: colId,
      project_id,
      case_env,
      req_params,
      req_query,
      req_headers,
      req_body_type,
      req_body_form,
      req_body_other
    };

    if (params.test_res_body && typeof params.test_res_body === 'object') {
      params.test_res_body = JSON.stringify(params.test_res_body, null, '   ');
    }

    const res = await axios.post('/api/col/add_case', params);
    if (res.data.errcode) {
      message.error(res.data.errmsg);
    } else {
      message.success(intl.get('Run.Run.添加成功'));
      this.setState({ saveCaseModalVisible: false });
    }
  };

  render() {
    const { currInterface, currProject } = this.props;
    const data = Object.assign({}, currInterface, {
      env: currProject.env,
      pre_script: currProject.pre_script,
      after_script: currProject.after_script
    });
    data.path = currProject.basepath + currInterface.path;
    return (
      <div>
        <Postman
          data={data}
          id={currProject._id}
          type="inter"
          saveTip={intl.get('Run.Run.保存到集合')}
          save={() => this.setState({ saveCaseModalVisible: true })}
          ref={this.savePostmanRef}
          interfaceId={currInterface._id}
          projectId={currInterface.project_id}
          curUid={this.props.curUid}
        />
        <AddColModal
          visible={this.state.saveCaseModalVisible}
          caseName={currInterface.title}
          onCancel={() => this.setState({ saveCaseModalVisible: false })}
          onOk={this.saveCase}
        />
      </div>
    );
  }
}
