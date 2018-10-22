import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import './info.css';

import InfoBasic from './InfoBasic';
import InfoMemory from './InfoMemory';
import InfoCpus from './InfoCpus';

@inject('info') @observer
class InfoPage extends React.Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { info } = this.props;
    info.getTotal();
  }

  render() {
    const { info, location } = this.props;
    const { animation } = location.state ? location.state : { animation: '' };
    return (
      <div className={`router-right-wrapper ${animation}`}>
        <div className="info-wrapper">
          <InfoCpus cpus={info.cpus} />
          <InfoMemory memory={info.memoryInfo} />
          <InfoBasic basic={info.basicInfo} user={info.userInfo} />
        </div>
      </div>
    );
  }
}
export default InfoPage;
