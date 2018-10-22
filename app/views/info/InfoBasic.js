import React, { Component } from 'react';
import { Checkbox, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

@inject('info') @observer
class InfoBasic extends Component {
  static propTypes = {
    basic: PropTypes.shape({
      hostname: PropTypes.string.isRequired,
      release: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      arch: PropTypes.string.isRequired,
      uptime: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      homedir: PropTypes.string.isRequired,
      shell: PropTypes.string.isRequired,
    }).isRequired,
  }

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {}

  render() {
    const { basic, user } = this.props;
    return (
      <div className="info-basic-wrapper">
        <span className="black-dot" />
        <p>
          <span>HostName: </span>
          <span>{basic.hostname}</span>
        </p>
        <p>
          <span>Platform: </span>
          <span>{basic.platform}</span>
        </p>
        <p>
          <span>Release: </span>
          <span>{basic.release}</span>
        </p>
        <p>
          <span>Arch: </span>
          <span>{basic.arch}</span>
        </p>
        <p>
          <span>Uptime: </span>
          <span>{basic.uptime}</span>
        </p>
        <p>
          <span>User: </span>
          <span>{user.username}</span>
        </p>
        <p>
          <span>HomeDir: </span>
          <span>{user.homedir}</span>
        </p>
        <p>
          <span>Shell: </span>
          <span>{user.shell}</span>
        </p>
      </div>
    );
  }
}

export default InfoBasic;
