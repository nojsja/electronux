/**
 * Created by eatong on 17-3-13.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('install') @observer
class InstallPage extends React.Component {

  toggleInstall(index) {
    this.props.todo.toggle(index);
  }

  render() {
    const {install} = this.props;
    return (
      <div >
        install
      </div>
    );
  }
}
export default InstallPage;
