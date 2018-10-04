/**
 * Created by eatong on 17-3-12.
 */
import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader'

import 'semantic-ui-css/semantic.min.css';
import './styles/public.css';

import App from './App';

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextRootContainer = require('./App').default;
    render(<NextRootContainer />, document.getElementById('root'));
  })
}
