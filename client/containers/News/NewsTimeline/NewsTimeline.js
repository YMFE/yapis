import React, { PureComponent as Component } from 'react';
import { Timeline, Spin } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatTime } from '../../../common.js';
import { fetchNewsData } from '../../../reducer/modules/news.js';
import { timeago } from '../../../../common/utils';
import intl from "react-intl-universal";

// timeago(new Date().getTime() - 40);

@connect(
  state => {
    return {
      newsData: state.news.newsData,
      curpage: state.news.curpage
    };
  },
  {
    fetchNewsData: fetchNewsData
  }
)
class NewsTimeline extends Component {
  static propTypes = {
    newsData: PropTypes.object,
    fetchNewsData: PropTypes.func,

    setLoading: PropTypes.func,
    loading: PropTypes.bool,
    curpage: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      bidden: '',
      loading: false
    };
  }

  getMore() {
    const that = this;
    this.setState({ loading: true });
    this.props.fetchNewsData(21, 'project', this.props.curpage, 8).then(function() {
      that.setState({ loading: false });
      if (that.props.newsData.total + 1 === that.props.curpage) {
        that.setState({ bidden: 'logbidden' });
      }
    });
  }

  componentWillMount() {
    this.props.fetchNewsData(21, 'project', this.props.curpage, 8);
  }

  render() {
    let data = this.props.newsData ? this.props.newsData.list : [];
    if (data && data.length) {
      data = data.map(function(item, i) {
        return (
          <Timeline.Item key={i}>
            <span className="logoTimeago">{timeago(item.add_time)}</span>
            <span className="logusername">{item.username}</span>
            <span className="logtype">{item.type}</span>
            <span className="logtime">{formatTime(item.add_time)}</span>
            <span className="logcontent">{item.content}</span>
          </Timeline.Item>
        );
      });
    } else {
      data = '';
    }
    let pending = this.state.bidden ? (
      <a className={this.state.bidden}>{intl.get('NewsTimeline.NewsTimeline.以上为全部内容')}</a>
    ) : (
      <a className="loggetMore" onClick={this.getMore.bind(this)}>
        {intl.get('NewsTimeline.NewsTimeline.查看更多')}</a>
    );
    if (this.state.loading) {
      pending = <Spin />;
    }
    return (
      <section className="news-timeline">
        {data ? <Timeline pending={pending}>{data}</Timeline> : data}
      </section>
    );
  }
}

export default NewsTimeline;
