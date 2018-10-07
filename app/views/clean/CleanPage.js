import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('clean') @observer
class CleanPage extends React.Component {

  toggleInstall(index) {
  }

  render() {
    const { clean, animation } = this.props;
    return (
      <div className={`router-right-wrapper ${animation}`}>
        <div>
          clean
        </div>
      </div>
    );
  }
}
export default CleanPage;
