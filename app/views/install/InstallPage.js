/**
 * Created by nojsja on 17-3-13.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Dimmer, Loader } from 'semantic-ui-react';

import InstallItem from './InstallItem';

@inject('install') @observer
class InstallPage extends React.Component {
  constructor() {
    super();
  }

  toggleInstall(item) {
    this.props.install.toggle(item);
  }

  componentDidMount() {
    this.props.install.refresh();
  }

  // 获取loading状态信息 //
  getLoadingStatus = (name, queue) => {
    let loading = false;
    let loadingLable = null;

    if (queue.install.indexOf(name) !== -1) {
      loading = true;
      loadingLable = 'installing';
    }else if (queue.uninstall.indexOf(name) !== -1) {
      loading = true;
      loadingLable = 'uninstalling';
    }

    return [loading, loadingLable];
  }

  render() {
    const { install } = this.props;
    const { loadingMain, queue, intoqueue } = install;
    let loading = false;
    let loadingLable = null;

    return (
      <div className='install-wrapper'>
        <Dimmer active={loadingMain} inverted >
          <Loader size='small'>Loading</Loader>
        </Dimmer>
        {install.total.map((item) => {
          loading = false;
          loadingLable = null;
          [loading, loadingLable] = this.getLoadingStatus(item.label, queue);
          return (
            <InstallItem
              key={'install-page'+item.label}
              loading={loading}
              loadingLable={loadingLable}
              item={item}
              onToggle={intoqueue}
            />
          )
        })}
      </div>
    );
  }
}
export default InstallPage;
