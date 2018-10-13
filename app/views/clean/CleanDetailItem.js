import React, { Component } from 'react';
import { Checkbox } from 'semantic-ui-react';

class CleanDetailItem extends Component {
  componentDidMount() {}

  render() {
    const { contents } = this.props;
    return (
      <div className="detail-item-wrapper">
        <div className="detail-item-list">
          {
            contents.reverse().map(con => (
              <div className="detail-item-header">
                <span>{con.content}</span>
                <span>{con.size}</span>
                <span>{con.checked}</span>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default CleanDetailItem;
