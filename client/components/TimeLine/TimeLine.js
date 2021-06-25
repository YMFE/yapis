import React, { PureComponent as Component } from 'react';
import { Timeline, Spin, Row, Col, Tag, Avatar, Button, Modal, AutoComplete } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatTime } from '../../common.js';
import showDiffMsg from '../../../common/diff-view.js';
import variable from '../../constants/variable';
import { Link } from 'react-router-dom';
import { fetchNewsData, fetchMoreNews } from '../../reducer/modules/news.js';
import { fetchInterfaceList } from '../../reducer/modules/interface.js';
import ErrMsg from '../ErrMsg/ErrMsg.js';
const jsondiffpatch = require('jsondiffpatch/dist/jsondiffpatch.umd.js');
const formattersHtml = jsondiffpatch.formatters.html;
import 'jsondiffpatch/dist/formatters-styles/annotated.css';
import 'jsondiffpatch/dist/formatters-styles/html.css';
import './TimeLine.scss';
import { timeago } from '../../../common/utils.js';
import intl from "react-intl-universal";

// const Option = AutoComplete.Option;
const { Option, OptGroup } = AutoComplete;

const AddDiffView = props => {
  const { title, content, className } = props;

  if (!content) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="title">{title}</h3>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

AddDiffView.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string
};

// timeago(new Date().getTime() - 40);

@connect(
  state => {
    return {
      newsData: state.news.newsData,
      curpage: state.news.curpage,
      curUid: state.user.uid
    };
  },
  {
    fetchNewsData,
    fetchMoreNews,
    fetchInterfaceList
  }
)
class TimeTree extends Component {
  static propTypes = {
    newsData: PropTypes.object,
    fetchNewsData: PropTypes.func,
    fetchMoreNews: PropTypes.func,
    setLoading: PropTypes.func,
    loading: PropTypes.bool,
    curpage: PropTypes.number,
    typeid: PropTypes.number,
    curUid: PropTypes.number,
    type: PropTypes.string,
    fetchInterfaceList: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      bidden: '',
      loading: false,
      visible: false,
      curDiffData: {},
      apiList: []
    };
    this.curSelectValue = '';
  }

  getMore() {
    const that = this;

    if (this.props.curpage <= this.props.newsData.total) {
      this.setState({ loading: true });
      this.props
        .fetchMoreNews(
          this.props.typeid,
          this.props.type,
          this.props.curpage + 1,
          10,
          this.curSelectValue
        )
        .then(function() {
          that.setState({ loading: false });
          if (that.props.newsData.total === that.props.curpage) {
            that.setState({ bidden: 'logbidden' });
          }
        });
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  componentWillMount() {
    this.props.fetchNewsData(this.props.typeid, this.props.type, 1, 10);
    if (this.props.type === 'project') {
      this.getApiList();
    }
  }

  openDiff = data => {
    this.setState({
      curDiffData: data,
      visible: true
    });
  };

  async getApiList() {
    let result = await this.props.fetchInterfaceList({
      project_id: this.props.typeid,
      limit: 'all'
    });
    this.setState({
      apiList: result.payload.data.data.list
    });
  }

  handleSelectApi = selectValue => {
    this.curSelectValue = selectValue;
    this.props.fetchNewsData(this.props.typeid, this.props.type, 1, 10, selectValue);
  };

  render() {
    let data = this.props.newsData ? this.props.newsData.list : [];

    const curDiffData = this.state.curDiffData;
    let logType = {
      project: intl.get('TimeLine.TimeLine.项目'),
      group: intl.get('TimeLine.TimeLine.分组'),
      interface: intl.get('TimeLine.TimeLine.接口'),
      interface_col: intl.get('TimeLine.TimeLine.接口集'),
      user: intl.get('TimeLine.TimeLine.用户'),
      other: intl.get('TimeLine.TimeLine.其他')
    };

    const children = this.state.apiList.map(item => {
      let methodColor = variable.METHOD_COLOR[item.method ? item.method.toLowerCase() : 'get'];
      return (
        <Option title={item.title} value={item._id + ''} path={item.path} key={item._id}>
          {item.title}{' '}
          <Tag
            style={{ color: methodColor ? methodColor.color : '#cfefdf', backgroundColor: methodColor ? methodColor.bac : '#00a854', border: 'unset' }}
          >
            {item.method}
          </Tag>
        </Option>
      );
    });

    children.unshift(
      <Option value="" key="all">
        {intl.get('TimeLine.TimeLine.选择全部')}</Option>
    );

    if (data && data.length) {
      data = data.map((item, i) => {
        let interfaceDiff = false;
        // 去掉了 && item.data.interface_id
        if (item.data && typeof item.data === 'object') {
          interfaceDiff = true;
        }
        return (
          <Timeline.Item
            dot={
              <Link to={`/user/profile/${item.uid}`}>
                <Avatar src={`/api/user/avatar?uid=${item.uid}`} />
              </Link>
            }
            key={i}
          >
            <div className="logMesHeade">
              <span className="logoTimeago">{timeago(item.add_time)}</span>
              {/*<span className="logusername"><Link to={`/user/profile/${item.uid}`}><Icon type="user" />{item.username}</Link></span>*/}
              <span className="logtype">{logType[item.type]}{intl.get('TimeLine.TimeLine.动态')}</span>
              <span className="logtime">{formatTime(item.add_time)}</span>
            </div>
            <span className="logcontent" dangerouslySetInnerHTML={{ __html: item.content }} />
            <div style={{ padding: '10px 0 0 10px' }}>
              {interfaceDiff && <Button onClick={() => this.openDiff(item.data)}>{intl.get('TimeLine.TimeLine.改动详情')}</Button>}
            </div>
          </Timeline.Item>
        );
      });
    } else {
      data = '';
    }
    let pending =
      this.props.newsData.total <= this.props.curpage ? (
        <a className="logbidden">{intl.get('TimeLine.TimeLine.以上为全部内容')}</a>
      ) : (
        <a className="loggetMore" onClick={this.getMore.bind(this)}>
          {intl.get('TimeLine.TimeLine.查看更多')}</a>
      );
    if (this.state.loading) {
      pending = <Spin />;
    }
    let diffView = showDiffMsg(jsondiffpatch, formattersHtml, curDiffData);

    return (
      <section className="news-timeline">
        <Modal
          style={{ minWidth: '800px' }}
          title={intl.get('TimeLine.TimeLine.Api 改动日志')}
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <i>{intl.get('TimeLine.TimeLine.注： 绿色代表新增内')}</i>
          <div className="project-interface-change-content">
            {diffView.map((item, index) => {
              return (
                <AddDiffView
                  className="item-content"
                  title={item.title}
                  key={index}
                  content={item.content}
                />
              );
            })}
            {diffView.length === 0 && <ErrMsg type="noChange" />}
          </div>
        </Modal>
        {this.props.type === 'project' && (
          <Row className="news-search">
            <Col span="3">{intl.get('TimeLine.TimeLine.选择查询的 Api：')}</Col>
            <Col span="10">
              <AutoComplete
                onSelect={this.handleSelectApi}
                style={{ width: '100%' }}
                placeholder="Select Api"
                optionLabelProp="title"
                filterOption={(inputValue, options) => {
                  if (options.props.value == '') return true;
                  if (
                    options.props.path.indexOf(inputValue) !== -1 ||
                    options.props.title.indexOf(inputValue) !== -1
                  ) {
                    return true;
                  }
                  return false;
                }}
              >
                {/* {children} */}
                <OptGroup label="other">
                  <Option value="wiki" path="" title="wiki">
                    wiki
                  </Option>
                </OptGroup>
                <OptGroup label="api">{children}</OptGroup>
              </AutoComplete>
            </Col>
          </Row>
        )}
        {data ? (
          <Timeline className="news-content" pending={pending}>
            {data}
          </Timeline>
        ) : (
          <ErrMsg type="noData" />
        )}
      </section>
    );
  }
}

export default TimeTree;
