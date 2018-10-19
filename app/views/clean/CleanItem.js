import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function CleanItem({ ...props }) {
  const {
    item,
    onToggle,
  } = { ...props };
  return (
    <div className="clean-item-wrapper">

      <div className="clean-item-image">
        <img alt="error" src={item.url} />
      </div>

      <div
        className="clean-item-label"
        title={item.label}
      >
        {item.label}
      </div>

      <div className="clean-item-switch">
        <Checkbox
          checked={item.checked}
          slider
          onClick={() => { onToggle(item.label); }}
        />
      </div>

    </div>
  );
}

CleanItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
  }).isRequired,
};

export default CleanItem;
