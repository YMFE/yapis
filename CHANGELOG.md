## v1.9.2
* fix: 修复高级 mock 无效的bug
* opti: 对登录 email 空格的过滤
* fix: 修复deepMath 增加对原型属性比较

## v1.9.1
* 修复因 mongodb 一个废弃报错导致部署不成功问题

## v1.9.0
* 修复测试集合部分情况下闪动问题
* 修改ldap filter的匹配规则，使其可以匹配&和|操作符  Merge pull request #1631 from vvkkhjt/master
* support switch_notice for /interface/save  Merge pull request #1646 from tangcent/feature/openapi_notice
* 自动化测试时服务端测试node默认2分钟没有返回就直接断掉连接，可以手动设置一个超时时间 Merge pull request #1675 from liugddx/master
* 修复导出的swagger.json 中 required 一直是 false 的 bug
* 修复 schema2json传required参数时，导致faker失败
* 修改ldap filter的匹配规则 
* 更新 sm2tsservice 3.2.0及以后版本的使用配置

## v1.8.8
* 更新了 cross-request [教程](https://juejin.im/post/5e3bbd986fb9a07ce152b53d)，发布了最新的 3.1 版本 

## v1.8.7
* 因 chrome 官方下架了 yapi 扩展，整理了本地安装教程

## v1.8.6
* 优化 swagger 文档导入分类策略，优先使用根路径的 tags 做分类，避免出现特别多分类的问题

## v1.8.5
* 改善 swagger 自动导入，不再支持秒级别的 cron 表达式,默认使用 10分钟更新一次的频率
* 修复输入空的 swagger地址 ，会发起请求的 bug
* 优化 swagger 数据导入，不会导入空的分类，不会使用版本号作为分类名称
* swagger 导入自动增加 basePath 到项目配置

## v1.8.4
* 修复 swagger 导入数据时，如果数据格式中缺少 in 的参数，会丢失请求参数
* 修复当传入数据格式的 method 不规范时，容易导致获取对象为空，出现异常导致动态页面无法打开
* 修复解决 json-schema-faker/json-schema-faker#453 问题

## v1.8.3
* 修复管理员无法看到所有分组的 bug

## v1.8.2
* 重构分组列表功能实现，大幅度优化首屏加载速度
* 接口运行界面设置 header、query、form 的初始值为其示例值
* 运行接口请求时支持自动预览HTML

### v1.8.1
* 优化插件【Swagger 自动同步】在添加地址时的服务端校验行为
* 优化单个测试用例执行超时时间限制,从3秒改为10秒

### v1.8.0
* filtering interface on the server instead of client

### v1.7.2
* 支持接口路径模糊搜索，不包含 basepath

### v1.7.1
* 废弃 yapi.ymfe.org 文档站点

### v1.7.0
* fix：修复md两个undefined以及run_auto_test中执行用例id问题 #1024

### v1.7.0-beta.1
* 修复storage保存逻辑错误

### v1.7.0-beta.0
* **[插件]** 新增默认插件，支持通过 token 导出包含 basepath 的 json 格式接口，并整合添加 sm2tsservice 入口
* **[插件]** 新增默认插件，支持swagger数据同步
* 修复不兼容 node7.6 bug

### v1.5.14 
* 修复接口运行部分请求参数默认使用示例填写值导致无法删除参数bug
* 修复无法保存 global bug

### v1.5.13 （存在bug）
* 支持 pre-script 脚本持久化数据存储，storage 兼容浏览器和服务端，并且是持久化数据存储，不会丢失，用法类似于 localStorage
* 修复了swagger 数据导入bug
* 修复接口运行部分请求参数默认使用示例填写值导致无法删除参数bug

### v1.5.12  （存在bug）
* 废弃 v1.6.x 新增功能，因为有不可控的bug出现
* 支持项目设置 hook
* 开放api 新增 '/api/plugin/export'
* 接口运行部分请求参数默认使用示例填写值

### v1.5.10
* 解决 license should be a valid SPDX license expression 报错
* 修改OpenAPI比较版本方法
* fix复制路径不包含基本路径
* 修复了第一次部署，首页一直处于 loading bug

### v1.5.7
* 数据导入默认使用完全覆盖
* 升级新版本 cross-request 扩展，因 chrome 安全策略限制，不再支持文件上传
* fix 重复的 moment 依赖，导致安装时报错
* feat: add jsrsasign Lib

### v1.5.6
* 修复 /api/open/import_data 参数bug
* 修复  /api/open/import_data 文档错误，merge 参数误写为 dataSync

### v1.5.5
* cross-request 升级到 2.10
* /api/open/import_data 新增 url 参数，支持服务端 url 导入

### v1.5.2
* 新增 openapi `/api/project/get`，可获取项目基本信息

### v1.5.1

* 优化 restful api 动态路由权重匹配算法，匹配更加精确
* openapi 新增 `/api/interface/list_cat`，获取某个分类下所有接口
* 新增了 rap数据导入到 yapi 插件 [rap2yapi](https://github.com/wxxcarl/yapi-plugin-import-rap)

### v1.5.0

* 优化开放 api功能，现在 token 带有用户信息了
* 修复无法获取请求302 跳转前的 headers

### v1.4.4
* 优化了 json-schema 编辑器交互，修复了参数名写到一半提示重复的问题
* 优化了首页体验，提升页面打开速度
* 新增自动化测试通用规则配置功能

### v1.4.3
* 修复了可视化安装，mongodb 报错的问题
* 支持了 swagger 导出功能
* 支持了克隆测试用例

### v1.4.2
* 优化数据导入对 headers 处理，如果 requestType 是 json，自动增加header "content-type/json"
* fix: 修改了测试集合有多个项目接口时，切换执行环境相互覆盖不生效的问题 #692
* fix: mongoose warning 'Error: (node:3819) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead'
* opti: 去掉没必要的redux-thunk
* 接口更新没有变化时，不记录日志，避免cron多次导入swagger的接口时，导致动态里展示一大堆的无意义日志

### v1.4.1

* 支持任何人都可以添加分组，只有管理员才能修改项目是否公开
* 支持 mongodb 集群

#### Bug Fixed
* 修改 mock严格模式，GET带有 JSON BODY 导致的验证问题
* 对 queryPath 改动导致的bug，支持通过 xxx?controller=name 等 query 参数区分路径
* 因 tui-editor 需要安装github 依赖，导致部分机器无法部署成功的问题


### v1.3.23

* 接口tag功能
* 数据导入增加 merge 功能
* 增加参数的批量导入功能
* json schema 可视化编辑器增加 mock 功能


#### Bug Fixed

* 接口path中写入 ?name=xxx bug
* 高级mock 匹配 data: [{item: XXX}] 时匹配不成功
* 接口运行 query params 自动勾选
* mock get 带 cookie 时跨域
* json schema 嵌套多层 array 预览不展示 bug
* swagger URL 导入 跨域问题

### v1.3.22

* json schema number和integer支持枚举
* 服务端测试增加下载功能
* 增加 mock 接口请求字段参数验证
* 增加返回数据验证

#### Bug Fixed

* 命令行导入成员信息为 undefined
* 修复form 参数为空时 接口无法保存的问题

### v1.3.21

* 请求配置增加 context.utils.CryptoJS
* 环境变量支持自定义全局变量
* 增加wiki数据导出功能
* 用户管理处增加搜索功能
* 增加项目全局 mock 脚本功能
* 高级 mock 期望 支持关闭开启功能

#### Bug Fixed

* 优化ldap登陆 
* swagger 导入公共params
* 接口编辑 mockEditor 修改为 AceEditor

### v1.3.20

#### Bug Fixed
* 修复 ykit 打包代码问题
* 修复 swagger url 导入选中后再切换其他数据方式时拖拽区域不出现问题
* 修复 wiki controller 后端报错问题


### v1.3.19

* 增加项目文档记录wiki
* 支持swagger URL 导入
* 接口运行和测试集合中加入参数备注信息
* 测试接口导入支持状态过滤
* json schema 增加枚举备注功能
* 左侧菜单栏可以支持单独滚动条
* 支持新版本通知

#### Bug Fixed

* 修复测试用例名称为空时保存测试用例出现的bug
* 导出markdown 路径参数处格式错误和参数table备注信息换行后样式错误



### v1.3.18

* 增加全局接口搜索功能
* 邮件通知过滤功能

#### Bug Fixed

* 新建接口自动添加为项目成员
* 修复type为raw header type 为form 时运行body 为空问题
* mongodb3.4-> 3.6 聚合 cursor报错
* path 路径支持 ！
* json-schema 编辑器修复修改 type 导致描述信息被重置的问题

### v1.3.17

* 请求配置中添加 context.castId 字段用于标识测试用例

#### Bug Fixed
* 修复服务器端测试，邮件通知开启token undefined bug
* 将状态由未完成修改成已完成之后，原来的json格式的数据会变成json-schema
* 有分类为空时导出json后再导入报错
* 只修改参数 必需/非必需, 文本/文件 时, 查看改动详情, 提示没有改动
* ldap登陆允许用户输入的登陆账号非邮箱


### v1.3.16

* 支持自定义域名邮箱登录
* 测试用例支持导入不同项目接口
* 完善可视化表达式，可根据焦点编辑表达式
* req_body json 支持指针位置可视化插入表达式


#### Bug Fixed

* 导入postman  headers 为 null 时报错
* format-data 数据解析不成功
* 导出的接口顺序按照api的接口顺序



### v1.3.15
* 增强跨域请求安全性，只允许 YApi 网站进行跨域请求
* 优化文档
* 修复 schema 描述信息展示 bug
* 增加禁止普通用户注册功能


### v1.3.14
* 修复接口编辑白屏问题

### v1.3.13

* 新增通过命令行导入 swagger 接口数据功能
* 接口请求设置新增异步处理特性

### v1.3.12

#### Feature

* 接口列表支持路径查询
* 项目复制
* 预览页面交互优化
* 优化服务端自动化测试文案
* 增加项目接口json数据导入导出功能

#### Bug Fixed

* 项目中访客权限的账号可以 增、删、改接口中高级mock的设置
* 高级Mock 中的响应时间值无法保存（实际提示为：保存成功）
* 分类为空时添加接口


### v1.3.11

#### Bug Fixed
* 修复 v1.3.10 websocket 连接问题
* 修复运行报错问题
* 修复数据导入 har 文件问题



### v1.3.9
#### Feature
* 增加接口编辑返回数据预览
* 修复旧的文档链接

#### Bug Fixed

* 导入数据为空提示


### v1.3.8

#### Feature

* 新增 json 结构可视化编辑器
* pre-script 增加 method 字段数据

#### Bug Fixed

* 点击编辑 tab 可能导致运行功能异常
* 修复postman导入没有分类的问题
* 修复postman参数导入缺失


### v1.3.7

#### Feature

* 完美支持 swagger, 接口请求参数和返回数据支持使用 json-schema 定义数据结构
* 增加测试集合列表的拖动功能
* 接口列表中增加“开放接口”状态
* 接口列表树形组件支持拖动
* json-schema 导出 table 表单
* 接口列表和测试集树形组件支持拖动
* 图标从阿里 cdn 替换到本地

#### Bug Fixed

* 修复高级 Mock 服务端报错
* 修复测试集合 table 拖动频繁请求的问题
* 修复 swagger 数据导入部分 bug

### v1.3.6

#### Feature

* 增加服务端的自动化测试功能,可集成到 jenkins, github 做接口自动化测试
* 增加导出公共接口功能
* 增加复制接口路径按钮
* 增加项目 token 功能，可通过 token 访问开放接口
* antd 升级到 v3

#### Bug Fixed

* 修复接口动态提示有误
* 修复变量表达式无法反向展示的问题

### v1.3.5

#### Feature

* 增加项目成员批量导入
* 数据导入同步，数据导入支持 swagger 3.0
* swagger 数据导入支持 2xx 的 httpcode
* 新增系统信息页面

#### Bug Fixed

* 修复离开接口编辑页面的 confirm 框有时候会触发两次 & confirm 的 ‘X’ 按钮无效
* 修复添加集合后测试集合 list 不更新问题
* 测试集合点击对应接口侧边栏不切换
* 测试集合处，点击删除不成功
* 修改编辑接口后，再回到测试集合处数据不更新问题
* 修复 mongodb 帐号密码配置错误时引发的错误
* 修复删除分组后侧边数据没有更新问题

### v1.3.4

#### Feature

* 帮助文档首页增加部署公司
* 进入 project 页面加入 loading
* 接口 list 页 table 中加入分页
* 项目添加者自动变成项目组长

#### Bug Fixed

* 修复无权限进入项目 bug
* 修复复制接口，query 等参数无法复制 bug
* 修复导出 html markdown 参数丢失问题
* 修复项目设置 pre-script 无法显示问题

### v1.3.3

#### Feature

* 邮件功能中： 1）接口信息改动增加通知对应项目所有的成员；2）默认开启接口改动邮件提醒；3) 增加邮件内容的 jsondiff 信息

#### Bug Fixed

* 优化接口运行页面插件提醒
* 完善 log 记录不到的问题
* 修复接口内容改动不发送邮件问题
* 修复部分 swagger 数据导入丢失问题

### v1.3.2

#### Feature

* 分组中新增接口自定义字段，便于用户在项目中添加额外字段数据
* 导入数据时新增导入 loading 显示

### v1.3.1

#### Bug Fixed

1.  修复接口状态和 req_params 参数无法更新问题
2.  修复搜索测试集合不展开问题
3.  修复测试过程中全局 header 不存在的问题

### v1.3.0

#### Feature

* yapi 默认集成 ldap 登录方式
* yapi 做一个 sso 登录插件，基于现有的 qsso 改造成大多数公司可用的
* 环境设置支持全局 header
* 接口运行页面选择环境增加管理环境的弹层
* 接口运行支持加工运行前后的 request 和 response ，主要是处理加密的接口或各种 token 参数问题
* 自动化测试除提供自定义脚本外，还提供可视化表单形式验证一些数据，例如 statusCode、bodyContent
* 增加查看接口详细改动
* 支持接口运行页面 body 全屏编辑
* 数据导出到 html 支持了分类

#### Bug Fixed

* 修复了高级 Mock 无法获取到真实客户端 ip

### v1.2.9

#### Bug Fixed

1.  Api 路径兼容 postman {varible}
2.  View Response Height 问题

#### Feature

1.  新增克隆测试集功能
2.  高级 Mock 期望支持 mockjs
3.  pathname 允许只有一个 /

### v1.2.8

#### Bug Fixed

1.  修复接口运行 json 格式问题
2.  修复测试报告显示问题
3.  增加了接口数量统计
4.  多参数表达式改用双大括号{{}}
5.  修复了环境变量设置样式问题

#### Feature

1.  测试用例增加自定义测试脚本功能

### v1.2.7

#### Bug Fixed

1.  修复接口运行功能，当 httpCode 不是 200 时，导致无法获取 response body 问题
2.  修复路径参数无法删除优化测试集 table 页面，当文字超出一定长度会换行的问题
3.  优化测试集断言错误提示
4.  优化接口编辑 save 按钮样式

#### Feature

1.  测试集断言增加 log 方法，用于输出调试日志
2.  可视化动态参数表达式生成器，生成类似表达式 {@email | concat: pass | md5 | substr: 1,10}

### v1.2.6

#### Bug Fixed

1.  修复路径参数无法删除

#### Feature

1.  参数值支持多个动态参数，类似 str{@email}str{$.55.body.id}
2.  参数值支持管道表达式,例如 {@email | concat: pass | md5 | substr: 1,10}
3.  接口编辑参数**可拖动排序**
4.  修复路径参数无法删除问题

### v1.2.5

#### Bug Fixed

1.  成员如果第一次添加成员时选择组长，接着再添加下一个成员，如果 select 是默认的开发者，这时候会出现与上次 select 相同的值
2.  如果添加了一个不存在的成员还是会提示添加成功，并且发送的数据是原来发送成功的数据，这里需要重置初始值并在未找到对应用户名时对未找到的人名应该提示用户不存在
3.  Fix 接口集自动化测试 header 没有解析 mock 和 变量参数
4.  在接口开发阶段，多个人并行改接口，如果最后一个人改之前没刷新页面，会把之前的人修改过的都冲掉了
5.  修复 cross-request，response header 字段重复 bug

#### Feature

1.  优化了分组添加，编辑交互
2.  cross-request 计算了接口请求时间
3.  新增接口文档导出 html, markdown 功能

### v1.2.4

#### Bug Fixed

1.  期望值输入时候换成字符串，导致 diff 时因类型不一致匹配不上
2.  swagger 导入数据时出现的 id 未定义 bug
3.  fix: kerberos dependencies 导致安装依赖需要编译的问题
4.  修复了高级 mock 期望过滤参数为空时匹配不到的 bug
5.  将接口编辑页的保存按钮变成一直在窗口底部
6.  修改需求文档中项目操作处修改项目中的接口测试 a 链接指向的网页错误问题
7.  添加接口时重名，现在提示“已存在”，并在提示信息中告知用户删改接口的位置
8.  已添加的成员，再次添加会提示“添加成功”，优化提示为已成功添加人数，和已存在人数
9.  添加分组和修改分组时有个权限问题没有更新，切换列表才更新，该问题已解决
10. 解决修改和删除公共分类名称处，在添加接口时，选择接口分类名称没有修改的问题

#### Feature

1.  接口 path 支持了后面带 /
2.  cross-request 支持了不安全的 header，如 cookie, referer...
3.  支持了 path 带特殊符号"!"
4.  请求参数可改变顺序，目前只是对必需和非必需进行自动排序
5.  用户头像上传问题，txt 改成 jpg 格式上传，用户头像显示空白，然后无法再次上传头像。无法再次上传的问题已经解决
6.  解决用户头像改变但是 header 处图片不变的问题。问题描述：用户上传头像成功但是 Header 处的头像没有改变，并且点击其他页面后再回到个人中心里面的头像又变成没有重新上传时的图片，必须重新刷新才可以将 Header 处的图片更新
7.  解决导入 postman 接口动态路由无法导入的 Bug

### v1.2.0

#### Features

* 增加高级 Mock 期望功能，根据设置的请求过滤规则，返回期望数据。
* 增加统计功能
* 增加自动化测试功能，写断言脚本，实现精准测试

#### Bug Fixed

* 修复了切换集合环境的 Bug
* 修复了 mockServer 拿不到 Post 请求 Body
* 修复了接口调试 pathParams 无法使用 mock 参数和变量参数

### v1.1.2

#### Features

* 接口运行增加了 query 和 body 的 enable 选项，可选择是否请求该字段
* Mock 支持了时间戳占位符 @timestamp
* 接口集运行页面可选择环境
* 接口集动态参数格式由原来的 $.{key}.{jsonPath} 改为 $.{key}.{body|params}.{jsonPath}

#### Bug Fixed

* 修复了接口集运行功能会忽略环境配置的 domain 路径
* 修复了动态路由 mock 返回结果不是该接口定义返回数据
* 修复了日志链接错误问题
* 修复了添加用户 loading 问题
* 修复了用户名编辑，前台未更新问题
* 修复了复制接口导致 GET 请求显示 request-body 问题
* 修复了接口集页面刷新后跳转到第一个接口集问题
* 修复了接口用例页面修改 header 参数值没有效果 bug
* 修复了接口集页面导入接口会导致 reqBody 清空 bug

### v1.1.1

#### Features

* 添加插件开发文档
* 接口和测试用例可拖动
* 优化动态提示

#### Bug Fixed

* 修复接口状态将接口方法重置为 get
* 环境配置域名带 path 无效
* 修复 Swagger 数据导入分类 bug
* MockServer 支持 CORS 跨域
* 优化 JSON-SCHEMA 转化为 JSON 的逻辑，由原来随机转换不被 required 字段改为转换全部字段
* 修复了项目成员无法看到该项目的 Bug
* 修复了无法查看公共项目的 Bug
* 优化了部分样式和交互

### v1.1.0

#### Features

* 新增个人空间功能，拥有这个分组的全部权限，可以在这个分组里探索 YApi 的功能
* 新增分组动态功能
* 优化接口运行页面交互
* CrossRequest 扩展支持 https
* 增加了 Swagger 数据导入功能

### v1.0.2

#### Features

* 网站改为 100%布局
* 优化搜索的提示
* 支持了 queryPath
* 接口浏览页面和编辑页面交互
* 新增高级 Mock 功能，可通过 js 代码去控制 mock 数据的生成
* 测试集支持了自动化测试
* 增加复制接口功能
* 在组长和开发者权限基础上，添加了 查看着 权限

### v1.0.1

#### Fix Bug

* 修改接口名字后，需要刷新页面左边的侧边栏才会显示正确的名字
* mockJson 出现 null，mock 出现格式不对问题
* 没有权限的分组不可选
* 项目列表图标设计大小优化下
* 关注的项目不显眼
* 添加接口之后，再次选择添加接口，会保留上次填写的信息
* 用例名称太长，导致无法使用删除功能
* 别人知道项目 id 虽然没有权限，但能看到里面所有内容

#### Features

* 接口备注集成了富文本编辑
* 支持 har 协议的接口数据导入


todo:
新增 crypto 加密函数
