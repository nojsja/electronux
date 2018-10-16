import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('startup') @observer
class StartupPage extends React.Component {

  componentDidMount() {}

  render() {
    const { startup, location } = this.props;
    const { animation } = location.state ? location.state : { animation: '' };


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
