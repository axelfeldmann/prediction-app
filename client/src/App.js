import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './stores/store';
import { Provider } from 'react-redux';
import { Route } from 'react-router';

import Homepage from './components/homepage';
import Login from './components/login';
import MainPage from './components/mainpage';
import Signup from './components/signup';
import PrivateRoute from './components/private-route';
import AuthLayer from './components/auth-layer';

import './App.css';

const App = () => (
  <Provider store={store}>
    <AuthLayer>
      <ConnectedRouter history={history}>
        <div>
          <Route exact path='/' component={ Homepage }/>
          <Route path='/login' component={ Login }/>
          <Route path='/signup' component={ Signup }/>
          <PrivateRoute path='/profile' component={ MainPage }/>
          <PrivateRoute path='/leagues' component={ MainPage }/>
          <PrivateRoute path='/newleague' component={ MainPage }/>
          <PrivateRoute path='/invites' component={ MainPage }/>
        </div>
      </ConnectedRouter>
    </AuthLayer>
  </Provider>
);

export default App;