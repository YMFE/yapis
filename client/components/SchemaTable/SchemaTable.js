import React, { Component } from 'react';
import { Table } from 'antd';
import json5 from 'json5';
import PropTypes from 'prop-types';
import { schemaTransformToTable } from '../../../common/schema-transformTo-table.js';
import _ from 'underscore';
import './index.scss';
import intl from "react-intl-universal";

const messageMap = {
  desc: intl.get('SchemaTable.SchemaTable.备注'),
  default: intl.get('SchemaTable.SchemaTable.实例'),
  maximum: intl.get('SchemaTable.SchemaTable.最大值'),
  minimum: intl.get('SchemaTable.SchemaTable.最小值'),
  maxItems: intl.get('SchemaTable.SchemaTable.最大数量'),
  minItems: intl.get('SchemaTable.SchemaTable.最小数量'),
  maxLength: intl.get('SchemaTable.SchemaTable.最大长度'),
  minLength: intl.get('SchemaTable.SchemaTable.最小长度'),
  enum: intl.get('SchemaTable.SchemaTable.枚举'),
  enumDesc: intl.get('SchemaTable.SchemaTable.枚举备注'),
  uniqueItems: intl.get('SchemaTable.SchemaTable.元素是否都不同'),
  itemType: intl.get('SchemaTable.SchemaTable.item 类型'),
  format: 'format',
  itemFormat: 'format',
  mock: 'mock'
};

const columns = [
  {
    title: intl.get('SchemaTable.SchemaTable.名称'),
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: intl.get('SchemaTable.SchemaTable.类型'),
    dataIndex: 'type',
    key: 'type',
    width: 100,
    render: (text, item) => {
      // console.log('text',item.sub);
      return text === 'array' ? (
        <span>{item.sub ? item.sub.itemType || '' : 'array'} []</span>
      ) : (
        <span>{text}</span>
      );
    }
  },
  {
    title: intl.get('SchemaTable.SchemaTable.是否必须'),
    dataIndex: 'required',
    key: 'required',
    width: 80,
    render: text => {
      return <div>{text ? intl.get('SchemaTable.SchemaTable.必须') : intl.get('SchemaTable.SchemaTable.非必须')}</div>;
    }
  },
  {
    title: intl.get('SchemaTable.SchemaTable.默认值'),
    dataIndex: 'default',
    key: 'default',
    width: 80,
    render: text => {
      return <div>{_.isBoolean(text) ? text + '' : text}</div>;
    }
  },
  {
    title: intl.get('SchemaTable.SchemaTable.备注'),
    dataIndex: 'desc',
    key: 'desc',
    render: (text, item) => {
      return _.isUndefined(item.childrenDesc) ? (
        <span className="table-desc">{text}</span>
      ) : (
        <span className="table-desc">{item.childrenDesc}</span>
      );
    }
  },
  {
    title: intl.get('SchemaTable.SchemaTable.其他信息'),
    dataIndex: 'sub',
    key: 'sub',
    width: 180,
    render: (text, record) => {
      let result = text || record;

      return Object.keys(result).map((item, index) => {
        let name = messageMap[item];
        let value = result[item];
        let isShow = !_.isUndefined(result[item]) && !_.isUndefined(name);

        return (
          isShow && (
            <p key={index}>
              <span style={{ fontWeight: '700' }}>{name}: </span>
              <span>{value.toString()}</span>
            </p>
          )
        );
      });
    }
  }
];

class SchemaTable extends Component {
  static propTypes = {
    dataSource: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    let product;
    try {
      product = json5.parse(this.props.dataSource);
    } catch (e) {
      product = null;
    }
    if (!product) {
      return null;
    }
    let data = schemaTransformToTable(product);
    data = _.isArray(data) ? data : [];
    return <Table bordered size="small" pagination={false} dataSource={data} columns={columns} />;
  }
}
export default SchemaTable;
