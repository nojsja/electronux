import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  Dimmer, Loader, Divider, Checkbox, Icon,
} from 'semantic-ui-react';

import './clean.css';

import { history } from '../../App';

import CleanItem from './CleanItem';

// 批量引入所有图片(可以指定所有图片类型)
// const requireContext = require.context('resources/install', true, /^\.\/.*\.(jpg|png)$/);
const requireContext = require.context('resources/clean', true, /.*/);
requireContext.keys().map(requireContext);

@inject('clean') @observer
class CleanPage extends React.Component {
  static propTypes = {
    clean: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {}

  // 路由跳转 //
  redirectToDetail = () => {
    const { clean } = this.props;
    history.push('/clean/detail');
  }

  render() {
    const { clean, location } = this.props;
    const {
      loadingMain, allChecked, total, toggleAllChecked, toggleChecked,
    } = clean;
    const { animation } = location.state ? location.state : { animation: '' };

    return (
      <div className={`router-right-wrapper ${animation}`}>

        <Dimmer active={loadingMain} inverted>
          <Loader size="small">Loading</Loader>
        </Dimmer>

        <Checkbox
          toggle
          checked={allChecked}
          label="Select All"
          onClick={() => toggleAllChecked()}
        />

        <Divider />

        <div className="clean-wrapper">

          <div className="clean-content">
            {total.map(item => (
              <CleanItem
                key={`clean-page-${item.label}`}
                item={item}
                onToggle={toggleChecked}
                history={history}
              />
            ))}
          </div>

          <div className="clean-action">
            <span onClick={this.redirectToDetail} >
              <Icon name="search" />
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default CleanPage;
