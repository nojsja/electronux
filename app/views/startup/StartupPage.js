import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('startup') @observer
class StartupPage extends React.Component {

  componentDidMount() {
    const { startup } = this.props;
    startup.getDetails();
  }

  getDetails = () => {
    const { startup } = this.props;
    startup.getDetails();
  }

  render() {
    const { startup, location } = this.props;
    const { animation } = location.state ? location.state : { animation: '' };
    console.log(startup.startupDetails);
    return (
      <div className={`router-right-wrapper ${animation}`}>
        <div onClick={this.getDetails}>
          startup
        </div>
        {
          startup.startupDetails.map && startup.startupDetails.map((detail) => {
            return (
              <div key={`startup-detail-${detail.Name}`}>
                <span>{detail.Name}</span>
                <span>{detail.Comment}</span>
                <span>{detail.Exec}</span>
              </div>
            );
          })
        }
      </div>
    );
  }
}
export default StartupPage;
