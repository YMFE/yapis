import React, { PureComponent as Component } from 'react';
import { Row, Col, Input, Button, Select, message, Upload, Tooltip } from 'antd';
import axios from 'axios';
import { formatTime } from '../../common.js';
import PropTypes from 'prop-types';
import { setBreadcrumb, setImageUrl } from '../../reducer/modules/user';
import { connect } from 'react-redux';
import intl from "react-intl-universal";

const EditButton = props => {
  const { isAdmin, isOwner, onClick, name, admin } = props;
  if (isOwner) {
    // 本人
    if (admin) {
      return null;
    }
    return (
      <Button
        icon="edit"
        onClick={() => {
          onClick(name, true);
        }}
      >
        {intl.get('User.Profile.修改')}</Button>
    );
  } else if (isAdmin) {
    // 管理员
    return (
      <Button
        icon="edit"
        onClick={() => {
          onClick(name, true);
        }}
      >
        {intl.get('User.Profile.修改')}</Button>
    );
  } else {
    return null;
  }
};
EditButton.propTypes = {
  isAdmin: PropTypes.bool,
  isOwner: PropTypes.bool,
  onClick: PropTypes.func,
  name: PropTypes.string,
  admin: PropTypes.bool
};

@connect(
  state => {
    return {
      curUid: state.user.uid,
      userType: state.user.type,
      curRole: state.user.role
    };
  },
  {
    setBreadcrumb
  }
)
class Profile extends Component {
  static propTypes = {
    match: PropTypes.object,
    curUid: PropTypes.number,
    userType: PropTypes.string,
    setBreadcrumb: PropTypes.func,
    curRole: PropTypes.string,
    upload: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      usernameEdit: false,
      emailEdit: false,
      secureEdit: false,
      roleEdit: false,
      userinfo: {}
    };
  }

  componentDidMount() {
    this._uid = this.props.match.params.uid;
    this.handleUserinfo(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.match.params.uid) {
      return;
    }
    if (this._uid !== nextProps.match.params.uid) {
      this.handleUserinfo(nextProps);
    }
  }

  handleUserinfo(props) {
    const uid = props.match.params.uid;
    this.getUserInfo(uid);
  }

  handleEdit = (key, val) => {
    var s = {};
    s[key] = val;
    this.setState(s);
  };

  getUserInfo = id => {
    var _this = this;
    const { curUid } = this.props;

    axios.get('/api/user/find?id=' + id).then(res => {
      _this.setState({
        userinfo: res.data.data,
        _userinfo: res.data.data
      });
      if (curUid === +id) {
        this.props.setBreadcrumb([{ name: res.data.data.username }]);
      } else {
        this.props.setBreadcrumb([{ name: intl.get('User.Profile.管理:') + res.data.data.username }]);
      }
    });
  };

  updateUserinfo = name => {
    var state = this.state;
    let value = this.state._userinfo[name];
    let params = { uid: state.userinfo.uid };
    params[name] = value;

    axios.post('/api/user/update', params).then(
      res => {
        let data = res.data;
        if (data.errcode === 0) {
          let userinfo = this.state.userinfo;
          userinfo[name] = value;
          this.setState({
            userinfo: userinfo
          });

          this.handleEdit(name + 'Edit', false);
          message.success(intl.get('User.Profile.更新用户信息成功'));
        } else {
          message.error(data.errmsg);
        }
      },
      err => {
        message.error(err.message);
      }
    );
  };

  changeUserinfo = e => {
    let dom = e.target;
    let name = dom.getAttribute('name');
    let value = dom.value;

    this.setState({
      _userinfo: {
        ...this.state._userinfo,
        [name]: value
      }
    });
  };

  changeRole = val => {
    let userinfo = this.state.userinfo;
    userinfo.role = val;
    this.setState({
      _userinfo: userinfo
    });
    this.updateUserinfo('role');
  };

  updatePassword = () => {
    let old_password = document.getElementById('old_password').value;
    let password = document.getElementById('password').value;
    let verify_pass = document.getElementById('verify_pass').value;
    if (password != verify_pass) {
      return message.error(intl.get('User.Profile.两次输入的密码不一样'));
    }
    let params = {
      uid: this.state.userinfo.uid,
      password: password,
      old_password: old_password
    };

    axios.post('/api/user/change_password', params).then(
      res => {
        let data = res.data;
        if (data.errcode === 0) {
          this.handleEdit('secureEdit', false);
          message.success(intl.get('User.Profile.修改密码成功'));
          if (this.props.curUid === this.state.userinfo.uid) {
            location.reload();
          }
        } else {
          message.error(data.errmsg);
        }
      },
      err => {
        message.error(err.message);
      }
    );
  };

  render() {
    let ButtonGroup = Button.Group;
    let userNameEditHtml, emailEditHtml, secureEditHtml, roleEditHtml;
    const Option = Select.Option;
    let userinfo = this.state.userinfo;
    let _userinfo = this.state._userinfo;
    let roles = { admin: intl.get('User.Profile.管理员'), member: intl.get('User.Profile.会员') };
    let userType = '';
    if (this.props.userType === 'third') {
      userType = false;
    } else if (this.props.userType === 'site') {
      userType = true;
    } else {
      userType = false;
    }

    // 用户名信息修改
    if (this.state.usernameEdit === false) {
      userNameEditHtml = (
        <div>
          <span className="text">{userinfo.username}</span>&nbsp;&nbsp;
          {/*<span className="text-button"  onClick={() => { this.handleEdit('usernameEdit', true) }}><Icon type="edit" />修改</span>*/}
          {/* {btn} */}
          {/* 站点登陆才能编辑 */}
          {userType && (
            <EditButton
              userType={userType}
              isOwner={userinfo.uid === this.props.curUid}
              isAdmin={this.props.curRole === 'admin'}
              onClick={this.handleEdit}
              name="usernameEdit"
            />
          )}
        </div>
      );
    } else {
      userNameEditHtml = (
        <div>
          <Input
            value={_userinfo.username}
            name="username"
            onChange={this.changeUserinfo}
            placeholder={intl.get('User.Profile.用户名')}
          />
          <ButtonGroup className="edit-buttons">
            <Button
              className="edit-button"
              onClick={() => {
                this.handleEdit('usernameEdit', false);
              }}
            >
              {intl.get('User.Profile.取消')}</Button>
            <Button
              className="edit-button"
              onClick={() => {
                this.updateUserinfo('username');
              }}
              type="primary"
            >
              {intl.get('User.Profile.确定')}</Button>
          </ButtonGroup>
        </div>
      );
    }
    // 邮箱信息修改
    if (this.state.emailEdit === false) {
      emailEditHtml = (
        <div>
          <span className="text">{userinfo.email}</span>&nbsp;&nbsp;
          {/*<span className="text-button" onClick={() => { this.handleEdit('emailEdit', true) }} ><Icon type="edit" />修改</span>*/}
          {/* {btn} */}
          {/* 站点登陆才能编辑 */}
          {userType && (
            <EditButton
              admin={userinfo.role === 'admin'}
              isOwner={userinfo.uid === this.props.curUid}
              isAdmin={this.props.curRole === 'admin'}
              onClick={this.handleEdit}
              name="emailEdit"
            />
          )}
        </div>
      );
    } else {
      emailEditHtml = (
        <div>
          <Input
            placeholder="Email"
            value={_userinfo.email}
            name="email"
            onChange={this.changeUserinfo}
          />
          <ButtonGroup className="edit-buttons">
            <Button
              className="edit-button"
              onClick={() => {
                this.handleEdit('emailEdit', false);
              }}
            >
              {intl.get('User.Profile.取消')}</Button>
            <Button
              className="edit-button"
              type="primary"
              onClick={() => {
                this.updateUserinfo('email');
              }}
            >
              {intl.get('User.Profile.确定')}</Button>
          </ButtonGroup>
        </div>
      );
    }

    if (this.state.roleEdit === false) {
      roleEditHtml = (
        <div>
          <span className="text">{roles[userinfo.role]}</span>&nbsp;&nbsp;
        </div>
      );
    } else {
      roleEditHtml = (
        <Select defaultValue={_userinfo.role} onChange={this.changeRole} style={{ width: 150 }}>
          <Option value="admin">{intl.get('User.Profile.管理员')}</Option>
          <Option value="member">{intl.get('User.Profile.会员')}</Option>
        </Select>
      );
    }

    if (this.state.secureEdit === false) {
      let btn = '';
      if (userType) {
        btn = (
          <Button
            icon="edit"
            onClick={() => {
              this.handleEdit('secureEdit', true);
            }}
          >
            {intl.get('User.Profile.修改')}</Button>
        );
      }
      secureEditHtml = btn;
    } else {
      secureEditHtml = (
        <div>
          <Input
            style={{
              display: this.props.curRole === 'admin' && userinfo.role != 'admin' ? 'none' : ''
            }}
            placeholder={intl.get('User.Profile.旧的密码')}
            type="password"
            name="old_password"
            id="old_password"
          />
          <Input placeholder={intl.get('User.Profile.新的密码')} type="password" name="password" id="password" />
          <Input placeholder={intl.get('User.Profile.确认密码')} type="password" name="verify_pass" id="verify_pass" />
          <ButtonGroup className="edit-buttons">
            <Button
              className="edit-button"
              onClick={() => {
                this.handleEdit('secureEdit', false);
              }}
            >
              {intl.get('User.Profile.取消')}</Button>
            <Button className="edit-button" onClick={this.updatePassword} type="primary">
              {intl.get('User.Profile.确定')}</Button>
          </ButtonGroup>
        </div>
      );
    }
    return (
      <div className="user-profile">
        <div className="user-item-body">
          {userinfo.uid === this.props.curUid ? (
            <h3>{intl.get('User.Profile.个人设置')}</h3>
          ) : (
            <h3>{userinfo.username} {intl.get('User.Profile.资料设置')}</h3>
          )}

          <Row className="avatarCon" type="flex" justify="start">
            <Col span={24}>
              {userinfo.uid === this.props.curUid ? (
                <AvatarUpload uid={userinfo.uid}>{intl.get('User.Profile.点击上传头像')}</AvatarUpload>
              ) : (
                <div className="avatarImg">
                  <img src={`/api/user/avatar?uid=${userinfo.uid}`} />
                </div>
              )}
            </Col>
          </Row>
          <Row className="user-item" type="flex" justify="start">
            <div className="maoboli" />
            <Col span={4}>{intl.get('User.Profile.用户id')}</Col>
            <Col span={12}>{userinfo.uid}</Col>
          </Row>
          <Row className="user-item" type="flex" justify="start">
            <div className="maoboli" />
            <Col span={4}>{intl.get('User.Profile.用户名')}</Col>
            <Col span={12}>{userNameEditHtml}</Col>
          </Row>
          <Row className="user-item" type="flex" justify="start">
            <div className="maoboli" />
            <Col span={4}>Email</Col>
            <Col span={12}>{emailEditHtml}</Col>
          </Row>
          <Row
            className="user-item"
            style={{ display: this.props.curRole === 'admin' ? '' : 'none' }}
            type="flex"
            justify="start"
          >
            <div className="maoboli" />
            <Col span={4}>{intl.get('User.Profile.角色')}</Col>
            <Col span={12}>{roleEditHtml}</Col>
          </Row>
          <Row
            className="user-item"
            style={{ display: this.props.curRole === 'admin' ? '' : 'none' }}
            type="flex"
            justify="start"
          >
            <div className="maoboli" />
            <Col span={4}>{intl.get('User.Profile.登陆方式')}</Col>
            <Col span={12}>{userinfo.type === 'site' ? intl.get('User.Profile.站点登陆') : intl.get('User.Profile.第三方登陆')}</Col>
          </Row>
          <Row className="user-item" type="flex" justify="start">
            <div className="maoboli" />
            <Col span={4}>{intl.get('User.Profile.创建账号时间')}</Col>
            <Col span={12}>{formatTime(userinfo.add_time)}</Col>
          </Row>
          <Row className="user-item" type="flex" justify="start">
            <div className="maoboli" />
            <Col span={4}>{intl.get('User.Profile.更新账号时间')}</Col>
            <Col span={12}>{formatTime(userinfo.up_time)}</Col>
          </Row>

          {userType ? (
            <Row className="user-item" type="flex" justify="start">
              <div className="maoboli" />
              <Col span={4}>{intl.get('User.Profile.密码')}</Col>
              <Col span={12}>{secureEditHtml}</Col>
            </Row>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

@connect(
  state => {
    return {
      url: state.user.imageUrl
    };
  },
  {
    setImageUrl
  }
)
class AvatarUpload extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    uid: PropTypes.number,
    setImageUrl: PropTypes.func,
    url: PropTypes.any
  };
  uploadAvatar(basecode) {
    axios
      .post('/api/user/upload_avatar', { basecode: basecode })
      .then(() => {
        // this.setState({ imageUrl: basecode });
        this.props.setImageUrl(basecode);
      })
      .catch(e => {
        console.log(e);
      });
  }
  handleChange(info) {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, basecode => {
        this.uploadAvatar(basecode);
      });
    }
  }
  render() {
    const { url } = this.props;
    let imageUrl = url ? url : `/api/user/avatar?uid=${this.props.uid}`;
    // let imageUrl = this.state.imageUrl ? this.state.imageUrl : `/api/user/avatar?uid=${this.props.uid}`;
    // console.log(this.props.uid);
    return (
      <div className="avatar-box">
        <Tooltip
          placement="right"
          title={<div>{intl.get('User.Profile.点击头像更换 (只支')}</div>}
        >
          <div>
            <Upload
              className="avatar-uploader"
              name="basecode"
              showUploadList={false}
              action="/api/user/upload_avatar"
              beforeUpload={beforeUpload}
              onChange={this.handleChange.bind(this)}
            >
              {/*<Avatar size="large" src={imageUrl}  />*/}
              <div style={{ width: 100, height: 100 }}>
                <img className="avatar" src={imageUrl} />
              </div>
            </Upload>
          </div>
        </Tooltip>
        <span className="avatarChange" />
      </div>
    );
  }
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  if (!isJPG && !isPNG) {
    message.error(intl.get('User.Profile.图片的格式只能为 j'));
  }
  const isLt2M = file.size / 1024 / 1024 < 0.2;
  if (!isLt2M) {
    message.error(intl.get('User.Profile.图片必须小于 200'));
  }

  return (isPNG || isJPG) && isLt2M;
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default Profile;
