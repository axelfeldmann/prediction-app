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
      copy.error = action.error;
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
  league: null,
  error: '',
  membersLoading: false,
  invitesLoading: false,
  loading: false
};

const leagueReducer = (state = defaultLeague, action) => {
  let league, copy;
  switch(action.type){
    case 'LOADING_LEAGUE':
      copy = Object.assign({}, defaultLeague);
      copy.loading = true;
      return copy;
    case 'LOADING_INVITEES':
      copy = Object.assign({}, state);
      copy.invitesLoading = true;
      copy.error = '';
      return copy;
    case 'LOADING_MEMBERS':
      copy = Object.assign({}, state);
      copy.membersLoading = true;
      copy.error = '';
      return copy;
    case 'GOT_INVITEES':
      copy = Object.assign({}, state);
      league = Object.assign({}, state.league);
      copy.league = league;
      copy.league.invites = action.invitees;
      copy.invitesLoading = false;
      copy.error = '';
      return copy;
    case 'GOT_MEMBERS':
      copy = Object.assign({}, state);
      league = Object.assign({}, state.league);
      copy.league = league;
      copy.league.members = action.members;
      copy.membersLoading = false;
      copy.error = '';
      return copy;
    case 'GOT_LEAGUE':
      return { 
        error: '',
        league: Object.assign({}, action.league),
        membersLoading: false,
        invitesLoading: false,
        loading: false
      };
    case 'GOT_LEAGUE_ERROR':
      return {
        league: state.league,
        error: action.error,
        membersLoading: false,
        invitesLoading: false,
        loading: false
      };
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