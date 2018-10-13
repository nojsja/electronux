import React, { Component } from 'react'
import { Button, Modal, Input } from 'semantic-ui-react'

/**
 * [ScrollIndicator 滑动指示器]
 * @param       {[Array]}    total           [所有菜单项目]
 * @param       {[String]}   activeItem      [当前激活项目]
 * @param       {[Function]} handleItemClick [点击事件处理]
 */

class SettingPage extends Component {
  constructor() {
    super();
    this.state = {
      password: '',
    };
  }

  componentDidMount() {
    const { checkPassword } = this.props;
    // checkPassword();
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
    const { open, closeSettingPage } = this.props;
    const { password } = this.state;
    return (
      <div>
        <Modal dimmer="inverted" open={open} size="mini">
          <Modal.Content>
            <div className="setting-page-wrapper">
              <p>Password：</p>
              <Input size="tiny" value={password} type="password" onChange={this.onPasswdChange} />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <div className="setting-page-action">
              <Button size="tiny" onClick={closeSettingPage}>
                Cancel
              </Button>
              <Button color="blue" size="tiny" onClick={this.setPassword}>Confirm</Button>
            </div>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default SettingPage;
