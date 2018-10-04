/**
 * Created by nojsja on 17-3-13.
 */
import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import './install.css';

class InstallItem extends React.Component {

  render() {
    const { item, onToggle } = this.props;
    return (
      <div className='install-item-wrapper'>
        <div className='install-item-image'>
          <img src={item.url}/>
        </div>
        <div className='install-item-label' title={item.label}>
        {
          item.label
        }
        </div>
        <div className='install-item-switch'>
          <Checkbox checked={item.status} slider onClick={() => {onToggle(item.label)}}/>
        </div>
      </div>
    );
  }
}
export default InstallItem;
