import React, { Component } from 'react';
import { Checkbox, Icon, Reveal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

@inject('info') @observer
class InfoCpus extends Component {
  static propTypes = {
    cpus: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      speed: PropTypes.string.isRequired,
    })).isRequired,
  }

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {}

  render() {
    const { cpus } = this.props;

    return (
      <div className="info-cpus-wrapper clear-fix">
        {
          cpus.map((cpu, i) => {
            const key = `cpu-item-${i}`;
            return (
              <div className="cpu-item-wrapper" key={key}>
                <img alt="error" src="resources/info/cpu.png" />
                <div className="cpu-item-text">{cpu.name}</div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default InfoCpus;
