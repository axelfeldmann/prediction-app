import { createStore, combineReducers, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

//initialize history - this is for router reducer and stuff
export const history = createHistory();
const middleware = routerMiddleware(history);

//my own reducers and stuff
const defaultAuth = {};

const authReducer = (state = defaultAuth, action) => {
  return state;
};

export const store = createStore(
  combineReducers({
    auth: authReducer,
    router: routerReducer
  }),
  applyMiddleware(middleware, thunk)
);