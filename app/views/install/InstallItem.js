import React from 'react';
import { Checkbox, Dimmer, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function InstallItem({ ...props }) {
  const {
    item,
    onToggle,
    loading,
    loadingLable,
    showTerminalInfo,
  } = { ...props };
  return (
    <div className="install-item-wrapper">

      <div className="install-item-image" onClick={() => {showTerminalInfo(item.label)}}>
        <Dimmer active={loading} inverted>
          <Loader size="tiny">{ loadingLable }</Loader>
        </Dimmer>
        <img alt="error" src={item.url} />
      </div>

      <div className="install-item-switch">
        <Checkbox
          checked={item.status}
          slider
          onClick={() => { onToggle(item.label, item.status); }}
        />
      </div>

      <div
        className="install-item-label"
        title={item.label}
        onClick={() => { showTerminalInfo(item.label)}}
      >
        {item.label}
      </div>

    </div>
  );
}

InstallItem.defaultProps = {
  loadingLable: 'Loading',
};

InstallItem.propTypes = {
  item: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingLable: PropTypes.string,
  showTerminalInfo: PropTypes.func.isRequired,
};


export default InstallItem;
