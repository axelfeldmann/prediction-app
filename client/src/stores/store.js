import { createStore, combineReducers, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

//initialize history - this is for router reducer and stuff
export const history = createHistory();
const middleware = routerMiddleware(history);

//status can be: TRUE, FALSE, or LOADING
const defaultAuth = { username: '', token: '', status: 'FALSE' };

//placeholder auth reducer
const authReducer = (state = defaultAuth, action) => {
  let copy;
  switch(action.type){
    case 'LOGIN':
      copy = Object.assign({}, state);
      copy.auth = true;
      return copy; 
    case 'LOGOUT':
      copy = Object.assign({}, state);
      copy.auth = false;
      return copy;
    default:
      return state;
  }
};

export const store = createStore(
  combineReducers({
    auth: authReducer,
    router: routerReducer
  }),
  applyMiddleware(middleware, thunk)
);