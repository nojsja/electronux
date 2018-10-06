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

  render() {
    const { install } = this.props;
    const { loadingMain, toggle } = install;
    return (
      <div className='install-wrapper'>
        <Dimmer active={loadingMain} inverted >
          <Loader size='small'>Loading</Loader>
        </Dimmer>
        {install.total.map((item) => {
          return (<InstallItem key={'install-page'+item.label} item={item} onToggle={toggle}/>)
        })}
      </div>
    );
  }
}
export default InstallPage;
