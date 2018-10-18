import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarMinus } from '@fortawesome/free-regular-svg-icons';
import { faPencilAlt, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import boolValue from '../../utils/bool-value';

class StartupItem extends React.Component {
  componentDidMount() {
  }

  render() {
    const {
      detail, toggleModal, deleteDetail, setDetails,
    } = this.props;
    return (
      <div className="detail-item-wrapper">
        <span>
          <span><FontAwesomeIcon icon={faCalendarMinus} color="#5d89e9" /></span>
          <span>{detail.Name}</span>
        </span>
        <span>
          <FontAwesomeIcon
            title="edit"
            icon={faPencilAlt}
            color="#5d89e9"
            onClick={() => toggleModal(detail.file)}
          />
          <FontAwesomeIcon
            title="delete"
            icon={faMinusCircle}
            color="#5d89e9"
            onClick={() => deleteDetail(detail.file)}
          />
          <Checkbox
            title="toggle"
            checked={!boolValue(detail.Hidden)}
            toggle
            onClick={() => {
              setDetails({ file: detail.file, Hidden: !boolValue(detail.Hidden) });
            }}
          />
        </span>
      </div>
    );
  }
}
export default StartupItem;
