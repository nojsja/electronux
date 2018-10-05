/**
 * Created by nojsja on 17-3-13.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('startup') @observer
class StartupPage extends React.Component {

  toggleInstall(index) {
  }

  render() {
    const { startup } = this.props;
    return (
      <div >
        startup
      </div>
    );
  }
}
export default StartupPage;
