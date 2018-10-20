import React from 'react';
import { Checkbox, Icon } from 'semantic-ui-react';

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
          <span><Icon name="th" color="blue" /></span>
          <span>{detail.Name}</span>
        </span>
        <span>
          <Icon
            title="edit"
            name="pencil"
            onClick={() => toggleModal(detail.file)}
          />
          <Icon
            title="delete"
            name="minus circle"
            onClick={() => deleteDetail(detail.file)}
          />
          <span>|</span>
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
