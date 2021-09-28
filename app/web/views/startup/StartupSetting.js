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
    this.state = {
      Name: null,
      Comment: null,
      Exec: null
    }
  }

  componentDidMount() {}

  onChange = (event, props) => {
    this.setState({
      [props['data-type']]: props.value
    });
  }

  closeModal = () => {
    const { toggleModal } = this.props;
    this.setState({
      Name: null,
      Comment: null,
      Exec: null
    });
    toggleModal();
  }

  setDetails = () => {
    const { setDetails, detail } = this.props;
    this.closeModal();
    console.log({
      file: detail.file,
      Comment: this.state.Comment,
      Name: this.state.Name,
      Exec: this.state.Exec,
    }, setDetails);
    setDetails({
      file: detail.file,
      Comment: this.state.Comment,
      Name: this.state.Name,
      Exec: this.state.Exec,
    });
  }

  addDetail = () => {
    const { addDetail } = this.props;
    console.log(1);

    if (this.state.Name && this.Exec) {
      this.closeModal();
      addDetail({
        Name: this.state.Name,
        Comment: this.state.Comment,
        Exec: this.state.Exec,
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
      show, detail, isNew
    } = this.props;
    const { Name, Comment, Exec } = this.state;
    return (
        <Modal
          show={show}
          onSubmit={isNew ? this.addDetail : this.setDetails}
          onCancel={this.closeModal}
          title="New Startup App"
          size="tiny"
        >
            <div className="startup-setting-wrapper">
              <Input size="tiny" data-type="Name" value={Name === null ? detail.Name : Name} placeholder={`Name：${detail.Name || ''}`} onChange={this.onChange} />
              <Input size="tiny" data-type="Comment" value={Comment === null ? detail.Comment : Comment} placeholder={`Comment：${detail.Comment || ''}`} onChange={this.onChange} />
              <Input size="tiny" data-type="Exec" value={Exec === null ? detail.Exec : Exec} placeholder={`Command：${detail.Exec || ''}`} onChange={this.onChange} />
            </div>
        </Modal>
    );
  }
}

export default StartupSetting;
