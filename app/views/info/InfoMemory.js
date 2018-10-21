import React, { Component } from 'react';
import { Checkbox, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

@inject('info') @observer
class InfoMemory extends Component {
  static propTypes = {
  }

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="info-memory-wrapper">
        memory
      </div>
    );
  }
}

export default InfoMemory;
