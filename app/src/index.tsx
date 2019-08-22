import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import * as ReactGA from 'react-ga';
import { ConnectedRouter } from 'connected-react-router';
import styled from 'styled-components';
import Store from './store';
import Login from './pages/login';
import Home from './pages/home';
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
  return (
    <Provider store={Store(history)}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/setup" component={Setup} />
          <Route path="/:shelfId" component={Home} />
          <Route path="/" exact component={Home} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
