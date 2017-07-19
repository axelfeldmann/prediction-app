import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './stores/store';
import { Provider } from 'react-redux';
import { Route } from 'react-router';

import Homepage from './components/homepage';
import Login from './components/login';
import Profile from './components/profile';
import Test from './components/test';
import PrivateRoute from './components/private-route';

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Route exact path="/" component={Homepage}/>
        <Route path="/login" component={Login}/>
        <PrivateRoute path="/profile" component={Profile}/>
        <PrivateRoute path="/test" component={Test}/>
      </div>
    </ConnectedRouter>
  </Provider>
);

export default App;