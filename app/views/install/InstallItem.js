/**
 * Created by nojsja on 17-3-13.
 */
import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { Dimmer, Loader } from 'semantic-ui-react';
import './install.css';

class InstallItem extends React.Component {

  render() {
    const {
      item, onToggle,
      loading, loadingLable
    } = this.props;

    return (
      <div className='install-item-wrapper'>

        <Dimmer active={loading} inverted >
          <Loader size='tiny'>{ loadingLable || 'Loading'}</Loader>
        </Dimmer>

        <div className='install-item-image'>
          <img src={item.url}/>
        </div>
        <div className='install-item-label' title={item.label}>
        {
          item.label
        }
        </div>
        <div className='install-item-switch'>
          <Checkbox checked={item.status} slider onClick={() => {onToggle(item.label, item.status)}}/>
        </div>
      </div>
    );
  }
}
export default InstallItem;
