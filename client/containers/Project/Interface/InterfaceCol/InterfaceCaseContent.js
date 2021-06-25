import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { message, Tooltip, Input } from 'antd';
import { getEnv } from '../../../../reducer/modules/project';
import {
  fetchInterfaceColList,
  setColData,
  fetchCaseData,
  fetchCaseList
} from '../../../../reducer/modules/interfaceCol';
import { Postman } from '../../../../components';

import './InterfaceCaseContent.scss';
import intl from "react-intl-universal";

@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      currCase: state.interfaceCol.currCase,
      isShowCol: state.interfaceCol.isShowCol,
      currProject: state.project.currProject,
      projectEnv: state.project.projectEnv,
      curUid: state.user.uid
    };
  },
  {
    fetchInterfaceColList,
    fetchCaseData,
    setColData,
    fetchCaseList,
    getEnv
  }
)
@withRouter
export default class InterfaceCaseContent extends Component {
  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchCaseData: PropTypes.func,
    setColData: PropTypes.func,
    fetchCaseList: PropTypes.func,
    history: PropTypes.object,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    currCase: PropTypes.object,
    isShowCol: PropTypes.bool,
    currProject: PropTypes.object,
    getEnv: PropTypes.func,
    projectEnv: PropTypes.object,
    curUid: PropTypes.number
  };

  state = {
    isEditingCasename: true,
    editCasename: ''
  };

  constructor(props) {
    super(props);
  }

  getColId(colList, currCaseId) {
    let currColId = 0;
    colList.forEach(col => {
      col.caseList.forEach(caseItem => {
        if (+caseItem._id === +currCaseId) {
          currColId = col._id;
        }
      });
    });
    return currColId;
  }

  async componentWillMount() {
    const result = await this.props.fetchInterfaceColList(this.props.match.params.id);
    let { currCaseId } = this.props;
    const params = this.props.match.params;
    const { actionId } = params;
    currCaseId = +actionId || +currCaseId || result.payload.data.data[0].caseList[0]._id;
    let currColId = this.getColId(result.payload.data.data, currCaseId);
    // this.props.history.push('/project/' + params.id + '/interface/case/' + currCaseId);
    await this.props.fetchCaseData(currCaseId);
    this.props.setColData({ currCaseId: +currCaseId, currColId, isShowCol: false });
    // 获取当前case 下的环境变量
    await this.props.getEnv(this.props.currCase.project_id);
    // await this.getCurrEnv()

    this.setState({ editCasename: this.props.currCase.casename });
  }

  async componentWillReceiveProps(nextProps) {
    const oldCaseId = this.props.match.params.actionId;
    const newCaseId = nextProps.match.params.actionId;
    const { interfaceColList } = nextProps;
    let currColId = this.getColId(interfaceColList, newCaseId);
    if (oldCaseId !== newCaseId) {
      await this.props.fetchCaseData(newCaseId);
      this.props.setColData({ currCaseId: +newCaseId, currColId, isShowCol: false });
      await this.props.getEnv(this.props.currCase.project_id);
      // await this.getCurrEnv()
      this.setState({ editCasename: this.props.currCase.casename });
    }
  }

  savePostmanRef = postman => {
    this.postman = postman;
  };

  updateCase = async () => {
    const {
      case_env,
      req_params,
      req_query,
      req_headers,
      req_body_type,
      req_body_form,
      req_body_other,
      test_script,
      enable_script,
      test_res_body,
      test_res_header
    } = this.postman.state;

    const { editCasename: casename } = this.state;
    const { _id: id } = this.props.currCase;
    let params = {
      id,
      casename,
      case_env,
      req_params,
      req_query,
      req_headers,
      req_body_type,
      req_body_form,
      req_body_other,
      test_script,
      enable_script,
      test_res_body,
      test_res_header
    };

    const res = await axios.post('/api/col/up_case', params);
    if (this.props.currCase.casename !== casename) {
      this.props.fetchInterfaceColList(this.props.match.params.id);
    }
    if (res.data.errcode) {
      message.error(res.data.errmsg);
    } else {
      message.success(intl.get('InterfaceCol.InterfaceCaseContent.更新成功'));
      this.props.fetchCaseData(id);
    }
  };

  triggerEditCasename = () => {
    this.setState({
      isEditingCasename: true,
      editCasename: this.props.currCase.casename
    });
  };
  cancelEditCasename = () => {
    this.setState({
      isEditingCasename: false,
      editCasename: this.props.currCase.casename
    });
  };

  render() {
    const { currCase, currProject, projectEnv } = this.props;
    const { isEditingCasename, editCasename } = this.state;

    const data = Object.assign(
      {},
      currCase,
      {
        env: projectEnv.env,
        pre_script: currProject.pre_script,
        after_script: currProject.after_script
      },
      { _id: currCase._id }
    );

    return (
      <div style={{ padding: '6px 0' }} className="case-content">
        <div className="case-title">
          {!isEditingCasename && (
            <Tooltip title={intl.get('InterfaceCol.InterfaceCaseContent.点击编辑')} placement="bottom">
              <div className="case-name" onClick={this.triggerEditCasename}>
                {currCase.casename}
              </div>
            </Tooltip>
          )}

          {isEditingCasename && (
            <div className="edit-case-name">
              <Input
                value={editCasename}
                onChange={e => this.setState({ editCasename: e.target.value })}
                style={{ fontSize: 18 }}
              />
            </div>
          )}
          <span className="inter-link" style={{ margin: '0px 8px 0px 6px', fontSize: 12 }}>
            <Link
              className="text"
              to={`/project/${currCase.project_id}/interface/api/${currCase.interface_id}`}
            >
              {intl.get('InterfaceCol.InterfaceCaseContent.对应接口')}</Link>
          </span>
        </div>
        <div>
          {Object.keys(currCase).length > 0 && (
            <Postman
              data={data}
              type="case"
              saveTip={intl.get('InterfaceCol.InterfaceCaseContent.更新保存修改')}
              save={this.updateCase}
              ref={this.savePostmanRef}
              interfaceId={currCase.interface_id}
              projectId={currCase.project_id}
              curUid={this.props.curUid}
            />
          )}
        </div>
      </div>
    );
  }
}
