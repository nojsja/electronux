import React from 'react';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Dimmer, Loader } from 'semantic-ui-react';

import InstallItem from './InstallItem';
import TerminalInfo from './TerminalInfo';

@inject('install') @observer
class InstallPage extends React.Component {
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

  render() {
    const { install, animation } = this.props;
    const { activeTerminal, terminalShow } = this.state;
    const {
      loadingMain, queue, intoqueue, terminalInfo,
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
