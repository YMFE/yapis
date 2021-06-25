const ldap = require('ldapjs');
const yapi = require('../yapi.js');
const util = require('util');

exports.ldapQuery = (username, password) => {
  // const deferred = Q.defer();

  return new Promise((resolve, reject) => {
    const { ldapLogin } = yapi.WEBCONFIG;

    //  使用ldapjs库创建一个LDAP客户端
    const client = ldap.createClient({
      url: ldapLogin.server,
      tlsOptions: {
        rejectUnauthorized: false
      }
    });

    client.once('error', err => {
      if (err) {
        let msg = {
          type: false,
          message: `once: ${err}`
        };
        reject(msg);
      }
    });
    // 注册事件处理函数
    const ldapSearch = (err, search) => {
      const users = [];
      if (err) {
        let msg = {
          type: false,
          message: `ldapSearch: ${err}`
        };
        reject(msg);
      }
      // 查询结果事件响应
      search.on('searchEntry', entry => {
        if (entry) {
          // 获取查询对象
          users.push(entry.object);
        }
      });
      // 查询错误事件
      search.on('error', e => {
        if (e) {
          let msg = {
            type: false,
            message: `searchErr: ${e}`
          };
          reject(msg);
        }
      });

      search.on('searchReference', referral => {
        // if (referral) {
        //   let msg = {
        //     type: false,
        //     message: `searchReference: ${referral}`
        //   };
        //   reject(msg);
        // }
        console.log('referral: ' + referral.uris.join());
      });
      // 查询结束
      search.on('end', () => {
        if (users.length > 0) {
          client.bind(users[0].dn, password, e => {
            if (e) {
              let msg = {
                type: false,
                message: `用户名或密码不正确: ${e}`
              };
              reject(msg);
            } else {
              let msg = {
                type: true,
                message: `验证成功`,
                info: users[0]
              };
              resolve(msg);
            }
            client.unbind();
          });
        } else {
          let msg = {
            type: false,
            message: `用户名不存在`
          };
          reject(msg);
          client.unbind();
        }
      });
    };
    // 将client绑定LDAP Server
    // 第一个参数： 是用户，必须是从根结点到用户节点的全路径
    // 第二个参数： 用户密码
    return new Promise((resolve, reject) => {
      if (ldapLogin.bindPassword) {
        client.bind(ldapLogin.baseDn, ldapLogin.bindPassword, err => {
          if (err) {
            let msg = {
              type: false,
              message: `LDAP server绑定失败: ${err}`
            };
            reject(msg);
          }

          resolve();
        });
      } else {
        resolve();
      }
    }).then(() => {
      const searchDn = ldapLogin.searchDn;
      const searchStandard = ldapLogin.searchStandard;
      // 处理可以自定义filter
      let customFilter;
      if (/^(&|\|)/gi.test(searchStandard)) {
        customFilter = searchStandard.replace(/%s/g,username);
      } else {
        customFilter = `${searchStandard}=${username}`;
      }
      const opts = {
        // filter: `(${searchStandard}=${username})`,
        filter: `(${customFilter})`,
        scope: 'sub'
      };

      // 开始查询
      // 第一个参数： 查询基础路径，代表在查询用户信息将在这个路径下进行，该路径由根结点开始
      // 第二个参数： 查询选项
      client.search(searchDn, opts, ldapSearch);
    });
  });
};
