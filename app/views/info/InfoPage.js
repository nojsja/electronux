import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('info') @observer
class InfoPage extends React.Component {

  toggleInstall(index) {
  }

  render() {
    const { info, animation } = this.props;
    return (
      <div className={`router-right-wrapper ${animation}`}>
        <div>
          info
        </div>
      </div>
    );
  }
}
export default InfoPage;
