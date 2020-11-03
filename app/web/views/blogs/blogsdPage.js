import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import './blogs.less';
import { Icon, Dimmer, Loader } from 'semantic-ui-react';

// @inject('info') @observer
class BlogsPage extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  state = {
    loading: true
  }

  blogsViewRef = React.createRef()

  webviewBack = () => {
    this.blogsViewRef.current.goBack();
  }

  componentDidMount() {
    this.blogsViewRef.current.addEventListener('did-finish-load', () => {
      this.setState({
        loading: false
      });
    });
  }

  render() {
    const { location } = this.props;
    const { animation } = location.state ? location.state : { animation: '' };
    return (
      <div className={`router-right-wrapper ${animation}`}>
        <Dimmer active={this.state.loading} inverted>
            <Loader size="small">Loading</Loader>
        </Dimmer>
        <div className="blogs-wrapper">
          <div className="func-button">
            <Icon className="arrow left" onClick={this.webviewBack}></Icon>
          </div>
          <webview ref={this.blogsViewRef} src="https://nojsja.gitee.io/blogs/" ></webview>
        </div>
      </div>
    );
  }
}
export default BlogsPage;
