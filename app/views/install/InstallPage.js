/**
 * Created by nojsja on 17-3-13.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import InstallItem from './InstallItem';

@inject('install') @observer
class InstallPage extends React.Component {

  toggleInstall(item) {
    this.props.install.toggle(item);
  }

  componentDidMount() {
    this.props.install.refresh();
  }

  render() {
    const {install} = this.props;
    return (
      <div className='install-wrapper'>
        {install.total.map((item) => {
          return (<InstallItem key={'install-page'+item.label} item={item} onToggle={install.toggle}/>)
        })}
      </div>
    );
  }
}
export default InstallPage;
