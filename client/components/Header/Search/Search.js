import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Input, AutoComplete } from 'antd';
import './Search.scss';
import { withRouter } from 'react-router';
import axios from 'axios';
import { setCurrGroup, fetchGroupMsg } from '../../../reducer/modules/group';
import { changeMenuItem } from '../../../reducer/modules/menu';

import { fetchInterfaceListMenu } from '../../../reducer/modules/interface';
import intl from "react-intl-universal";

const Option = AutoComplete.Option;

@connect(
  state => ({
    groupList: state.group.groupList,
    projectList: state.project.projectList
  }),
  {
    setCurrGroup,
    changeMenuItem,
    fetchGroupMsg,
    fetchInterfaceListMenu
  }
)
@withRouter
export default class Srch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }

  static propTypes = {
    groupList: PropTypes.array,
    projectList: PropTypes.array,
    router: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    setCurrGroup: PropTypes.func,
    changeMenuItem: PropTypes.func,
    fetchInterfaceListMenu: PropTypes.func,
    fetchGroupMsg: PropTypes.func
  };

  onSelect = async (value, option) => {
    if (option.props.type === intl.get('Search.Search.分组')) {
      this.props.changeMenuItem('/group');
      this.props.history.push('/group/' + option.props['id']);
      this.props.setCurrGroup({ group_name: value, _id: option.props['id'] - 0 });
    } else if (option.props.type === intl.get('Search.Search.项目')) {
      await this.props.fetchGroupMsg(option.props['groupId']);
      this.props.history.push('/project/' + option.props['id']);
    } else if (option.props.type === intl.get('Search.Search.接口')) {
      await this.props.fetchInterfaceListMenu(option.props['projectId']);
      this.props.history.push(
        '/project/' + option.props['projectId'] + '/interface/api/' + option.props['id']
      );
    }
  };

  handleSearch = value => {
    axios
      .get('/api/project/search?q=' + value)
      .then(res => {
        if (res.data && res.data.errcode === 0) {
          const dataSource = [];
          for (let title in res.data.data) {
            res.data.data[title].map(item => {
              switch (title) {
                case 'group':
                  dataSource.push(
                    <Option
                      key={`分组${item._id}`}
                      type={intl.get('Search.Search.分组')}
                      value={`${item.groupName}`}
                      id={`${item._id}`}
                    >
                      {`分组: ${item.groupName}`}
                    </Option>
                  );
                  break;
                case 'project':
                  dataSource.push(
                    <Option
                      key={`项目${item._id}`}
                      type={intl.get('Search.Search.项目')}
                      id={`${item._id}`}
                      groupId={`${item.groupId}`}
                    >
                      {`项目: ${item.name}`}
                    </Option>
                  );
                  break;
                case 'interface':
                  dataSource.push(
                    <Option
                      key={`接口${item._id}`}
                      type={intl.get('Search.Search.接口')}
                      id={`${item._id}`}
                      projectId={`${item.projectId}`}
                    >
                      {`接口: ${item.title}`}
                    </Option>
                  );
                  break;
                default:
                  break;
              }
            });
          }
          this.setState({
            dataSource: dataSource
          });
        } else {
          console.log(intl.get('Search.Search.查询项目或分组失败'));
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // getDataSource(groupList){
  //   const groupArr =[];
  //   groupList.forEach(item =>{
  //     groupArr.push("group: "+ item["group_name"]);
  //   })
  //   return groupArr;
  // }

  render() {
    const { dataSource } = this.state;

    return (
      <div className="search-wrapper">
        <AutoComplete
          className="search-dropdown"
          dataSource={dataSource}
          style={{ width: '100%' }}
          defaultActiveFirstOption={false}
          onSelect={this.onSelect}
          onSearch={this.handleSearch}
          // filterOption={(inputValue, option) =>
          //   option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          // }
        >
          <Input
            prefix={<Icon type="search" className="srch-icon" />}
            placeholder={intl.get('Search.Search.搜索分组/项目/接口')}
            className="search-input"
          />
        </AutoComplete>
      </div>
    );
  }
}
