import './MockDoc.scss';
import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import intl from "react-intl-universal";

// 组件用法 <MockDoc mock= mockData doc= docData />
// mockData: mock数据 格式为json
// docData：docData数据 格式为array

class MockDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      release: []
    };
  }

  static propTypes = {
    mock: PropTypes.object,
    doc: PropTypes.array
  };
  // btnCol(start,col){
  //   return function(){
  //     console.log(start,col);
  //   }
  // }
  render() {
    let htmlData = mockToArr(this.props.mock);
    htmlData = arrToHtml(htmlData, this.props.doc);
    return (
      <div className="MockDoc">
        {htmlData.map(function(item, i) {
          {
            /*//类型：Object  必有字段  备注：qwqwqw*/
          }
          if (item.mes) {
            var mes = [];
            item.mes.type
              ? mes.push(
                  <span key={i} className="keymes">
                    {' '}
                    {intl.get('MockDoc.MockDoc./ /类型：')}{item.mes.type}
                  </span>
                )
              : '';
            item.mes.required
              ? mes.push(
                  <span key={i + 1} className="keymes">
                    {intl.get('MockDoc.MockDoc.必有字段')}</span>
                )
              : '';
            item.mes.desc
              ? mes.push(
                  <span key={i + 2} className="keymes">
                    {intl.get('MockDoc.MockDoc.备注：')}{item.mes.desc}
                  </span>
                )
              : '';
          }
          return (
            <div className="jsonItem" key={i}>
              {<span className="jsonitemNum">{i + 1}.</span>}
              {produceSpace(item.space)}
              {setStrToHtml(item.str)}
              {mes}
            </div>
          );
        })}
      </div>
    );
  }
}

MockDoc.defaultProps = {
  mock: {
    ersrcode: '@integer',
    'data|9-19': [
      '123',
      {
        name: '@name',
        name1: [
          {
            name3: '1'
          }
        ]
      }
    ],
    data1: '123',
    data3: {
      err: 'errCode',
      arr: [1, 2]
    }
  },
  doc: [
    { type: 'strisng', key: 'ersrcode', required: true, desc: intl.get('MockDoc.MockDoc.错误编码') },
    { type: 'number', key: 'data[]', required: true, desc: intl.get('MockDoc.MockDoc.返回数据') },
    { type: 'object', key: 'data[].name', required: true, desc: intl.get('MockDoc.MockDoc.数据名') },
    { type: 'object', key: 'data[].name1[].name3', required: true, desc: intl.get('MockDoc.MockDoc.数据名1') },
    { type: 'object', key: 'data1', required: true, desc: intl.get('MockDoc.MockDoc.数据名1') },
    { type: 'object', key: 'data3.err', required: true, desc: intl.get('MockDoc.MockDoc.数据名1') },
    { type: 'object', key: 'data3', required: true, desc: intl.get('MockDoc.MockDoc.数据名1') },
    { type: 'object', key: 'data3.arr[]', required: true, desc: intl.get('MockDoc.MockDoc.数据名1') }
  ]
};
function produceSpace(count) {
  var space = [];
  for (var i = 0; i < count; i++) {
    space.push(<span key={i} className="spaces" />);
  }
  return space;
}

function setStrToHtml(str) {
  return <span dangerouslySetInnerHTML={{ __html: `${str}` }} />;
}
function arrToHtml(mockArr, mock) {
  for (var i in mockArr) {
    for (var item in mock) {
      // if(mockArr[i].key){
      //   console.log(mockArr[i].key,mock[item].key)
      // }

      if (mockArr[i].key && mockArr[i].key === mock[item].key) {
        mockArr[i].mes = mock[item];
      }
    }
  }
  return mockArr;
}

function mockToArr(mock, html, space, key) {
  html = html || [];
  space = space || 0;
  key = key || [];
  if (typeof mock === 'object' && space === 0) {
    if (mock.constructor === Array) {
      html.push({
        space: space,
        str: '['
      });
      space++;
    } else {
      html.push({
        space: space,
        str: '{'
      });
      space++;
    }
  }
  for (var i in mock) {
    if (!mock.hasOwnProperty(i)) {
      continue;
    }
    var index = i;
    if (/^\w+(\|\w+)?/.test(i)) {
      index = i.split('|')[0];
    }
    if (typeof mock[i] === 'object') {
      if (mock[i].constructor === Array) {
        // shuzu
        if (mock.constructor != Array) {
          if (key.length) {
            key.push('.' + index + '[]');
          } else {
            key.push(index + '[]');
          }
        } else {
          key.push('[]');
        }
        html.push({
          space: space,
          str: index + ' : [',
          key: key.join('')
        });
      } else {
        // object
        if (mock.constructor != Array) {
          if (key.length) {
            key.push('.' + index);
          } else {
            key.push(index);
          }
          html.push({
            space: space,
            str: index + ' : {'
          });
        } else {
          html.push({
            space: space,
            str: '{'
          });
        }
      }
      space++;
      mockToArr(mock[i], html, space, key);
      key.pop();
      space--;
    } else {
      if (mock.constructor === Array) {
        // html.push(produceSpace(space) + mock[i]+ ",");
        html.push({
          space: space,
          str: `<span class = "valueLight">${mock[i]}</span>` + ','
        });
      } else {
        // html.push(produceSpace(space) + index + ":" + mock[i] + ",");
        if (mock.constructor != Array) {
          if (key.length) {
            // doc.push(key+"."+index);
            html.push({
              space: space,
              str: index + ' : ' + `<span class = "valueLight">${mock[i]}</span>` + ',',
              key: key.join('') + '.' + index
            });
          } else {
            // doc.push(key + index);
            html.push({
              space: space,
              str: index + ' : ' + `<span class = "valueLight">${mock[i]}</span>` + ',',
              key: key.join('') + index
            });
          }
        } else {
          html.push({
            space: space,
            str: index + ' : ' + `<span class = "valueLight">${mock[i]}</span>` + ',',
            key: key.join('')
          });
        }
      }
    }
  }
  if (typeof mock === 'object') {
    html[html.length - 1].str = html[html.length - 1].str.substr(
      0,
      html[html.length - 1].str.length - 1
    );
    if (mock.constructor === Array) {
      space--;
      // html.push(produceSpace(space)+"]");
      html.push({
        space: space,
        str: ']'
      });
    } else {
      space--;
      // html.push(produceSpace(space)+"}");
      html.push({
        space: space,
        str: '}'
      });
    }
  }
  if (space != 0) {
    html[html.length - 1].str = html[html.length - 1].str + ',';
  }
  return html;
}

export default MockDoc;
