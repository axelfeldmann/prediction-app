import { createStore, combineReducers, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

//initialize history - this is for router reducer and stuff
export const history = createHistory();
const middleware = routerMiddleware(history);

////////////////////////////////////////////////////////////////////////////////

const defaultInvites = { invites: [], error: '', loading: false };

const invitesReducer = (state = defaultInvites, action) => {
  let copy;
  switch(action.type){
    case 'LOADING_INVITES':
      copy = Object.assign({}, state);
      copy.invites = [];
      copy.error = '';
      copy.loading = true;
      return copy;
    case 'FAILED_INVITES':
      copy = Object.assign({}, state);
      copy.invites = [];
      copy.error = action.error;
      copy.loading = false;
      return copy;
    case 'INVITES_ERROR':
      copy = Object.assign({}, state);
      copy.loading = false;
      return copy;
    case 'GOT_INVITES':
      copy = Object.assign({}, state);
      copy.invites = action.invites;
      copy.error = '';
      copy.loading = false;
      return copy;
    default:
      return state;
  }
}

////////////////////////////////////////////////////////////////////////////////

const defaultLeague = {
  league: {},
  error: '',
  loading: false,
  inviteesLoading: false
};

const leagueReducer = (state = defaultLeague, action) => {
  let copy;
  switch(action.type){
    case 'LOADING_LEAGUE':
      copy = Object.assign({}, state);
      copy.league = {};
      copy.error = '';
      copy.loading = true;
      return copy;
    case 'LEAGUE_FAILED':
      copy = Object.assign({}, state);
      copy.league = {};
      copy.error = action.error;
      copy.loading = false;
      return copy;
    case 'GOT_LEAGUE':
      copy = Object.assign({}, state);
      copy.league = action.league;
      copy.error = '';
      copy.loading = false;
      return copy;
    case 'NEW_INVITES':
      copy = Object.assign({}, state);
      const leagueCopy = Object.assign({}, copy.league);
      leagueCopy.invites = action.invites;
      copy.league = leagueCopy;
      copy.inviteesLoading = false;
      return copy;
    case 'INVITEES_LOADING':
      copy = Object.assign({}, state);
      copy.inviteesLoading = true;
      return copy;
    case 'INVITEES_FAILED':
      copy = Object.assign({}, state);
      copy.inviteesLoading = false;
      return copy;
    default:
      return state;
  }
};

////////////////////////////////////////////////////////////////////////////////

const defaultLeagueList = { leagues: [], error: '', loading: false };

const leagueListReducer = (state = defaultLeagueList, action) => {
  let copy;
  switch(action.type){
    case 'LOADING_LEAGUE_LIST':
      copy = Object.assign({}, state);
      copy.leagues = [];
      copy.error = '';
      copy.loading = true;
      return copy;
    case 'LEAGUE_LIST_FAILED':
      copy = Object.assign({}, state);
      copy.leagues = [];
      copy.error = action.error;
      copy.loading = false;
      return copy;
    case 'GOT_LEAGUE_LIST':
      copy = Object.assign({}, state);
      copy.leagues = action.leagues;
      copy.error = '';
      copy.loading = false;
      return copy;
    default:
      return state;
  }
};

////////////////////////////////////////////////////////////////////////////////

//status can be: TRUE, FALSE, or LOADING
const defaultAuth = { username: '', token: '', status: 'FALSE' };

//placeholder auth reducer
const authReducer = (state = defaultAuth, action) => {
  let copy;
  switch(action.type){
    case 'AUTH_SUCCESS':
      copy = Object.assign({}, state);
      copy.username = action.username;
      copy.token = action.token;
      copy.status = 'TRUE';
      return copy;
    case 'AUTH_FAILED':
      copy = Object.assign({}, state);
      copy.username = '';
      copy.token = ''
      copy.status = 'FALSE';
      return copy;
    case 'AUTH_LOADING':
      copy = Object.assign({}, state);
      copy.username = '';
      copy.token = '';
      copy.status = 'LOADING';
      return copy;
    case 'LOGOUT':
      copy = Object.assign({}, state);
      copy.username = '';
      copy.token = '';
      copy.status = 'FALSE';
      return copy;
    default:
      return state;
  }
};

export const store = createStore(
  combineReducers({
    auth: authReducer,
    leagueList: leagueListReducer,
    league: leagueReducer,
    router: routerReducer,
    invites: invitesReducer
  }),
  applyMiddleware(middleware, thunk)
);