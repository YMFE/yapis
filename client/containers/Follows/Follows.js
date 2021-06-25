import React, { PureComponent as Component } from 'react';
import './Follows.scss';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { getFollowList } from '../../reducer/modules/follow';
import { setBreadcrumb } from '../../reducer/modules/user';
import ProjectCard from '../../components/ProjectCard/ProjectCard.js';
import ErrMsg from '../../components/ErrMsg/ErrMsg.js';
import intl from "react-intl-universal";

@connect(
  state => {
    return {
      data: state.follow.data,
      uid: state.user.uid
    };
  },
  {
    getFollowList,
    setBreadcrumb
  }
)
class Follows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  static propTypes = {
    getFollowList: PropTypes.func,
    setBreadcrumb: PropTypes.func,
    uid: PropTypes.number
  };

  receiveRes = () => {
    this.props.getFollowList(this.props.uid).then(res => {
      if (res.payload.data.errcode === 0) {
        this.setState({
          data: res.payload.data.data.list
        });
      }
    });
  };

  async componentWillMount() {
    this.props.setBreadcrumb([{ name: intl.get('Follows.Follows.我的关注') }]);
    this.props.getFollowList(this.props.uid).then(res => {
      if (res.payload.data.errcode === 0) {
        this.setState({
          data: res.payload.data.data.list
        });
      }
    });
  }

  render() {
    let data = this.state.data;
    data = data.sort((a, b) => {
      return b.up_time - a.up_time;
    });
    return (
      <div>
        <div className="g-row" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
          <Row gutter={16} className="follow-box pannel-without-tab">
            {data.length ? (
              data.map((item, index) => {
                return (
                  <Col xs={6} md={4} xl={3} key={index}>
                    <ProjectCard
                      projectData={item}
                      inFollowPage={true}
                      callbackResult={this.receiveRes}
                    />
                  </Col>
                );
              })
            ) : (
              <ErrMsg type="noFollow" />
            )}
          </Row>
        </div>
      </div>
    );
  }
}

export default Follows;
