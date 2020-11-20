import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const { ipcRenderer } = require('electron');

import Modal from 'public/Modal.js';

class StartupSetting extends Component {
  static propTypes = {
    setDetails: PropTypes.func.isRequired,
    addDetail: PropTypes.func.isRequired,
    detail: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    isNew: PropTypes.bool.isRequired,
  }

  constructor() {
    super();
    this.Name = '';
    this.Comment = '';
    this.Exec = '';
  }

  componentDidMount() {}

  onChange = (event, props) => {
    this[props['data-type']] = props.value;
  }

  setDetails = () => {
    const { setDetails, detail } = this.props;
    setDetails({
      file: detail.file,
      Comment: this.Comment,
      Name: this.Name,
      Exec: this.Exec,
    });
  }

  addDetail = () => {
    const { addDetail } = this.props;

    if (this.Name && this.Exec) {
      addDetail({
        Name: this.Name,
        Comment: this.Comment,
        Exec: this.Exec,
      });
    } else {
      ipcRenderer.send('notify-send', {
        title: 'tips',
        body: 'Segment [Name] and [Exec] is required!',
      });
    }
  }

  render() {
    const {
      show, detail, toggleModal, isNew
    } = this.props;
    return (
        <Modal
          show={show}
          onSubmit={isNew ? this.addDetail : this.setDetails}
          onCancel={toggleModal}
          title="New Startup App"
          size="tiny"
        >
            <div className="startup-setting-wrapper">
              <Input size="tiny" data-type="Name" placeholder={`Name：${detail.Name || ''}`} onChange={this.onChange} />
              <Input size="tiny" data-type="Comment" placeholder={`Comment：${detail.Comment || ''}`} onChange={this.onChange} />
              <Input size="tiny" data-type="Exec" placeholder={`Command：${detail.Exec || ''}`} onChange={this.onChange} />
            </div>
        </Modal>
    );
  }
}

export default StartupSetting;
