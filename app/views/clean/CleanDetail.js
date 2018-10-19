import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  Dimmer, Loader, Divider, Button,
} from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt, faArrowCircleLeft,
  faSmile, faSurprise, faSmileWink, faLaughSquint, faKissWinkHeart,
} from '@fortawesome/free-solid-svg-icons';

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
            <FontAwesomeIcon color="#4e97e4" icon={faSmile} />
          </span>
          <span>
            <FontAwesomeIcon color="#3dc61b" icon={faSurprise} />
          </span>
          <span>
            <FontAwesomeIcon color="#de4435" icon={faSmileWink} />
          </span>
          <span>
            <FontAwesomeIcon color="#ec6da2" icon={faLaughSquint} />
          </span>
          <span>
            <FontAwesomeIcon color="#728be8" icon={faKissWinkHeart} />
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
          <FontAwesomeIcon icon={faArrowCircleLeft} />
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
              <FontAwesomeIcon icon={faTrashAlt} />
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default CleanDetail;
