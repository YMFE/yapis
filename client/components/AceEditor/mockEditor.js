import intl from "react-intl-universal";

var ace = require('brace'),
  Mock = require('mockjs');
require('brace/mode/javascript');
require('brace/mode/json');
require('brace/mode/xml');
require('brace/mode/html');
require('brace/theme/xcode');
require('brace/ext/language_tools.js');
var json5 = require('json5');
const MockExtra = require('common/mock-extra.js');

var langTools = ace.acequire('ace/ext/language_tools'),
  wordList = [
    { name: intl.get('AceEditor.mockEditor.字符串'), mock: '@string' },
    { name: intl.get('AceEditor.mockEditor.自然数'), mock: '@natural' },
    { name: intl.get('AceEditor.mockEditor.浮点数'), mock: '@float' },
    { name: intl.get('AceEditor.mockEditor.字符'), mock: '@character' },
    { name: intl.get('AceEditor.mockEditor.布尔'), mock: '@boolean' },
    { name: 'url', mock: '@url' },
    { name: intl.get('AceEditor.mockEditor.域名'), mock: '@domain' },
    { name: intl.get('AceEditor.mockEditor.ip地址'), mock: '@ip' },
    { name: 'id', mock: '@id' },
    { name: 'guid', mock: '@guid' },
    { name: intl.get('AceEditor.mockEditor.当前时间'), mock: '@now' },
    { name: intl.get('AceEditor.mockEditor.时间戳'), mock: '@timestamp' },
    { name: intl.get('AceEditor.mockEditor.日期'), mock: '@date' },
    { name: intl.get('AceEditor.mockEditor.时间'), mock: '@time' },
    { name: intl.get('AceEditor.mockEditor.日期时间'), mock: '@datetime' },
    { name: intl.get('AceEditor.mockEditor.图片连接'), mock: '@image' },
    { name: intl.get('AceEditor.mockEditor.图片data'), mock: '@imageData' },
    { name: intl.get('AceEditor.mockEditor.颜色'), mock: '@color' },
    { name: intl.get('AceEditor.mockEditor.颜色hex'), mock: '@hex' },
    { name: intl.get('AceEditor.mockEditor.颜色rgba'), mock: '@rgba' },
    { name: intl.get('AceEditor.mockEditor.颜色rgb'), mock: '@rgb' },
    { name: intl.get('AceEditor.mockEditor.颜色hsl'), mock: '@hsl' },
    { name: intl.get('AceEditor.mockEditor.整数'), mock: '@integer' },
    { name: 'email', mock: '@email' },
    { name: intl.get('AceEditor.mockEditor.大段文本'), mock: '@paragraph' },
    { name: intl.get('AceEditor.mockEditor.句子'), mock: '@sentence' },
    { name: intl.get('AceEditor.mockEditor.单词'), mock: '@word' },
    { name: intl.get('AceEditor.mockEditor.大段中文文本'), mock: '@cparagraph' },
    { name: intl.get('AceEditor.mockEditor.中文标题'), mock: '@ctitle' },
    { name: intl.get('AceEditor.mockEditor.标题'), mock: '@title' },
    { name: intl.get('AceEditor.mockEditor.姓名'), mock: '@name' },
    { name: intl.get('AceEditor.mockEditor.中文姓名'), mock: '@cname' },
    { name: intl.get('AceEditor.mockEditor.中文姓'), mock: '@cfirst' },
    { name: intl.get('AceEditor.mockEditor.中文名'), mock: '@clast' },
    { name: intl.get('AceEditor.mockEditor.英文姓'), mock: '@first' },
    { name: intl.get('AceEditor.mockEditor.英文名'), mock: '@last' },
    { name: intl.get('AceEditor.mockEditor.中文句子'), mock: '@csentence' },
    { name: intl.get('AceEditor.mockEditor.中文词组'), mock: '@cword' },
    { name: intl.get('AceEditor.mockEditor.地址'), mock: '@region' },
    { name: intl.get('AceEditor.mockEditor.省份'), mock: '@province' },
    { name: intl.get('AceEditor.mockEditor.城市'), mock: '@city' },
    { name: intl.get('AceEditor.mockEditor.地区'), mock: '@county' },
    { name: intl.get('AceEditor.mockEditor.转换为大写'), mock: '@upper' },
    { name: intl.get('AceEditor.mockEditor.转换为小写'), mock: '@lower' },
    { name: intl.get('AceEditor.mockEditor.挑选（枚举）'), mock: '@pick' },
    { name: intl.get('AceEditor.mockEditor.打乱数组'), mock: '@shuffle' },
    { name: intl.get('AceEditor.mockEditor.协议'), mock: '@protocol' }
  ];

let dom = ace.acequire('ace/lib/dom');
ace.acequire('ace/commands/default_commands').commands.push({
  name: 'Toggle Fullscreen',
  bindKey: 'F9',
  exec: function(editor) {
    if (editor._fullscreen_yapi) {
      let fullScreen = dom.toggleCssClass(document.body, 'fullScreen');
      dom.setCssClass(editor.container, 'fullScreen', fullScreen);
      editor.setAutoScrollEditorIntoView(!fullScreen);
      editor.resize();
    }
  }
});

function run(options) {
  var editor, mockEditor, rhymeCompleter;
  function handleJson(json) {
    var curData = mockEditor.curData;
    try {
      curData.text = json;
      var obj = json5.parse(json);
      curData.format = true;
      curData.jsonData = obj;
      curData.mockData = () => Mock.mock(MockExtra(obj, {})); //为防止时时 mock 导致页面卡死的问题，改成函数式需要用到再计算
    } catch (e) {
      curData.format = e.message;
    }
  }
  options = options || {};
  var container, data;
  container = options.container || 'mock-editor';
  if (
    options.wordList &&
    typeof options.wordList === 'object' &&
    options.wordList.name &&
    options.wordList.mock
  ) {
    wordList.push(options.wordList);
  }
  data = options.data || '';
  options.readOnly = options.readOnly || false;
  options.fullScreen = options.fullScreen || false;

  editor = ace.edit(container);
  editor.$blockScrolling = Infinity;
  editor.getSession().setMode('ace/mode/javascript');
  if (options.readOnly === true) {
    editor.setReadOnly(true);
    editor.renderer.$cursorLayer.element.style.display = 'none';
  }
  editor.setTheme('ace/theme/xcode');
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: false,
    enableLiveAutocompletion: true,
    useWorker: true
  });
  editor._fullscreen_yapi = options.fullScreen;
  mockEditor = {
    curData: {},
    getValue: () => mockEditor.curData.text,
    setValue: function(data) {
      editor.setValue(handleData(data));
    },
    editor: editor,
    options: options,
    insertCode: code => {
      let pos = editor.selection.getCursor();
      editor.session.insert(pos, code);
    }
  };

  function formatJson(json) {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (err) {
      return json;
    }
  }

  function handleData(data) {
    data = data || '';
    if (typeof data === 'string') {
      return formatJson(data);
    } else if (typeof data === 'object') {
      return JSON.stringify(data, null, '  ');
    } else {
      return '' + data;
    }
  }

  rhymeCompleter = {
    identifierRegexps: [/[@]/],
    getCompletions: function(editor, session, pos, prefix, callback) {
      if (prefix.length === 0) {
        callback(null, []);
        return;
      }
      callback(
        null,
        wordList.map(function(ea) {
          return { name: ea.mock, value: ea.mock, score: ea.mock, meta: ea.name };
        })
      );
    }
  };

  langTools.addCompleter(rhymeCompleter);
  mockEditor.setValue(handleData(data));
  handleJson(editor.getValue());

  editor.clearSelection();

  editor.getSession().on('change', () => {
    handleJson(editor.getValue());
    if (typeof options.onChange === 'function') {
      options.onChange.call(mockEditor, mockEditor.curData);
    }
    editor.clearSelection();
  });
  return mockEditor;
}

/**
 * mockEditor({
      container: 'req_body_json', //dom的id
      data: that.state.req_body_json, //初始化数据
      onChange: function (d) {
        that.setState({
          req_body_json: d.text
        })
      }
    })
 */
module.exports = run;
