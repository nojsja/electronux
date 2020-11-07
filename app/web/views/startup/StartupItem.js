import React from 'react';
import { Checkbox, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { boolValue } from '../../utils/utils';

class StartupItem extends React.Component {
  static propTypes = {
    detail: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      file: PropTypes.string.isRequired,
      Hidden: PropTypes.string.isRequired,
    }).isRequired,
    toggleModal: PropTypes.func.isRequired,
    deleteDetail: PropTypes.func.isRequired,
    setDetails: PropTypes.func.isRequired,
  }

  componentDidMount() {}

  render() {
    const {
      detail, toggleModal, deleteDetail, setDetails, icon
    } = this.props;
    return (
      <div className="detail-item-wrapper">
        <span>
          <span>{icon ? <img src={icon}></img> : <Icon name="th" />}</span>
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
