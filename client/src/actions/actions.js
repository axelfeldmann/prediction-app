import { push } from 'react-router-redux';

const headers = new Headers();
headers.append('Content-Type', 'application/json');

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' }
  if(token)
    headers['Authorization'] = 'bearer ' + token;
  return new Headers(headers);
};

////////////////////////////////////////////////////////////////////////////////
// check authentication
////////////////////////////////////////////////////////////////////////////////

const checkAuth = (token) => (dispatch, getState) => {
  dispatch(authLoading());
  fetch('/user/check', {
    method: 'GET',
    headers: getHeaders(token)
  })
    .then(resp => resp.json())
    .then(json => {
      if(json.success)
        dispatch(authSuccess(json.username, token));
      else
        dispatch(authFailed());
    });
};

const authSuccess = (username, token) => ({
  type: 'AUTH_SUCCESS',
  username,
  token
});

const authFailed = () => ({
  type: 'AUTH_FAILED'
});

const authLoading = () => ({
  type: 'AUTH_LOADING'
});

////////////////////////////////////////////////////////////////////////////////
// login actions
////////////////////////////////////////////////////////////////////////////////

const login = (to, username, password, errorCb) => (dispatch, getState) => {
  fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: getHeaders()
  })
    .then(resp => resp.json())
    .then(json => {
      if(json.success){
        window.localStorage.setItem('token', json.token);
        dispatch(authSuccess(json.user.username, json.token));
        dispatch(push('/profile'));
      } else {
        errorCb(json.message);
      }
    });
};

const logout = () => {
  window.localStorage.removeItem('token');
  return { type: 'LOGOUT' }
};

////////////////////////////////////////////////////////////////////////////////
// register actions
////////////////////////////////////////////////////////////////////////////////

const signup = (username, password, confirm, errorCb) => 
  (dispatch, getState) => {
  fetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password, confirm }),
    headers: getHeaders()
  })
    .then(resp => resp.json())
    .then(json => {
      if(json.success){
        dispatch(push('/login'));
      } else {
        errorCb(json.message);
      }
    });
};

////////////////////////////////////////////////////////////////////////////////
// new league action
////////////////////////////////////////////////////////////////////////////////

const newLeague = (token, leagueName, errorCb) => (dispatch, getState) => {
  fetch('/leagues/new', {
    method: 'POST',
    body: JSON.stringify({ leagueName }),
    headers: getHeaders(token)
  })
    .then(resp => resp.json())
    .then(json => {
      if(json.success)
        return dispatch(push('/leagues'));
      errorCb(json.message);
    });
};

////////////////////////////////////////////////////////////////////////////////
// league list actions
////////////////////////////////////////////////////////////////////////////////

const loadingLeagueList = () => ({
  type: 'LOADING_LEAGUE_LIST'
});

const leagueListFailed = (error) => ({
  type: 'LEAGUE_LIST_FAILED',
  error
});

const gotLeagueList = (leagues) => ({
  type: 'GOT_LEAGUE_LIST',
  leagues
});

const getLeagueList = (token) => (dispatch, getState) => {
  dispatch(loadingLeagueList());
  fetch('/leagues/', {
    method: 'GET',
    headers: getHeaders(token)
  })
    .then(resp => resp.json())
    .then(json => {
      if(json.success){
        dispatch(gotLeagueList(json.leagues));
      } else {
        dispatch(leagueListFailed(json.message));
      }
    });
};

////////////////////////////////////////////////////////////////////////////////
// league actions
////////////////////////////////////////////////////////////////////////////////

const loadingLeague = () => ({
  type: 'LOADING_LEAGUE'
});

const leagueFailed = (error) => ({
  type: 'LEAGUE_FAILED',
  error
});

const gotLeague = (league) => ({
  type: 'GOT_LEAGUE',
  league
});

const getLeague = (token, leagueID) => (dispatch, getState) => {
  dispatch(loadingLeague());
  fetch(`/leagues/${leagueID}`, {
    method: 'GET',
    headers: getHeaders(token)
  })
    .then(resp => resp.json())
    .then(json => {
      if(json.success){
        dispatch(gotLeague(json.league));
      } else {
        dispatch(leagueFailed(json.message));
      }
    });
};

////////////////////////////////////////////////////////////////////////////////
// invite actions
////////////////////////////////////////////////////////////////////////////////

const newInvites = (invites) => ({
  type: 'NEW_INVITES',
  invites
});

const inviteesLoading = () => ({
  type: 'INVITEES_LOADING'
});

const inviteesFailed = () => ({
  type: 'INVITEES_FAILED'
});

const sendInvite = (token, leagueID, invitee, errorCb) => 
  (dispatch, getState) => {
    dispatch(inviteesLoading());
    fetch(`/leagues/invite`, {
      method: 'POST',
      body: JSON.stringify({ leagueID, invitee }),
      headers: getHeaders(token)
    })
      .then(resp => resp.json())
      .then(json => {
        if(!json.success){
          errorCb(json.message);
          dispatch(inviteesFailed());
        }
        else
          dispatch(newInvites(json.invites));
      });
};

const loadingInvites = () => ({
  type: 'LOADING_INVITES'
});

const failedInvites = (error) => ({
  type: 'FAILED_INVITES',
  error
});

const gotInvites = (invites) => ({
  type: 'GOT_INVITES',
  invites
});

const getInvites = (token, username) => (dispatch, getState) => {
  dispatch(loadingInvites());
  fetch(`/leagues/invites/${username}`, {
    method: 'GET',
    headers: getHeaders(token)
  })
    .then(resp => resp.json())
    .then(json => {
      if(!json.success)
        dispatch(failedInvites(json.message));
      else
        dispatch(gotInvites(json.invites));
    });
};

////////////////////////////////////////////////////////////////////////////////
// accept/reject actions
////////////////////////////////////////////////////////////////////////////////

const accept = (token, leagueID, errorCb) => (dispatch, getState) => {
  fetch('leagues/accept-invite', {
    method: 'POST',
    body: JSON.stringify({ leagueID }),
    headers: getHeaders(token)
  })
    .then(resp => resp.json())
    .then(json => {
      if(json.success)
        dispatch(push(`/leagues/${leagueID}`));
      else
        errorCb(json.message);
    });
};

const reject = (token, leagueID, errorCb) => (dispatch, getState) => {
  fetch('leagues/reject-invite', {
    method: 'POST',
    body: JSON.stringify({ leagueID }),
    headers: getHeaders(token)
  })
    .then(resp => resp.json())
    .then(json => {
      if(json.success)
        dispatch(getInvites(token, getState().auth.username));
      else
        errorCb(json.message);
    })
};

////////////////////////////////////////////////////////////////////////////////
// export actions
////////////////////////////////////////////////////////////////////////////////

const Actions = {
  login,
  logout,
  signup,
  checkAuth,
  newLeague,
  getLeagueList,
  getLeague,
  sendInvite,
  getInvites,
  accept,
  reject  
};

export default Actions;