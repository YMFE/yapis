var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var commonLib = require('./common/plugin.js');
var assetsPluginInstance = new AssetsPlugin({
  filename: 'static/prd/assets.js',
  processOutput: function(assets) {
    return 'window.WEBPACK_ASSETS = ' + JSON.stringify(assets);
  }
});
var fs = require('fs');
var package = require('./package.json');
var yapi = require('./server/yapi');
var isWin = require('os').platform() === 'win32'

var compressPlugin = new CompressionPlugin({
  asset: '[path].gz[query]',
  algorithm: 'gzip',
  test: /\.(js|css)$/,
  threshold: 10240,
  minRatio: 0.8
});

function createScript(plugin, pathAlias) {
  let options = plugin.options ? JSON.stringify(plugin.options) : null;
  if (pathAlias === 'node_modules') {
    return `"${plugin.name}" : {module: require('yapi-plugin-${
      plugin.name
    }/client.js'),options: ${options}}`;
  }
  return `"${plugin.name}" : {module: require('${pathAlias}/yapi-plugin-${
    plugin.name
  }/client.js'),options: ${options}}`;
}

function initPlugins(configPlugin) {
  configPlugin = require('../config.json').plugins;
  var systemConfigPlugin = require('./common/config.js').exts;

  var scripts = [];
  if (configPlugin && Array.isArray(configPlugin) && configPlugin.length) {
    configPlugin = commonLib.initPlugins(configPlugin, 'plugin');
    configPlugin.forEach(plugin => {
      if (plugin.client && plugin.enable) {
        scripts.push(createScript(plugin, 'node_modules'));
      }
    });
  }

  systemConfigPlugin = commonLib.initPlugins(systemConfigPlugin, 'ext');
  systemConfigPlugin.forEach(plugin => {
    if (plugin.client && plugin.enable) {
      scripts.push(createScript(plugin, 'exts'));
    }
  });

  scripts = 'module.exports = {' + scripts.join(',') + '}';
  fs.writeFileSync('client/plugin-module.js', scripts);
}

initPlugins();

module.exports = {
  plugins: [
    {
      name: 'antd',
      options: {
        modifyQuery: function(defaultQuery) {
          // 可查看和编辑 defaultQuery
          defaultQuery.plugins = [];
          defaultQuery.plugins.push([
            'transform-runtime',
            {
              polyfill: false,
              regenerator: true
            }
          ]);
          defaultQuery.plugins.push('transform-decorators-legacy');
          defaultQuery.plugins.push(['import', { libraryName: 'antd' }]);
          return defaultQuery;
        },
        exclude: isWin ? /(tui-editor|node_modules\\(?!_?(yapi-plugin|json-schema-editor-visual)))/ : /(tui-editor|node_modules\/(?!_?(yapi-plugin|json-schema-editor-visual)))/
      }
    }
  ],
  devtool: 'cheap-source-map',
  config: function(ykit) {
    return {
      exports: ['./index.js'],
      commonsChunk: {
        vendors: {
          lib: [
            // 'anujs',
            'react',
            'react-dom',
            'redux',
            'redux-promise',
            'react-router',
            'react-router-dom',
            'prop-types',
            'react-dnd-html5-backend',
            'react-dnd',
            'reactabular-table',
            'reactabular-dnd',
            'table-resolver'
          ],
          lib2: ['brace', 'json5', 'url', 'axios'],
          lib3: ['mockjs', 'moment', 'recharts']
        }
      },
      modifyWebpackConfig: function(baseConfig) {
        var ENV_PARAMS = {};
        switch (this.env) {
          case 'local':
            ENV_PARAMS = 'dev';
            break;
          case 'dev':
            ENV_PARAMS = 'dev';
            break;
          case 'prd':
            ENV_PARAMS = 'production';
            break;
          default:
        }

        baseConfig.plugins.push(
          new this.webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(ENV_PARAMS),
            'process.env.version': JSON.stringify(package.version),
            'process.env.versionNotify': yapi.WEBCONFIG.versionNotify
          })
        );

        //初始化配置
        baseConfig.devtool = 'cheap-module-eval-source-map';
        baseConfig.context = path.resolve(__dirname, './client');
        baseConfig.resolve.alias.client = '/client';
        baseConfig.resolve.alias.common = '/common';

        baseConfig.resolve.alias.exts = '/exts';

        // baseConfig.resolve.alias.react = 'anujs';
        // baseConfig.resolve.alias['react-dom'] = 'anujs';

        baseConfig.output.prd.path = 'static/prd';
        baseConfig.output.prd.publicPath = '';
        baseConfig.output.prd.filename = '[name]@[chunkhash][ext]';

        baseConfig.module.noParse = /node_modules\/jsondiffpatch\/public\/build\/.*js/;
        baseConfig.module.loaders.push({
          test: /\.less$/,
          loader: ykit.ExtractTextPlugin.extract(
            require.resolve('style-loader'),
            require.resolve('css-loader') +
              '?sourceMap!' +
              require.resolve('less-loader') +
              '?sourceMap'
          )
        });

        baseConfig.module.loaders.push({
          test: /.(gif|jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: ['[path][name].[ext]?[sha256#base64:8]']
          }
        });

        baseConfig.module.loaders.push({
          test: /\.(sass|scss)$/,
          loader: ykit.ExtractTextPlugin.extract(
            require.resolve('css-loader') +
              '?sourceMap!' +
              require.resolve('sass-loader') +
              '?sourceMap'
          )
        });

				baseConfig.module.preLoaders.push({
					test: /\.(js|jsx)$/,
					exclude: /tui-editor|node_modules|google-diff.js/,
					loader: 'eslint-loader'
				});
				// @doramart 只是添加了这里的一个配置
				baseConfig.module.preLoaders.push({
					test: /\.(js|jsx)$/,
					include: [path.resolve(__dirname, './node_modules/swagger-client')],
					loader: 'babel-loader'
				});

        baseConfig.module.preLoaders.push({
          test: /\.json$/,
          loader: 'json-loader'
        });

        if (this.env == 'prd') {
          baseConfig.plugins.push(
            new this.webpack.optimize.UglifyJsPlugin({
              compress: {
                warnings: false
              }
            })
          );
          baseConfig.plugins.push(assetsPluginInstance);
          baseConfig.plugins.push(compressPlugin);
          baseConfig.plugins.push(
            new this.webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn|en-gb)$/)
          );
        }
        return baseConfig;
      }
    };
  },
  server: {
    // true/false，默认 false，效果相当于 ykit server --hot
    hot: true,
    // true/false，默认 false，开启后可在当前打开的页面提示打包错误
    overlay: false
  },
  hooks: {},
  commands: []
};
