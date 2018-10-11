import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Menu } from 'semantic-ui-react';
// import { PropTypes } from 'prop-types';
// import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faArrowCircleLeft, faArrowCircleRight, faCog } from '@fortawesome/free-solid-svg-icons';

import startup from './startup/StartupPage';
import install from './install/InstallPage';
import clean from './clean/CleanPage';
import info from './info/InfoPage';

import ScrollIndicator from './public/ScrollIndicator';
import SettingPage from './public/SettingPage';

@inject('pub') @observer
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.lastActiveItem = null;
    this.componentMap = {
      clean,
      startup,
      install,
      info,
    };
  }

  /* ------------------- react event ------------------- */


  componentDidMount() {
  }

  componentWillUnmount() {

  }

  /* ------------------- page event ------------------- */

  openExternalLink = (link) => {
    const { pub } = this.props;
    pub.openExternalLink(link);
  }

  openSettingPage = () => {
    const { pub } = this.props;
    pub.setSettingPage(true);
  }

  closeSettingPage = () => {
    const { pub } = this.props;
    pub.setSettingPage(false);
  }

  toggleRouterMenu = () => {
    const { pub } = this.props;
    pub.toggleNavActivate();
  }

  handleItemClick = (ev, { name }) => {
    const { pub } = this.props;
    pub.setActiveItem(name);
  }

  /* ------------------- element builder ------------------- */

  /* 获取当前激活组件 */
  activateComponent = (name, animation) => {
    const Compolent = this.componentMap[name];
    return (
      <Compolent animation={animation} />
    );
  }

  /* 子菜单组件组件 */
  buildSubItem = (name, i, activeItem) => (
    <Menu.Item
      key={`${name}-${i}-subitem`}
      name={name}
      active={activeItem === name}
      onClick={this.handleItemClick}
    />
  )

  /* 根据导航菜单显示状态选择样式类 */
  getToggleState = navActivate => ({
    toggleIcon: navActivate ? faArrowCircleLeft : faArrowCircleRight,
    toggleClass: navActivate ? 'router-left-toggle' : 'router-left-toggle toggle-hidden',
    rightToggleClass: navActivate ? '' : 'toggle-hidden',
    leftToggleClass: navActivate ? '' : 'toggle-hidden',
  })

  /* 根据组件位置获取计算动画类型 */
  getAnimation = (activeItem, total) => {
    let animationClass = 'right-left-show-animation';

    if (this.lastActiveItem) {
      const lastIndex = total.indexOf(this.lastActiveItem);
      const nowIndex = total.indexOf(activeItem);
      if (nowIndex > lastIndex) {
        animationClass = 'right-left-show-animation';
      } else {
        animationClass = 'left-right-show-animation';
      }
    }
    this.lastActiveItem = activeItem;
    return {
      animation: animationClass,
    };
  }

  /* ------------------- page render ------------------- */

  render() {
    const { pub } = this.props;
    const { checkPassword } = pub;
    const { activeItem, navActivate, total, settingPage, password } = pub.state;
    const { animation } = this.getAnimation(activeItem, total);
    const {
      toggleIcon, toggleClass, rightToggleClass, leftToggleClass,
    } = this.getToggleState(navActivate);
    return (
      <div className="container-router">
        <div className={`container-router-left shadow-normal router-left-background text-white-shadow ${leftToggleClass}`}>
          <div className="router-left-mask" />
          <Menu pointing vertical>
            {
              total.map((name, i) => this.buildSubItem(name, i, activeItem))
            }
          </Menu>

          <SettingPage
            open={settingPage}
            closeSettingPage={this.closeSettingPage}
            checkPassword={checkPassword}
            password={password}
            setPassword={pub.setPassword}
          />

          <div className="router-left-menu">
            <span className="router-left-setting" onClick={() => {this.openSettingPage()}}>
              <FontAwesomeIcon icon={faCog} />
            </span>
            <span onClick={() => {this.openExternalLink('https://www.github.com/NoJsJa')}}>
              <FontAwesomeIcon icon={faGithub} />
            </span>
            <span className={toggleClass} onClick={this.toggleRouterMenu}>
              <FontAwesomeIcon icon={toggleIcon} />
            </span>

          </div>
        </div>

        <div className={`container-router-right ${rightToggleClass}`}>
          {
            this.activateComponent(activeItem, animation)
          }
          <ScrollIndicator
            total={total}
            activeItem={activeItem}
            handleItemClick={this.handleItemClick}
          />
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
