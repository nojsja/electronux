import React from 'react';
import { Checkbox, Dimmer, Loader } from 'semantic-ui-react';
import './install.css';

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

      <Dimmer active={loading} inverted>
        <Loader size="tiny">{ loadingLable || 'Loading'}</Loader>
      </Dimmer>

      <div className="install-item-image" onClick={() => {showTerminalInfo(item.label)}}>
        <img alt="error" src={item.url} />
      </div>
      <div className="install-item-switch">
        <Checkbox
          checked={item.status}
          slider
          onClick={() => { onToggle(item.label, item.status); }}
        />
      </div>
      <div className="install-item-label" title={item.label}>
        {item.label}
      </div>
    </div>
  );
}

export default InstallItem;
