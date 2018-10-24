import React from 'react';
import { Checkbox, Dimmer, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const importDir = require('../../utils/import-dir');

// 批量引入所有图片(可以指定所有图片类型)
// const requireContext = require.context('../../../resources/install', true, /^\.\/.*\.(jpg|png)$/);
const requireContext = require.context('../../../resources/install', true, /.*/);
requireContext.keys().map(requireContext);

// 不能通过变量引入，要不然不能识别
// importDir('resources/install/').forEach((addr) => {
//   require(addr);
// });

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
