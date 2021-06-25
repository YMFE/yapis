let hooks, pluginModule;

/**
 * type component  组件
 *      listener   监听函数
 * mulit 是否绑定多个监听函数
 */

hooks = {
  /**
   * 第三方登录 //可参考 yapi-plugin-qsso 插件
   */
  third_login: {
    type: 'component',
    mulit: false,
    listener: null
  },
  /**
   * 导入数据
   * @param Object importDataModule
   *
   * @info
   * 可参考 vendors/exts/yapi-plugin-import-swagger插件
   * importDataModule = {};
   */
  import_data: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * 导出数据
   * @param Object exportDataModule
   * @param projectId
   * @info
   * exportDataModule = {};
   * exportDataModule.pdf = {
   *   name: 'Pdf',
   *   route: '/api/plugin/export/pdf',
   *   desc: '导出项目接口文档为 pdf 文件'
   * }
   */
  export_data: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * 接口页面 tab 钩子
   * @param InterfaceTabs
   *
   * @info
   * 可参考 vendors/exts/yapi-plugin-advanced-mock
   * let InterfaceTabs = {
      view: {
        component: View,
        name: '预览'
      },
      edit: {
        component: Edit,
        name: '编辑'
      },
      run: {
        component: Run,
        name: '运行'
      }
    }
   */
  interface_tab: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * 在运行页面或测试用例页接口发送请求前调用
   * 可以用插件针对某个接口的请求头或者数据进行修改或者记录
  */
  before_request: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * 在运行页面或测试用例页接口发送完成后调用
   * 返回给回调函数的值为响应原始值 + 
   * {
   *   type: 'inter' | 'case',
   *   caseId: string,
   *   interface: 接口数据
   * }
   * 
   * @info
   * hook函数为Promise, 会等待值返回后继续
   * 返回值为指定格式时将作为组件放在最下面展示
   * { 
   *    name: '同步数据',
   *    key: 'sync_schema_resp',
   *    component: RespSchemaSync,
   *    // 需要间接传给组件的props参数
   *    injectData: {
   *      message: validtor.message,
   *      schema: transformJsonToSchema(result.res.body)
   *    }
   * }
   */
  after_request: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * 在测试集里运行每次发送请求前调用
  */
  before_col_request: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * 在测试集里运行每次发送请求后调用
   * 返回值为响应原始值 + 
   * {
   *   type: 'col',
   *   caseId: string,
   *   interface: 接口数据
   * }
  */
  after_col_request: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * header下拉菜单 menu 钩子
   * @param HeaderMenu
   *
   * @info
   * 可参考 vendors/exts/yapi-plugin-statistics
   * let HeaderMenu = {
  user: {
    path: '/user/profile',
    name: '个人中心',
    icon: 'user',
    adminFlag: false
  },
  star: {
    path: '/follow',
    name: '我的关注',
    icon: 'star-o',
    adminFlag: false
  },
  solution: {
    path: '/user/list',
    name: '用户管理',
    icon: 'solution',
    adminFlag: true

  },
  logout: {
    path: '',
    name: '退出',
    icon: 'logout',
    adminFlag: false

  }
};
   */
  header_menu: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * Route路由列表钩子
   * @param AppRoute
   *
   * @info
   * 可参考 vendors/exts/yapi-plugin-statistics
   * 添加位置在Application.js 中
   * let AppRoute = {
  home: {
    path: '/',
    component: Home
  },
  group: {
    path: '/group',
    component: Group
  },
  project: {
    path: '/project/:id',
    component: Project
  },
  user: {
    path: '/user',
    component: User
  },
  follow: {
    path: '/follow',
    component: Follows
  },
  addProject: {
    path: '/add-project',
    component: AddProject
  },
  login: {
    path: '/login',
    component: Login
  }
};
};
   */
  app_route: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /*
   * 添加 reducer
   * @param Object reducerModules
   * 
   * @info
   * importDataModule = {}; 
   */

  add_reducer: {
    type: 'listener',
    mulit: true,
    listener: []
  },

  /*
   * 添加 subnav 钩子
   * @param Object reducerModules
   * 
   *  let routers = {
      interface: { name: '接口', path: "/project/:id/interface/:action", component:Interface },
      activity: { name: '动态', path: "/project/:id/activity", component:  Activity},
      data: { name: '数据管理', path: "/project/:id/data",  component: ProjectData},
      members: { name: '成员管理', path: "/project/:id/members" , component: ProjectMember},
      setting: { name: '设置', path: "/project/:id/setting" , component: Setting}
    }
   */
  sub_nav: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /*
   * 添加项目设置 nav
   * @param Object routers
   * 
   *  let routers = {
      interface: { name: 'xxx', component: Xxx },
    }
   */
  sub_setting_nav:{
    type: 'listener',
    mulit: true,
    listener: []
  }
};

function bindHook(name, listener) {
  if (!name) {
    throw new Error('缺少hookname');
  }
  if (name in hooks === false) {
    throw new Error('不存在的hookname');
  }
  if (hooks[name].mulit === true) {
    hooks[name].listener.push(listener);
  } else {
    hooks[name].listener = listener;
  }
}

function emitHook(name, ...args) {
  if (!hooks[name]) {
    throw new Error('不存在的hook name');
  }
  let hook = hooks[name];
  if (hook.mulit === true && hook.type === 'listener') {
    if (Array.isArray(hook.listener)) {
      let promiseAll = [];
      hook.listener.forEach(item => {
        if (typeof item === 'function') {
          promiseAll.push(Promise.resolve(item.call(pluginModule, ...args)));
        }
      });
      return Promise.all(promiseAll);
    }
  } else if (hook.mulit === false && hook.type === 'listener') {
    if (typeof hook.listener === 'function') {
      return Promise.resolve(hook.listener.call(pluginModule, ...args));
    }
  } else if (hook.type === 'component') {
    return hook.listener;
  }
}

pluginModule = {
  hooks: hooks,
  bindHook: bindHook,
  emitHook: emitHook
};
let pluginModuleList;
try {
  pluginModuleList = require('./plugin-module.js');
} catch (err) {
  pluginModuleList = {};
}

Object.keys(pluginModuleList).forEach(plugin => {
  if (!pluginModuleList[plugin]) return null;
  if (pluginModuleList[plugin] && typeof pluginModuleList[plugin].module === 'function') {
    pluginModuleList[plugin].module.call(pluginModule, pluginModuleList[plugin].options);
  }
});

module.exports = pluginModule;
