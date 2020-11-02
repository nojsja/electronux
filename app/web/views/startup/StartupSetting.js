import React, { Component } from 'react';
import { Button, Modal, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const { ipcRenderer } = require('electron');

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
      show, detail, toggleModal, isNew,
    } = this.props;
    return (
      <div>
        <Modal dimmer="inverted" open={show} size="mini">
          <Modal.Content>
            <div className="startup-setting-wrapper">
              <Input size="tiny" data-type="Name" placeholder={`Name：${detail.Name || ''}`} onChange={this.onChange} />
              <Input size="tiny" data-type="Comment" placeholder={`Comment：${detail.Comment || ''}`} onChange={this.onChange} />
              <Input size="tiny" data-type="Exec" placeholder={`Command：${detail.Exec || ''}`} onChange={this.onChange} />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <div className="startup-setting-action">
              <Button size="tiny" onClick={toggleModal}>
                Cancel
              </Button>
              <Button
                color="blue"
                size="tiny"
                onClick={isNew ? this.addDetail : this.setDetails}
              >
                Confirm
              </Button>
            </div>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default StartupSetting;
