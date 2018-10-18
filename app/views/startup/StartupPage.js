import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { Divider } from 'semantic-ui-react';

import DetailItem from './StartupItem';
import StartupSetting from './StartupSetting';

import './startup.css';

@inject('startup') @observer
class StartupPage extends React.Component {
  constructor() {
    super();
    this.state = {
      activeItem: null,
      isNew: false,  // 是否需要新建
    };
  }

  componentDidMount() {
    const { startup } = this.props;
    startup.getDetails();
  }

  getDetails = () => {
    const { startup } = this.props;
    startup.getDetails();
  }

  newDetail = () => {
    const { startup } = this.props;
    startup.setModal(!startup.modal);
    this.setState({ isNew: true });
  }

  // 获取当前激活的配置文件
  getActiveItem = () => {
    const { activeItem } = this.state;
    const { startup } = this.props;
    let activeDetail = {};

    if (startup.startupDetails.forEach) {
      startup.startupDetails.forEach((detail) => {
        if (detail.file === activeItem) {
          activeDetail = Object.assign(activeDetail, detail);
        }
      });
    }

    return activeDetail;
  }

  // 设置模态窗口的显示和隐藏
  toggleModal = (file) => {
    const { startup } = this.props;
    const setObj = { isNew: false };
    if (file) setObj.activeItem = file;
    startup.setModal(!startup.modal);
    this.setState(setObj);
  }

  render() {
    const { startup, location } = this.props;
    const { isNew } = this.state;
    const { modal } = startup;
    const { animation } = location.state ? location.state : { animation: '' };
    const detailLength = startup.startupDetails.length || 0;
    const label = `Startup Applications(${detailLength})`;
    return (
      <div className={`router-right-wrapper ${animation}`}>
        <div className="startup-wrapper">
          <StartupSetting
            show={modal}
            detail={this.getActiveItem()}
            isNew={isNew}
            setDetails={startup.setDetails}
            addDetail={startup.addDetail}
            toggleModal={this.toggleModal}
          />
          <div className="startup-detail-header">
            <span>{label}</span>
            <span title="add a startup item">
              <FontAwesomeIcon
                title="edit"
                icon={faPlusCircle}
                color="#5d89e9"
                onClick={() => this.newDetail()}
              />
            </span>
          </div>

          <Divider />

          <div className="startup-detail-wrapper">
            {
              startup.startupDetails.map
                && startup.startupDetails.map(detail => (
                  <DetailItem
                    key={`startup-detail-${detail.Name}`}
                    detail={detail}
                    toggleModal={this.toggleModal}
                    deleteDetail={startup.deleteDetail}
                    setDetails={startup.setDetails}
                  />
                ))
            }
          </div>
        </div>
      </div>
    );
  }
}
export default StartupPage;
