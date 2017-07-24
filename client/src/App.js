import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './stores/store';
import { Provider } from 'react-redux';
import { Route } from 'react-router';

import Homepage from './components/homepage';
import Login from './components/login';
import Profile from './components/profile';
import Signup from './components/signup';
import PrivateRoute from './components/private-route';
import AuthLayer from './components/auth-layer';

const App = () => (
  <Provider store={store}>
    <AuthLayer>
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" component={Homepage}/>
          <Route path="/login" component={Login}/>
          <PrivateRoute path="/profile" component={Profile}/>
          <Route path="/signup" component={Signup}/>
        </div>
      </ConnectedRouter>
    </AuthLayer>
  </Provider>
);

export default App;