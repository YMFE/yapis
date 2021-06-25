import React, { PureComponent as Component } from 'react';
import {
  Upload,
  Icon,
  message,
  Select,
  Tooltip,
  Button,
  Spin,
  Switch,
  Modal,
  Radio,
  Input,
  Checkbox
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ProjectData.scss';
import axios from 'axios';

import URL from 'url';

const Dragger = Upload.Dragger;
import { saveImportData } from '../../../../reducer/modules/interface';
import { fetchUpdateLogData } from '../../../../reducer/modules/news.js';
import { handleSwaggerUrlData } from '../../../../reducer/modules/project';
import intl from "react-intl-universal";

const Option = Select.Option;
const confirm = Modal.confirm;
const plugin = require('client/plugin.js');
const RadioGroup = Radio.Group;
const importDataModule = {};
const exportDataModule = {};
const HandleImportData = require('common/HandleImportData');
function handleExportRouteParams(url, status, isWiki) {
  if (!url) {
    return;
  }
  let urlObj = URL.parse(url, true),
    query = {};
  query = Object.assign(query, urlObj.query, { status, isWiki });
  return URL.format({
    pathname: urlObj.pathname,
    query
  });
}

// exportDataModule.pdf = {
//   name: 'Pdf',
//   route: '/api/interface/download_crx',
//   desc: '导出项目接口文档为 pdf 文件'
// }
@connect(
  state => {
    return {
      curCatid: -(-state.inter.curdata.catid),
      basePath: state.project.currProject.basepath,
      updateLogList: state.news.updateLogList,
      swaggerUrlData: state.project.swaggerUrlData
    };
  },
  {
    saveImportData,
    fetchUpdateLogData,
    handleSwaggerUrlData
  }
)
class ProjectData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectCatid: '',
      menuList: [],
      curImportType: 'swagger',
      curExportType: null,
      showLoading: false,
      dataSync: 'merge',
      exportContent: 'all',
      isSwaggerUrl: false,
      swaggerUrl: '',
      isWiki: false
    };
  }
  static propTypes = {
    match: PropTypes.object,
    curCatid: PropTypes.number,
    basePath: PropTypes.string,
    saveImportData: PropTypes.func,
    fetchUpdateLogData: PropTypes.func,
    updateLogList: PropTypes.array,
    handleSwaggerUrlData: PropTypes.func,
    swaggerUrlData: PropTypes.string
  };

  componentWillMount() {
    axios.get(`/api/interface/getCatMenu?project_id=${this.props.match.params.id}`).then(data => {
      if (data.data.errcode === 0) {
        let menuList = data.data.data;
        this.setState({
          menuList: menuList,
          selectCatid: menuList[0]._id
        });
      }
    });
    plugin.emitHook('import_data', importDataModule);
    plugin.emitHook('export_data', exportDataModule, this.props.match.params.id);
  }

  selectChange(value) {
    this.setState({
      selectCatid: +value
    });
  }

  uploadChange = info => {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  handleAddInterface = async res => {
    return await HandleImportData(
      res,
      this.props.match.params.id,
      this.state.selectCatid,
      this.state.menuList,
      this.props.basePath,
      this.state.dataSync,
      message.error,
      message.success,
      () => this.setState({ showLoading: false })
    );
  };

  // 本地文件上传
  handleFile = info => {
    if (!this.state.curImportType) {
      return message.error(intl.get('ProjectData.ProjectData.请选择导入数据的方式'));
    }
    if (this.state.selectCatid) {
      this.setState({ showLoading: true });
      let reader = new FileReader();
      reader.readAsText(info.file);
      reader.onload = async res => {
        res = await importDataModule[this.state.curImportType].run(res.target.result);
        if (this.state.dataSync === 'merge') {
          // 开启同步
          this.showConfirm(res);
        } else {
          // 未开启同步
          await this.handleAddInterface(res);
        }
      };
    } else {
      message.error(intl.get('ProjectData.ProjectData.请选择上传的默认分类'));
    }
  };

  showConfirm = async res => {
    let that = this;
    let typeid = this.props.match.params.id;
    let apiCollections = res.apis.map(item => {
      return {
        method: item.method,
        path: item.path
      };
    });
    let result = await this.props.fetchUpdateLogData({
      type: 'project',
      typeid,
      apis: apiCollections
    });
    let domainData = result.payload.data.data;
    const ref = confirm({
      title: intl.get('ProjectData.ProjectData.您确认要进行数据同步'),
      width: 600,
      okType: 'danger',
      iconType: 'exclamation-circle',
      className: 'dataImport-confirm',
      okText: intl.get('ProjectData.ProjectData.确认'),
      cancelText: intl.get('ProjectData.ProjectData.取消'),
      content: (
        <div className="postman-dataImport-modal">
          <div className="postman-dataImport-modal-content">
            {domainData.map((item, index) => {
              return (
                <div key={index} className="postman-dataImport-show-diff">
                  <span className="logcontent" dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              );
            })}
          </div>
          <p className="info">{intl.get('ProjectData.ProjectData.温馨提示： 数据同步')}</p>
        </div>
      ),
      async onOk() {
        await that.handleAddInterface(res);
      },
      onCancel() {
        that.setState({ showLoading: false, dataSync: 'normal' });
        ref.destroy();
      }
    });
  };

  handleImportType = val => {
    this.setState({
      curImportType: val,
      isSwaggerUrl: false
    });
  };

  handleExportType = val => {
    this.setState({
      curExportType: val,
      isWiki: false
    });
  };

  // 处理导入信息同步
  onChange = checked => {
    this.setState({
      dataSync: checked
    });
  };

  // 处理swagger URL 导入
  handleUrlChange = checked => {
    this.setState({
      isSwaggerUrl: checked
    });
  };

  // 记录输入的url
  swaggerUrlInput = url => {
    this.setState({
      swaggerUrl: url
    });
  };

  // url导入上传
  onUrlUpload = async () => {
    if (!this.state.curImportType) {
      return message.error(intl.get('ProjectData.ProjectData.请选择导入数据的方式'));
    }

    if (!this.state.swaggerUrl) {
      return message.error(intl.get('ProjectData.ProjectData.url 不能为空'));
    }
    if (this.state.selectCatid) {
      this.setState({ showLoading: true });
      try {
        // 处理swagger url 导入
        await this.props.handleSwaggerUrlData(this.state.swaggerUrl);
        // let result = json5_parse(this.props.swaggerUrlData)
        let res = await importDataModule[this.state.curImportType].run(this.props.swaggerUrlData);
        if (this.state.dataSync === 'merge') {
          // merge
          this.showConfirm(res);
        } else {
          // 未开启同步
          await this.handleAddInterface(res);
        }
      } catch (e) {
        this.setState({ showLoading: false });
        message.error(e.message);
      }
    } else {
      message.error(intl.get('ProjectData.ProjectData.请选择上传的默认分类'));
    }
  };

  // 处理导出接口是全部还是公开
  handleChange = e => {
    this.setState({ exportContent: e.target.value });
  };

  //  处理是否开启wiki导出
  handleWikiChange = e => {
    this.setState({
      isWiki: e.target.checked
    });
  };

  /**
   *
   *
   * @returns
   * @memberof ProjectData
   */
  render() {
    const uploadMess = {
      name: 'interfaceData',
      multiple: true,
      showUploadList: false,
      action: '/api/interface/interUpload',
      customRequest: this.handleFile,
      onChange: this.uploadChange
    };

    let exportUrl =
      this.state.curExportType &&
      exportDataModule[this.state.curExportType] &&
      exportDataModule[this.state.curExportType].route;
    let exportHref = handleExportRouteParams(
      exportUrl,
      this.state.exportContent,
      this.state.isWiki
    );

    // console.log('inter', this.state.exportContent);
    return (
      <div className="g-row">
        <div className="m-panel">
          <div className="postman-dataImport">
            <div className="dataImportCon">
              <div>
                <h3>
                  {intl.get('ProjectData.ProjectData.数据导入&nbsp;')}<a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://hellosean1025.github.io/yapi/documents/data.html"
                  >
                    <Tooltip title={intl.get('ProjectData.ProjectData.点击查看文档')}>
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </a>
                </h3>
              </div>
              <div className="dataImportTile">
                <Select
                  placeholder={intl.get('ProjectData.ProjectData.请选择导入数据的方式')}
                  value={this.state.curImportType}
                  onChange={this.handleImportType}
                >
                  {Object.keys(importDataModule).map(name => {
                    return (
                      <Option key={name} value={name}>
                        {importDataModule[name].name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <div className="catidSelect">
                <Select
                  value={this.state.selectCatid + ''}
                  showSearch
                  style={{ width: '100%' }}
                  placeholder={intl.get('ProjectData.ProjectData.请选择数据导入的默认')}
                  optionFilterProp="children"
                  onChange={this.selectChange.bind(this)}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.menuList.map((item, key) => {
                    return (
                      <Option key={key} value={item._id + ''}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <div className="dataSync">
                <span className="label">
                  {intl.get('ProjectData.ProjectData.数据同步&nbsp;')}<Tooltip
                    title={
                      <div>
                        <h3 style={{ color: 'white' }}>{intl.get('ProjectData.ProjectData.普通模式')}</h3>
                        <p>{intl.get('ProjectData.ProjectData.不导入已存在的接口')}</p>
                        <br />
                        <h3 style={{ color: 'white' }}>{intl.get('ProjectData.ProjectData.智能合并')}</h3>
                        <p>
                          {intl.get('ProjectData.ProjectData.已存在的接口，将合并')}</p>
                        <br />
                        <h3 style={{ color: 'white' }}>{intl.get('ProjectData.ProjectData.完全覆盖')}</h3>
                        <p>{intl.get('ProjectData.ProjectData.不保留旧数据，完全使')}</p>
                      </div>
                    }
                  >
                    <Icon type="question-circle-o" />
                  </Tooltip>{' '}
                </span>
                <Select value={this.state.dataSync} onChange={this.onChange}>
                  <Option value="normal">{intl.get('ProjectData.ProjectData.普通模式')}</Option>
                  <Option value="good">{intl.get('ProjectData.ProjectData.智能合并')}</Option>
                  <Option value="merge">{intl.get('ProjectData.ProjectData.完全覆盖')}</Option>
                </Select>

                {/* <Switch checked={this.state.dataSync} onChange={this.onChange} /> */}
              </div>
              {this.state.curImportType === 'swagger' && (
                <div className="dataSync">
                  <span className="label">
                    {intl.get('ProjectData.ProjectData.开启url导入&nb')}<Tooltip title={intl.get('ProjectData.ProjectData.swagger ur')}>
                      <Icon type="question-circle-o" />
                    </Tooltip>{' '}
                    &nbsp;&nbsp;
                  </span>

                  <Switch checked={this.state.isSwaggerUrl} onChange={this.handleUrlChange} />
                </div>
              )}
              {this.state.isSwaggerUrl ? (
                <div className="import-content url-import-content">
                  <Input
                    placeholder="http://demo.swagger.io/v2/swagger.json"
                    onChange={e => this.swaggerUrlInput(e.target.value)}
                  />
                  <Button
                    type="primary"
                    className="url-btn"
                    onClick={this.onUrlUpload}
                    loading={this.state.showLoading}
                  >
                    {intl.get('ProjectData.ProjectData.上传')}</Button>
                </div>
              ) : (
                <div className="import-content">
                  <Spin spinning={this.state.showLoading} tip={intl.get('ProjectData.ProjectData.上传中...')}>
                    <Dragger {...uploadMess}>
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-text">{intl.get('ProjectData.ProjectData.点击或者拖拽文件到上')}</p>
                      <p
                        className="ant-upload-hint"
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        dangerouslySetInnerHTML={{
                          __html: this.state.curImportType
                            ? importDataModule[this.state.curImportType].desc
                            : null
                        }}
                      />
                    </Dragger>
                  </Spin>
                </div>
              )}
            </div>

            <div
              className="dataImportCon"
              style={{
                marginLeft: '20px',
                display: Object.keys(exportDataModule).length > 0 ? '' : 'none'
              }}
            >
              <div>
                <h3>{intl.get('ProjectData.ProjectData.数据导出')}</h3>
              </div>
              <div className="dataImportTile">
                <Select placeholder={intl.get('ProjectData.ProjectData.请选择导出数据的方式')} onChange={this.handleExportType}>
                  {Object.keys(exportDataModule).map(name => {
                    return (
                      <Option key={name} value={name}>
                        {exportDataModule[name].name}
                      </Option>
                    );
                  })}
                </Select>
              </div>

              <div className="dataExport">
                <RadioGroup defaultValue="all" onChange={this.handleChange}>
                  <Radio value="all">{intl.get('ProjectData.ProjectData.全部接口')}</Radio>
                  <Radio value="open">{intl.get('ProjectData.ProjectData.公开接口')}</Radio>
                </RadioGroup>
              </div>
              <div className="export-content">
                {this.state.curExportType ? (
                  <div>
                    <p className="export-desc">{exportDataModule[this.state.curExportType].desc}</p>
                    <a 
                      target="_blank"
                      rel="noopener noreferrer"
                      href={exportHref}>
                      <Button className="export-button" type="primary" size="large">
                        {' '}
                        {intl.get('ProjectData.ProjectData.导出')}{' '}
                      </Button>
                    </a>
                    <Checkbox
                      checked={this.state.isWiki}
                      onChange={this.handleWikiChange}
                      className="wiki-btn"
                      disabled={this.state.curExportType === 'json'}
                    >
                      {intl.get('ProjectData.ProjectData.添加wiki&nbs')}<Tooltip title={intl.get('ProjectData.ProjectData.开启后 html 和')}>
                        <Icon type="question-circle-o" />
                      </Tooltip>{' '}
                    </Checkbox>
                  </div>
                ) : (
                  <Button disabled className="export-button" type="primary" size="large">
                    {' '}
                    {intl.get('ProjectData.ProjectData.导出')}{' '}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectData;
