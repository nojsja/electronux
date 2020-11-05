import React from 'react';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  Dimmer, Loader, Divider, Checkbox,
} from 'semantic-ui-react';

import './install.less';

import InstallItem from './InstallItem';
import TerminalInfo from './TerminalInfo';

// 批量引入所有图片(可以指定所有图片类型)
// const requireContext = require.context('resources/install', true, /^\.\/.*\.(jpg|png)$/);
const requireContext = require.context('resources/install', true, /.*/);
requireContext.keys().map(requireContext);

@inject('install') @observer
class InstallPage extends React.Component {
  /* ------------------- propTypes ------------------- */
  static propTypes = {
    install: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {
      activeTerminal: null,
      terminalShow: false,
    };
  }

  componentDidMount() {
    const { install } = this.props;
    install.refresh();
  }

  /* ------------------- define func ------------------- */

  // 获取loading状态信息 //
  getLoadingStatus = (name, queue) => {
    let loading = false;
    let loadingLable = null;

    if (queue.install.indexOf(name) !== -1) {
      loading = true;
      loadingLable = 'installing';
    } else if (queue.uninstall.indexOf(name) !== -1) {
      loading = true;
      loadingLable = 'uninstalling';
    }

    return [loading, loadingLable];
  }

  showTerminalInfo = (item) => {
    this.setState({
      activeTerminal: item,
      terminalShow: true,
    });
  };

  hideTerminalInfo = () => {
    this.setState({
      terminalShow: false,
    });
  };

  setSourceCN = (checked) => {
    const { install } = this.props;
    if (!checked) {
      install.setSourceCN();
    }
  }

  render() {
    const { install, location } = this.props;
    const { activeTerminal, terminalShow } = this.state;
    const { animation } = location.state ? location.state : { animation: '' };
    const {
      loadingMain, queue, intoqueue, terminalInfo, sourceChecked,
    } = install;
    let loading = false;
    let loadingLable = null;

    return (
      <div className={`router-right-wrapper ${animation}`}>

        <TerminalInfo
          data={terminalInfo[activeTerminal]}
          open={terminalShow}
          hideTerminalInfo={this.hideTerminalInfo}
        />

        <Checkbox
          toggle
          checked={sourceChecked}
          label={sourceChecked ? 'china software source setted' : 'click to set china software source (important!)'}
          onClick={() => this.setSourceCN(sourceChecked)}
        />

        <Divider />

        <div className="install-wrapper">
          <Dimmer active={loadingMain} inverted>
            <Loader size="small">Loading</Loader>
          </Dimmer>

          {install.total.map((item) => {
            [loading = false, loadingLable = null] = this.getLoadingStatus(item.label, queue);
            return (
              <InstallItem
                key={`install-page-${item.label}`}
                loading={loading}
                loadingLable={loadingLable}
                item={item}
                onToggle={intoqueue}
                showTerminalInfo={this.showTerminalInfo}
                terminalInfo={terminalInfo[item.label]}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
export default InstallPage;
