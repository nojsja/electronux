import React, { Component } from 'react';
import {
  Progress, Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

@inject('info') @observer
class InfoMemory extends Component {
  static propTypes = {
    memory: PropTypes.shape({
      freemem: PropTypes.string.isRequired,
      totalmem: PropTypes.string.isRequired,
      ratio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  }

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {}

  render() {
    const { memory } = this.props;
    return (
      <div className="info-memory-wrapper">
        <Segment>
          <Progress percent={memory.ratio} attached="top" color="blue" />
          <div className="memory-text-wrapper">
            <span>
                Free Memory [{memory.freemem}]
            </span>
            <span>/</span>
            <span>
              Total Memory [{memory.totalmem}]
            </span>
          </div>
          <Progress percent={memory.ratio} attached="bottom" color="blue" />
        </Segment>
      </div>
    );
  }
}

export default InfoMemory;
