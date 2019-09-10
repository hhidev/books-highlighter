import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import * as ReactGA from 'react-ga';
import { ConnectedRouter } from 'connected-react-router';
import Store from './store';
import Login from './pages/login';
import Home from './pages/home/pc';
import HomeMobile from './pages/home/mobile';
import Setup from './pages/setup';
import Auth from './pages/auth';

const history = createBrowserHistory();
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_CODE);
history.listen((location, action) => {
  if (process.env.NODE_ENV !== 'development') {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }
});

const App: React.FunctionComponent = props => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <Provider store={Store(history)}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" exact render={props => <Login {...props} />} />
          <Auth>
            <Switch>
              <Route
                path="/setup"
                exact
                render={props => <Setup {...props} />}
              />
              <Route
                path="/:shelfId"
                exact
                render={props =>
                  isMobile ? <HomeMobile {...props} /> : <Home {...props} />
                }
              />
            </Switch>
          </Auth>
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
