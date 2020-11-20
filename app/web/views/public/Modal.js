import React, { Component } from 'react';
import { Button, Modal, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ModalWrapper extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
  }

  state = {
    show: false,
  }

  onCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }

  render() {
    const {
      show, children, onSubmit,
      options, title, size
    } = this.props;
    return (
        <Modal
          dimmer="inverted"
          open={show}
          size={size}
          {...options}
          className="modal-nojsja"
        >
          { title ? <Modal.Header>{ title }</Modal.Header> : '' }
          <Modal.Content>
            { children }
          </Modal.Content>
          <Modal.Actions>
            <div className="startup-setting-action">
              <Button size="tiny" onClick={this.onCancel}>
                Cancel
              </Button>
              <Button
                color="blue"
                size="tiny"
                onClick={onSubmit}
              >
                Confirm
              </Button>
            </div>
          </Modal.Actions>
        </Modal>
    );
  }
}

export default ModalWrapper;
