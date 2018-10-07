import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Menu } from 'semantic-ui-react';
// import { PropTypes } from 'prop-types';
// import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

import startup from './startup/StartupPage';
import install from './install/InstallPage';
import clean from './clean/CleanPage';
import info from './info/InfoPage';

@inject('pub') @observer
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.componentMap = {
      clean,
      startup,
      install,
      info,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  openExternalLink = (link) => {
    const { pub } = this.props;
    pub.openExternalLink(link);
  }

  toggleRouterMenu = () => {
    const { pub } = this.props;
    pub.toggleNavActivate();
  }

  handleItemClick = (ev, { name }) => {
    const { pub } = this.props;
    pub.setActiveItem(name);
  }

  activateComponent = (name) => {
    const Compolent = this.componentMap[name];
    return (
      <Compolent />
    );
  }

  buildSubItem = (name, i, activeItem) => (
    <Menu.Item
      key={`${name}-${i}-subitem`}
      name={name}
      active={activeItem === name}
      onClick={this.handleItemClick}
    />
  )

  getToggleState = navActivate => ({
    toggleIcon: navActivate ? faArrowCircleLeft : faArrowCircleRight,
    toggleClass: navActivate ? 'router-left-toggle' : 'router-left-toggle toggle-hidden',
    rightToggleClass: navActivate ? '' : 'toggle-hidden',
    leftToggleClass: navActivate ? '' : 'toggle-hidden',
  })

  render() {
    const { pub } = this.props;
    const { activeItem, navActivate, total } = pub.state;
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
          <div className="router-left-menu">
            <span onClick={() => {this.openExternalLink('https://www.github.com/NoJsJa')}}>
              <FontAwesomeIcon icon={faGithub} />
            </span>
            <span className={toggleClass} onClick={this.toggleRouterMenu}>
              <FontAwesomeIcon icon={toggleIcon} />
            </span>
          </div>
        </div>
        <div className={`container-router-right ${rightToggleClass}`}>
          <div className="router-right-wrapper">
            {
              this.activateComponent(activeItem)
            }
          </div>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
