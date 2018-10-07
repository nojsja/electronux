import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('startup') @observer
class StartupPage extends React.Component {

  render() {
    const { startup, animation } = this.props;
    return (
      <div className={`router-right-wrapper ${animation}`}>
        <div>
          startup
        </div>
      </div>
    );
  }
}
export default StartupPage;
