import React from 'react';
import { inject, observer } from 'mobx-react';
import { Dimmer, Loader, Divider, Checkbox } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import CleanDetailItem from './CleanDetailItem';


@inject('clean') @observer
class CleanDetail extends React.Component {
  componentDidMount() {
    const { clean } = this.props;
    clean.lsAllDirs();
  }

  historyGoBack = () => {
    const { history } = this.props;
    history.go(-1);
  }

  render() {
    const { clean } = this.props;
    const { cleanDetail } = clean;
    console.log(cleanDetail);
    return (
      <div className="router-right-wrapper right-left-show-animation">

        <Dimmer active={false} inverted>
          <Loader size="small">Loading</Loader>
        </Dimmer>

        <button onClick={this.historyGoBack}>Back</button>

        <Divider />

        <div className="clean-detail-wrapper">

          <div className="clean-detail-content">
            {cleanDetail.map(item => (
              <CleanDetailItem
                key={`clean-detail-content-${item.label}`}
                contents={item.contents}
              />
            ))}
          </div>

          <div className="clean-detail-action">
            <span>
              <FontAwesomeIcon icon={faTrashAlt} />
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default CleanDetail;
