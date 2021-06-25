const fs = require('fs-extra');
const yapi = require('./yapi.js');
const commons = require('./utils/commons');
const dbModule = require('./utils/db.js');
const userModel = require('./models/user.js');
const mongoose = require('mongoose');

yapi.commons = commons;
yapi.connect = dbModule.connect();

function install() {
  let exist = yapi.commons.fileExist(yapi.path.join(yapi.WEBROOT_RUNTIME, 'init.lock'));

  if (exist) {
    throw new Error(
      'init.lock文件已存在，请确认您是否已安装。如果需要重新安装，请删掉init.lock文件'
    );
  }

  setupSql();
}

function setupSql() {
  let userInst = yapi.getInst(userModel);
  let passsalt = yapi.commons.randStr();
  let result = userInst.save({
    username: yapi.WEBCONFIG.adminAccount.substr(0, yapi.WEBCONFIG.adminAccount.indexOf('@')),
    email: yapi.WEBCONFIG.adminAccount,
    password: yapi.commons.generatePassword('ymfe.org', passsalt),
    passsalt: passsalt,
    role: 'admin',
    add_time: yapi.commons.time(),
    up_time: yapi.commons.time()
  });

  yapi.connect
    .then(function() {
      let userCol = mongoose.connection.db.collection('user');
      userCol.createIndex({
        username: 1
      });
      userCol.createIndex(
        {
          email: 1
        },
        {
          unique: true
        }
      );

      let projectCol = mongoose.connection.db.collection('project');
      projectCol.createIndex({
        uid: 1
      });
      projectCol.createIndex({
        name: 1
      });
      projectCol.createIndex({
        group_id: 1
      });

      let logCol = mongoose.connection.db.collection('log');
      logCol.createIndex({
        uid: 1
      });

      logCol.createIndex({
        typeid: 1,
        type: 1
      });

      let interfaceColCol = mongoose.connection.db.collection('interface_col');
      interfaceColCol.createIndex({
        uid: 1
      });
      interfaceColCol.createIndex({
        project_id: 1
      });

      let interfaceCatCol = mongoose.connection.db.collection('interface_cat');
      interfaceCatCol.createIndex({
        uid: 1
      });
      interfaceCatCol.createIndex({
        project_id: 1
      });

      let interfaceCaseCol = mongoose.connection.db.collection('interface_case');
      interfaceCaseCol.createIndex({
        uid: 1
      });
      interfaceCaseCol.createIndex({
        col_id: 1
      });
      interfaceCaseCol.createIndex({
        project_id: 1
      });

      let interfaceCol = mongoose.connection.db.collection('interface');
      interfaceCol.createIndex({
        uid: 1
      });
      interfaceCol.createIndex({
        path: 1,
        method: 1
      });
      interfaceCol.createIndex({
        project_id: 1
      });

      let groupCol = mongoose.connection.db.collection('group');
      groupCol.createIndex({
        uid: 1
      });
      groupCol.createIndex({
        group_name: 1
      });

      let avatarCol = mongoose.connection.db.collection('avatar');
      avatarCol.createIndex({
        uid: 1
      });

      let tokenCol = mongoose.connection.db.collection('token');
      tokenCol.createIndex({
        project_id: 1
      });

      let followCol = mongoose.connection.db.collection('follow');
      followCol.createIndex({
        uid: 1
      });
      followCol.createIndex({
        project_id: 1
      });

      result.then(
        function() {
          fs.ensureFileSync(yapi.path.join(yapi.WEBROOT_RUNTIME, 'data', 'init.lock'));
          console.log(
            `初始化管理员账号成功,账号名："${yapi.WEBCONFIG.adminAccount}"，密码："ymfe.org"`
          ); // eslint-disable-line
          process.exit(0);
        },
        function(err) {
          throw new Error(`初始化管理员账号 "${yapi.WEBCONFIG.adminAccount}" 失败, ${err.message}`); // eslint-disable-line
        }
      );
    })
    .catch(function(err) {
      throw new Error(err.message);
    });
}

install();
