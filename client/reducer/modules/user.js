import axios from 'axios';

// Actions
const LOGIN = 'yapi/user/LOGIN';
const LOGIN_OUT = 'yapi/user/LOGIN_OUT';
const LOGIN_TYPE = 'yapi/user/LOGIN_TYPE';
const GET_LOGIN_STATE = 'yapi/user/GET_LOGIN_STATE';
const REGISTER = 'yapi/user/REGISTER';
const ADD = 'yapi/user/ADD';
const SET_BREADCRUMB = 'yapi/user/SET_BREADCRUMB';
const CHANGE_STUDY_TIP = 'yapi/user/CHANGE_STUDY_TIP';
const FINISH_STUDY = 'yapi/user/FINISH_STUDY';
const SET_IMAGE_URL = 'yapi/user/SET_IMAGE_URL';

// Reducer
const LOADING_STATUS = 0;
const GUEST_STATUS = 1;
const MEMBER_STATUS = 2;
// Reducer user
const initialState = {
  isLogin: false,
  canRegister: true,
  isLDAP: false,
  userName: null,
  uid: null,
  email: '',
  loginState: LOADING_STATUS,
  loginWrapActiveKey: '1',
  role: '',
  type: '',
  // breadcrumb: [{
  //   name: 'name',
  //   href: 'group'
  // }, {
  //   name: '当前页面'
  // }]
  breadcrumb: [],
  studyTip: 0,
  study: false,
  imageUrl: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_LOGIN_STATE: {
      return {
        ...state,
        isLogin: action.payload.data.errcode == 0,
        isLDAP: action.payload.data.ladp,
        canRegister: action.payload.data.canRegister,
        role: action.payload.data.data ? action.payload.data.data.role : null,
        loginState: action.payload.data.errcode == 0 ? MEMBER_STATUS : GUEST_STATUS,
        userName: action.payload.data.data ? action.payload.data.data.username : null,
        uid: action.payload.data.data ? action.payload.data.data._id : null,
        type: action.payload.data.data ? action.payload.data.data.type : null,
        study: action.payload.data.data ? action.payload.data.data.study : false
      };
    }
    case LOGIN: {
      if (action.payload.data.errcode === 0) {
        return {
          ...state,
          isLogin: true,
          loginState: MEMBER_STATUS,
          uid: action.payload.data.data.uid,
          userName: action.payload.data.data.username,
          role: action.payload.data.data.role,
          type: action.payload.data.data.type,
          study: action.payload.data.data.study
        };
      } else {
        return state;
      }
    }
    case LOGIN_OUT: {
      return {
        ...state,
        isLogin: false,
        loginState: GUEST_STATUS,
        userName: null,
        uid: null,
        role: '',
        type: ''
      };
    }
    case LOGIN_TYPE: {
      return {
        ...state,
        loginWrapActiveKey: action.index
      };
    }
    case REGISTER: {
      return {
        ...state,
        isLogin: true,
        loginState: MEMBER_STATUS,
        uid: action.payload.data.data.uid,
        userName: action.payload.data.data.username,
        type: action.payload.data.data.type,
        study: action.payload.data.data ? action.payload.data.data.study : false
      };
    }
    case ADD: {
      return {
        ...state,
        isLogin: true,
        loginState: MEMBER_STATUS,
        uid: action.payload.data.data.uid,
        userName: action.payload.data.data.username,
        type: action.payload.data.data.type,
        study: action.payload.data.data ? action.payload.data.data.study : false
      };
    }
    case SET_BREADCRUMB: {
      return {
        ...state,
        breadcrumb: action.data
      };
    }
    case CHANGE_STUDY_TIP: {
      return {
        ...state,
        studyTip: state.studyTip + 1
      };
    }
    case FINISH_STUDY: {
      return {
        ...state,
        study: true,
        studyTip: 0
      };
    }
    case SET_IMAGE_URL: {
      // console.log('state', state);
      return {
        ...state,
        imageUrl: action.data
      };
    }
    default:
      return state;
  }
};

// Action Creators
export function checkLoginState() {
  return {
    type: GET_LOGIN_STATE,
    payload: axios.get('/api/user/status')
  };
}

export function loginActions(data) {
  return {
    type: LOGIN,
    payload: axios.post('/api/user/login', data)
  };
}

export function loginLdapActions(data) {
  return {
    type: LOGIN,
    payload: axios.post('/api/user/login_by_ldap', data)
  };
}

export function regActions(data) {
  const { email, password, userName } = data;
  const param = {
    email,
    password,
    username: userName
  };
  return {
    type: REGISTER,
    payload: axios.post('/api/user/reg', param)
  };
}
export function addActions(data) {
  const { email, password, userName } = data;
  const param = {
    email,
    password,
    username: userName
  };
  return {
    type: ADD,
    payload: axios.post('/api/user/add', param)
  };
}

export function logoutActions() {
  return {
    type: LOGIN_OUT,
    payload: axios.get('/api/user/logout')
  };
}

export function loginTypeAction(index) {
  return {
    type: LOGIN_TYPE,
    index
  };
}

export function setBreadcrumb(data) {
  return {
    type: SET_BREADCRUMB,
    data
  };
}

export function setImageUrl(data) {
  return {
    type: SET_IMAGE_URL,
    data
  };
}

export function changeStudyTip() {
  return {
    type: CHANGE_STUDY_TIP
  };
}

export function finishStudy() {
  return {
    type: FINISH_STUDY,
    payload: axios.get('/api/user/up_study')
  };
}
