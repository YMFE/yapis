const yapi = require('../yapi.js');
const baseModel = require('./base.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

class interfaceCase extends baseModel {
  getName() {
    return 'interface_case';
  }

  getSchema() {
    return {
      casename: { type: String, required: true },
      uid: { type: Number, required: true },
      col_id: { type: Number, required: true },
      index: { type: Number, default: 0 },
      project_id: { type: Number, required: true },
      interface_id: { type: Number, required: true },
      add_time: Number,
      up_time: Number,
      case_env: { type: String },
      req_params: [
        {
          name: String,
          value: String
        }
      ],
      req_headers: [
        {
          name: String,
          value: String
        }
      ],
      req_query: [
        {
          name: String,
          value: String,
          enable: { type: Boolean, default: true }
        }
      ],

      req_body_form: [
        {
          name: String,
          value: String,
          enable: { type: Boolean, default: true }
        }
      ],
      req_body_other: String,
      test_res_body: String,
      test_status: { type: String, enum: ['ok', 'invalid', 'error', ''] },
      test_res_header: Schema.Types.Mixed,
      mock_verify: { type: Boolean, default: false },
      enable_script: { type: Boolean, default: false },
      test_script: String
    };
  }

  save(data) {
    let m = new this.model(data);
    return m.save();
  }

  //获取全部测试接口信息
  getInterfaceCaseListCount() {
    return this.model.countDocuments({});
  }

  get(id) {
    return this.model
      .findOne({
        _id: id
      })
      .exec();
  }

  list(col_id, select) {
    select = select || 'casename uid col_id _id index interface_id project_id';
    if (select === 'all') {
      return this.model
        .find({
          col_id: col_id
        })
        .exec();
    }
    return this.model
      .find({
        col_id: col_id
      })
      .select(select)
      .exec();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  delByProjectId(id) {
    return this.model.remove({
      project_id: id
    });
  }

  delByInterfaceId(id) {
    return this.model.remove({
      interface_id: id
    });
  }

  delByCol(id) {
    return this.model.remove({
      col_id: id
    });
  }

  up(id, data) {
    data.up_time = yapi.commons.time();
    return this.model.update({ _id: id }, data);
  }

  upCaseIndex(id, index) {
    return this.model.update(
      {
        _id: id
      },
      {
        index: index
      }
    );
  }
  
  getMaxIndex(){
    return this.model.findOne().sort({index:-1}).limit(1).exec();
  }
}

module.exports = interfaceCase;
