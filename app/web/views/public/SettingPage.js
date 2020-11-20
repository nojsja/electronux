import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';
import Modal from 'public/Modal.js';
import PropTypes from 'prop-types';

/**
 * [ScrollIndicator 滑动指示器]
 * @param       {[Array]}    total           [所有菜单项目]
 * @param       {[String]}   activeItem      [当前激活项目]
 * @param       {[Function]} handleItemClick [点击事件处理]
 */

class SettingPage extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeSettingPage: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      password: '',
    };
  }

  componentDidMount() {
    const { checkPassword } = this.props;
    checkPassword();
  }

  onPasswdChange = (ev, { value }) => {
    this.setState({
      password: value,
    });
  }

  setPassword = () => {
    const { setPassword } = this.props;
    const { password } = this.state;
    if (password) {
      setPassword(password);
    }
  }

  render() {
    const { open, closeSettingPage, password } = this.props;
    return (
      <Modal
        show={open}
        size="mini"
        onSubmit={this.setPassword}
        onCancel={closeSettingPage}
      >
            <div className="setting-page-wrapper">
              <p>Password：</p>
              <Input size="tiny" value={this.state.password || password} type="password" onChange={this.onPasswdChange} />
            </div>
        
      </Modal>
    )
  }
}

export default SettingPage;
