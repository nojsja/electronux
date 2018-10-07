import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('info') @observer
class InfoPage extends React.Component {

  toggleInstall(index) {
  }

  render() {
    const { info } = this.props;
    return (
      <div >
        info
      </div>
    );
  }
}
export default InfoPage;
