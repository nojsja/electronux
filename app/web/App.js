import React from 'react';
import { Route, Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import createHistory from 'history/createBrowserHistory';
import InstallState from './stores/Install';
import CleanState from './stores/Clean';
import InfoState from './stores/Info';
import StartupState from './stores/Startup';
import PublicState from './stores/Public';

// import HomePage from './views/HomePage';

import routes from './router/index';
import RouteWithSubRoutes from './router/RouteWithSubRoutes';

/* ------------------- global history ------------------- */
export const history = createHistory();

const stores = {
  install: new InstallState(),
  startup: new StartupState(),
  info: new InfoState(),
  clean: new CleanState(),
  pub: new PublicState(),
};

function App() {
  return (
    <Provider {...stores}>
      <Router history={history}>
        {/* <Route path="/" component={HomePage} /> */}
        <RouteWithSubRoutes route={routes} />
      </Router>
    </Provider>
  );
}

/* ------------------- export provider ------------------- */
export default App;
