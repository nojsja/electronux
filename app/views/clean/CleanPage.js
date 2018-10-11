import React from 'react';
import { inject, observer } from 'mobx-react';
import { Dimmer, Loader, Divider, Checkbox } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './clean.css';

import CleanItem from './CleanItem';

@inject('clean') @observer
class CleanPage extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {
    const { clean, animation } = this.props;
    const {
      loadingMain, allChecked, total, toggleAllChecked, toggleChecked,
    } = clean;

    return (
      <div className={`router-right-wrapper ${animation}`}>

        <Dimmer active={loadingMain} inverted>
          <Loader size="small">Loading</Loader>
        </Dimmer>

        <Checkbox
          toggle
          checked={allChecked}
          label="Select All"
          onClick={() => toggleAllChecked()}
        />

        <Divider />

        <div className="clean-wrapper">

          <div className="clean-content">
            {total.map(item => (
              <CleanItem
                key={`clean-page-${item.label}`}
                item={item}
                onToggle={toggleChecked}
              />
            ))}
          </div>

          <div className="clean-action">
            <span>
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default CleanPage;
