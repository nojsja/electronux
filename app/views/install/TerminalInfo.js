import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Header, Icon, Modal,
} from 'semantic-ui-react';

class TerminalInfo extends React.Component {
  static defaultProps = {
    data: '',
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    data: PropTypes.string,
    hideTerminalInfo: PropTypes.func.isRequired,
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleEscapeKeydown, true);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleEscapeKeydown);
  }

  handleEscapeKeydown = (ev) => {
    if (ev.key === 'Escape') {
      const { hideTerminalInfo } = this.props;
      hideTerminalInfo();
    }
  }

  render() {
    const { open, data, hideTerminalInfo } = this.props;
    return (
      <Modal
        open={open}
        basic
        dimmer="blurring"
      >

        <div className="terminal-info-wrapper">
          <span className="terminal-info-close" onClick={hideTerminalInfo}>X</span>
          <textarea className="terminal-info-text" value={data} readOnly />
        </div>

      </Modal>
    );
  }
}

export default TerminalInfo;
