import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  Dimmer, Loader, Divider,
  Icon,
} from 'semantic-ui-react';

import CleanDetailItem from './CleanDetailItem';

@inject('clean') @observer
class CleanDetail extends React.Component {
  static propTypes = {
    clean: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { clean } = this.props;
    clean.lsAllDirs();
  }

  historyGoBack = () => {
    const { history } = this.props;
    history.go(-1);
  }

  getEmptyEmoji = (empty) => {
    if (empty) {
      return (
        <div className="clean-empty-emoji">
          <span>
            <Icon color="blue" name="smile outline" />
          </span>
          <span>
            <Icon color="purple" name="smile outline" />
          </span>
          <span>
            <Icon color="orange" name="smile outline" />
          </span>
          <span>
            <Icon color="grey" name="smile outline" />
          </span>
          <span>
            <Icon color="yellow" name="smile outline" />
          </span>
        </div>
      );
    }
    return '';
  }

  render() {
    const { clean } = this.props;
    const { cleanDetail, loadingMain, cleanAllDirs } = clean;
    return (
      <div className="router-right-wrapper right-left-show-animation">

        <Dimmer active={loadingMain} inverted>
          <Loader size="small">Loading</Loader>
        </Dimmer>

        <span className="clean-detail-return" onClick={this.historyGoBack}>
          <Icon name="arrow circle left" />
          <span>Return</span>
        </span>
        <Divider />

        <div className="clean-detail-wrapper">

          <div className="clean-detail-content">
            {cleanDetail.map(item => (
              <CleanDetailItem
                key={`clean-detail-content-${item.label}`}
                contents={item.contents}
                label={item.label}
                checked={item.checked}
              />
            ))}
            {
              this.getEmptyEmoji(cleanDetail.length === 0)
            }
          </div>

          <Divider />

          <div className="clean-detail-action">
            <span onClick={cleanAllDirs} >
              <Icon name="trash alternate outline" />
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default CleanDetail;
