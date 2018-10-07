import React, {PropTypes, Component} from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Grid } from 'semantic-ui-react';

import StartupPage from './startup/StartupPage';
import InstallPage from './install/InstallPage';
import CleanPage from './clean/CleanPage';
import InfoPage from './info/InfoPage';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {activeItem: 'install'};
    this.total = ['install', 'startup', 'clean', 'info']
    this.componentMap = {
      clean: CleanPage,
      startup: StartupPage,
      install: InstallPage,
      info: InfoPage
    };
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  handleItemClick = (ev, {name}) => {
    this.setState({
      activeItem: name
    })
  }

  activateComponent = (name) => {
    let _compolent = this.componentMap[name];
    return (
      <_compolent />
    )
  }

  buildSubItem = (name, i, activeItem) => {
    return (
      <Menu.Item
        key={name+i+'subitem'}
        name={name}
        active={activeItem === name}
        onClick={this.handleItemClick}
      />
    )
  }

  render() {
    let {activeItem} = this.state;
    return (
      <div className='container-router'>
        <div className='container-router-left'>
           <Menu pointing vertical tabular>
            {
              this.total.map( (name, i)=> {
                return this.buildSubItem(name, i, activeItem);
              } )
            }
          </Menu>
        </div>
        <div className='container-router-right'>
          <div className='router-right-wrapper shadow-normal'>
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
