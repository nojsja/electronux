import React, { Component } from 'react';
import { Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@inject('clean') @observer
class CleanDetailItem extends Component {
  static propTypes = {
    contents: PropTypes.arrayOf(PropTypes.object).isRequired,
    clean: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
  }

  constructor() {
    super();
    this.state = {
      visible: false,
    };
    this.header = {};
    this.list = [];
  }

  componentDidMount() {}

  toggleVisible = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  }

  getVisibleClass = () => {
    const { visible } = this.state;
    return visible ? '' : 'electronux_hidden';
  }

  getVisibleIcon = () => {
    const { visible } = this.state;
    if (visible) {
      return faChevronDown;
    }
    return faChevronRight;
  }

  getCheckedIconColor = (checked) => {
    if (checked) {
      return '#666666';
    }
    return '#cfcfcf';
  }

  handleData = (_data, label) => {
    const data = _data.concat([]);
    data.reverse();
    const header = data.shift();
    const list = data;
    return {
      header: header || { content: label, size: 0 },
      list: list || [],
    };
  }

  toggleDetailAll = (clean, checked, label) => {
    clean.toggleDetailAll(label, !checked);
  }

  getAllCheckedStatus = (label, clean) => {
    let status = true;
    const { allCheckedDetail, cleanPathMap } = clean;
    for (let i = 0; i < cleanPathMap[label].length; i += 1) {
      if (!allCheckedDetail.includes(cleanPathMap[label][i])) {
        status = false;
        break;
      }
    }
    return status;
  }

  render() {
    const { contents, clean, label } = this.props;
    const {
      toggleDetailOne,
      allCheckedDetail,
    } = clean;
    const { header, list } = this.handleData(contents, label);
    const vclass = this.getVisibleClass();
    const allChecked = this.getAllCheckedStatus(label, clean);
    return (
      <div className="detail-item-wrapper">
        <div className="detail-item-header">
          <span>
            <FontAwesomeIcon icon={this.getVisibleIcon()} onClick={this.toggleVisible} />
            <Checkbox
              checked={allChecked}
              onClick={() => this.toggleDetailAll(clean, allChecked, label)}
            />
            <span>{`${header.content} (${list.length})`}</span>
            <span className="header-name">{clean.getHeaderLabel(header.content)}</span>
          </span>
          <span className="header-size">{header.size}</span>
        </div>
        <div className={`detail-item-list ${vclass}`}>
          {
            list.map(con => (
              <div className="list-item" key={`detail-item-list-${con.content}`}>
                <span>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    color={this.getCheckedIconColor(allCheckedDetail.includes(con.content))}
                    onClick={() => { toggleDetailOne(con.content); }}
                  />
                  <span className="list-content">{con.content}</span>
                </span>
                <span>{con.size}</span>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default CleanDetailItem;
