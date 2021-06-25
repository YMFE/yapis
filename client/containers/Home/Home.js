import './Home.scss';
import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Icon, Card } from 'antd';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import LogoSVG from '../../components/LogoSVG/index.js';
import { changeMenuItem } from '../../reducer/modules/menu';
import intl from "react-intl-universal";

const plugin = require('client/plugin.js');

const ThirdLogin = plugin.emitHook('third_login');
const HomeGuest = () => (
  <div className="g-body">
    <div className="m-bg">
      <div className="m-bg-mask m-bg-mask0" />
      <div className="m-bg-mask m-bg-mask1" />
      <div className="m-bg-mask m-bg-mask2" />
      <div className="m-bg-mask m-bg-mask3" />
    </div>
    <div className="main-one">
      <div className="container">
        <Row>
          <Col span={24}>
            <div className="home-header">
              <a href="#" className="item">
                YAPI
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://hellosean1025.github.io/yapi"
                className="item"
              >
                {intl.get('Home.Home.使用文档')}</a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={9} xs={24}>
            <div className="home-des">
              <div className="logo">
                <LogoSVG length="72px" />
                <span className="name">YAPI</span>
              </div>
              <div className="detail">
                {intl.get('Home.Home.高效、易用、功能强大')}<br />
                <span className="desc">{intl.get('Home.Home.旨在为开发、产品、测')}</span>
              </div>
              <div className="btn-group">
                <Link to="/login">
                  <Button type="primary" className="btn-home btn-login">
                    {intl.get('Home.Home.登录 / 注册')}</Button>
                </Link>
                {ThirdLogin != null ? <ThirdLogin /> : null}
              </div>
            </div>
          </Col>
          <Col lg={15} xs={0} className="col-img">
            <div className="img-container">
              
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div className="feat-part section-feature">
      <div className="container home-section">
        <h3 className="title">{intl.get('Home.Home.为API开发者设计的')}</h3>
        <span className="desc">
          {intl.get('Home.Home.YApi让接口开发更')}</span>
        <Row key="feat-motion-row">
          <Col span={8} className="section-item" key="feat-wrapper-1">
            <Icon type="appstore-o" className="img" />
            <h4 className="title">{intl.get('Home.Home.项目管理')}</h4>
            <span className="desc">{intl.get('Home.Home.提供基本的项目分组，')}</span>
          </Col>
          <Col span={8} className="section-item" key="feat-wrapper-2">
            <Icon type="api" className="img" />
            <h4 className="title">{intl.get('Home.Home.接口管理')}</h4>
            <span className="desc">
              {intl.get('Home.Home.友好的接口文档，基于')}</span>
          </Col>
          <Col span={8} className="section-item" key="feat-wrapper-3">
            <Icon type="database" className="img" />
            <h4 className="title">MockServer</h4>
            <span className="desc">{intl.get('Home.Home.基于Mockjs，使')}</span>
          </Col>
        </Row>
      </div>
    </div>
    <div className="feat-part m-mock m-skew home-section">
      <div className="m-skew-bg">
        <div className="m-bg-mask m-bg-mask0" />
        <div className="m-bg-mask m-bg-mask1" />
        <div className="m-bg-mask m-bg-mask2" />
      </div>
      <div className="container skew-container">
        <h3 className="title">{intl.get('Home.Home.功能强大的 Mock')}</h3>
        <span className="desc">{intl.get('Home.Home.你想要的 Mock')}</span>
        <Row className="row-card">
          <Col lg={12} xs={24} className="section-card">
            <Card title={intl.get('Home.Home.Mock 规则')}>
              <p className="mock-desc">
                {intl.get('Home.Home.通过学习一些简单的')}</p>
              <div className="code">
                <ol start="1">
                  <li className="item">
                    <span className="orderNum orderNum-first">1</span>
                    <span>
                      <span>&#123;&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="item">
                    <span className="orderNum">2</span>
                    <span>
                      &ensp;&ensp;&ensp;&ensp;<span className="string">
                        &quot;errcode|200-500&quot;
                      </span>
                      <span>
                        :&ensp;<span className="number">200</span>,&ensp;&ensp;
                      </span>
                    </span>
                  </li>
                  <li className="item">
                    <span className="orderNum">3</span>
                    <span>
                      &ensp;&ensp;&ensp;&ensp;<span className="string">&quot;errmsg|4-8&quot;</span>
                      <span>:&ensp;</span>
                      <span className="string">&quot;@string&quot;</span>
                      <span>,&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="item">
                    <span className="orderNum">4</span>
                    <span>
                      &ensp;&ensp;&ensp;&ensp;<span className="string">&quot;data&quot;</span>
                      <span>:&ensp;&#123;&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="item">
                    <span className="orderNum">5</span>
                    <span>
                      &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<span className="string">
                        &quot;boolean|1&quot;
                      </span>
                      <span>:&ensp;</span>
                      <span className="keyword">true</span>
                      <span>,&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="item">
                    <span className="orderNum">6</span>
                    <span>
                      &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<span className="string">
                        &quot;array|2&quot;
                      </span>
                      <span>
                        :&ensp;&#91;<span className="string">&quot;Bob&quot;</span>,&ensp;<span className="string">
                          &quot;Jim&quot;
                        </span>&#93;,&ensp;&ensp;
                      </span>
                    </span>
                  </li>
                  <li className="item">
                    <span className="orderNum">7</span>
                    <span>
                      &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<span className="string">
                        &quot;combine&quot;
                      </span>
                      <span>:&ensp;</span>
                      <span className="string">&quot;@boolean&ensp;&amp;&ensp;@array&quot;</span>
                      <span>&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="item">
                    <span className="orderNum">8</span>
                    <span>&ensp;&ensp;&ensp;&ensp;&#125;&ensp;&ensp;</span>
                  </li>
                  <li className="item">
                    <span className="orderNum orderNum-last">9</span>
                    <span>&#125;&ensp;&ensp;</span>
                  </li>
                </ol>
              </div>
            </Card>
          </Col>
          <Col lg={12} xs={24} className="section-card mock-after">
            <Card title={intl.get('Home.Home.生成的 Mock 数')}>
              <p className="mock-desc">
                {intl.get('Home.Home.生成的 Mock 数')}</p>
              <div className="code">
                <ol start="1">
                  <li className="alt">
                    <span className="orderNum orderNum-first">1</span>
                    <span>
                      <span>&#123;&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="">
                    <span className="orderNum">2</span>
                    <span>
                      &ensp;&ensp;<span className="string">&quot;errcode&quot;</span>
                      <span>:&ensp;</span>
                      <span className="number">304</span>
                      <span>,&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="alt">
                    <span className="orderNum">3</span>
                    <span>
                      &ensp;&ensp;<span className="string">&quot;errmsg&quot;</span>
                      <span>:&ensp;</span>
                      <span className="string">&quot;JtkMIoRu)N#ie^h%Z77[F)&quot;</span>
                      <span>,&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="">
                    <span className="orderNum">4</span>
                    <span>
                      &ensp;&ensp;<span className="string">&quot;data&quot;</span>
                      <span>:&ensp;&#123;&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="alt">
                    <span className="orderNum">5</span>
                    <span>
                      &ensp;&ensp;&ensp;&ensp;<span className="string">&quot;boolean&quot;</span>
                      <span>:&ensp;</span>
                      <span className="keyword">true</span>
                      <span>,&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="">
                    <span className="orderNum">6</span>
                    <span>
                      &ensp;&ensp;&ensp;&ensp;<span className="string">&quot;array&quot;</span>
                      <span>
                        :&ensp;
                      </span>&#91;<span className="string">&quot;Bob&quot;</span>,&ensp;<span className="string">
                        &quot;Jim&quot;
                      </span>,&ensp;<span className="string">&quot;Bob&quot;</span>,&ensp;<span className="string">
                        &quot;Jim&quot;
                      </span>&#93;<span>,&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="alt">
                    <span className="orderNum">7</span>
                    <span>
                      &ensp;&ensp;&ensp;&ensp;<span className="string">&quot;combine&quot;</span>
                      <span>:&ensp;</span>
                      <span className="string">
                        &quot;true & Bob,&ensp;Jim,&ensp;Bob,&ensp;Jim&quot;
                      </span>
                      <span>&ensp;&ensp;</span>
                    </span>
                  </li>
                  <li className="">
                    <span className="orderNum">8</span>
                    <span>&ensp;&ensp;&#125;&ensp;&ensp;</span>
                  </li>
                  <li className="alt">
                    <span className="orderNum orderNum-last">9</span>
                    <span>&#125;&ensp;&ensp;</span>
                  </li>
                </ol>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
    <div className="home-section section-manage">
      <div className="container">
        <Row className="row-card" style={{ marginBottom: '.48rem' }}>
          <Col lg={7} xs={10} className="section-card">
            <Card>
              <div className="section-block block-first">
                <h4>{intl.get('Home.Home.超级管理员(* N)')}</h4>
                <p className="item"> {intl.get('Home.Home.- 创建分组')}</p>
                <p className="item"> {intl.get('Home.Home.- 分配组长')}</p>
                <p className="item"> {intl.get('Home.Home.- 管理所有成员信息')}</p>
              </div>
              <div className="section-block block-second">
                <h4>{intl.get('Home.Home.组长(* N)')}</h4>
                <p className="item"> {intl.get('Home.Home.- 创建项目')}</p>
                <p className="item"> {intl.get('Home.Home.- 管理分组或项目的')}</p>
                <p className="item"> {intl.get('Home.Home.- 管理开发者与成员')}</p>
              </div>
              <div className="section-block block-third">
                <h4>{intl.get('Home.Home.开发者(* N) /')}</h4>
                <p className="item"> {intl.get('Home.Home.- 不允许创建分组')}</p>
                <p className="item"> {intl.get('Home.Home.- 不允许修改分组或')}</p>
              </div>
            </Card>
          </Col>
          <Col lg={17} xs={14} className="section-card manage-word">
            <Icon type="team" className="icon" />
            <h3 className="title">{intl.get('Home.Home.扁平化管理模式')}</h3>
            <p className="desc">
              {intl.get('Home.Home.接口管理的逻辑较为复')}</p>
            <p className="desc">
              {intl.get('Home.Home.YAPI')}</p>
          </Col>
        </Row>
      </div>
    </div>
  </div>
);
HomeGuest.propTypes = {
  introList: PropTypes.array
};

@connect(
  state => ({
    login: state.user.isLogin
  }),
  {
    changeMenuItem
  }
)
@withRouter
class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.login) {
      this.props.history.push('/group/261');
    }
  }

  componentDidMount() {}
  static propTypes = {
    introList: PropTypes.array,
    login: PropTypes.bool,
    history: PropTypes.object,
    changeMenuItem: PropTypes.func
  };
  toStart = () => {
    this.props.changeMenuItem('/group');
  };
  render() {
    return (
      <div className="home-main">
        <HomeGuest introList={this.props.introList} />
        <div className="row-tip">
          <div className="container">
            <div className="tip-title">
              <h3 className="title">{intl.get('Home.Home.准备好使用了吗？')}</h3>
              <p className="desc">{intl.get('Home.Home.注册账号尽请使用吧，')}</p>
            </div>
            <div className="tip-btns">
              <div className="btn-group">
                <Link to="/login">
                  <Button type="primary" className="btn-home btn-login">
                    {intl.get('Home.Home.登录 / 注册')}</Button>
                </Link>
                <Button className="btn-home btn-home-normal">
                  <a target="_blank" rel="noopener noreferrer" href="https://hellosean1025.github.io/yapi">
                    {intl.get('Home.Home.使用文档')}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Home.defaultProps={
//   introList:[{
//     title:"接口管理",
//     des:"满足你的所有接口管理需求。不再需要为每个项目搭建独立的接口管理平台和编写离线的接口文档，其权限管理和项目日志让协作开发不再痛苦。",
//     detail:[
//       {title:"团队协作",des:"多成员协作，掌握项目进度",iconType:"team"},
//       {title:"权限管理",des:"设置每个成员的操作权限",iconType:"usergroup-add"},
//       {title:"项目日志",des:"推送项目情况，掌握更新动态",iconType:"schedule"}
//     ],
//     img:"./image/demo-img.jpg"
//   },{
//     title:"接口测试",
//     des:"一键即可得到返回结果。根据用户的输入接口信息如协议、URL、接口名、请求头、请求参数、mock规则生成Mock接口，这些接口会自动生成模拟数据。",
//     detail:[
//       {title:"编辑接口",des:"团队开发时任何人都可以在权限许可下创建、修改接口",iconType:"tags-o"},
//       {title:"mock请求",des:"创建者可以自由构造需要的数据，支持复杂的生成逻辑",iconType:"fork"}
//     ],
//     img:"./image/demo-img.jpg"
//   }
//   ]
// };

export default Home;
