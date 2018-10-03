/**
 * Created by eatong on 17-3-13.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('clean') @observer
class CleanPage extends React.Component {

  toggleInstall(index) {
  }

  render() {
    const { clean } = this.props;
    return (
      <div >
        clean
      </div>
    );
  }
}
export default CleanPage;
