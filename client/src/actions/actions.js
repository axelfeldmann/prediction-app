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

const checkAuth = (token) => (dispatch) => {
  console.log('hi');
  dispatch(authLoading());
  fetch('/user/check', {
    method: 'GET',
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object')
        dispatch(authSuccess(parsed.username, token));
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

const login = (to, username, password, errorCb) => (dispatch) => {
  fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: getHeaders()
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object'){
        window.localStorage.setItem('token', parsed.token);
        dispatch(authSuccess(parsed.user.username, parsed.token));
        dispatch(push('/profile'));
      } else {
        errorCb(parsed);
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
  (dispatch) => {
  fetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password, confirm }),
    headers: getHeaders()
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object')
        dispatch(push('/login'));
      else
        errorCb(parsed);
    });
};

////////////////////////////////////////////////////////////////////////////////
// new league action
////////////////////////////////////////////////////////////////////////////////

const newLeague = (token, leagueName, errorCb) => (dispatch) => {
  fetch('/leagues/new', {
    method: 'POST',
    body: JSON.stringify({ leagueName }),
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object')
        dispatch(push('/leagues'));
      else
        errorCb(parsed);
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

const getLeagueList = (token) => (dispatch) => {
  dispatch(loadingLeagueList());
  fetch('/leagues/', {
    method: 'GET',
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object')
        dispatch(gotLeagueList(parsed.leagues));
      else
        dispatch(leagueListFailed(parsed));
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

const getLeague = (token, leagueID) => (dispatch) => {
  dispatch(loadingLeague());
  fetch(`/leagues/${leagueID}`, {
    method: 'GET',
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object')
        dispatch(gotLeague(parsed.league));
      else
        dispatch(leagueFailed(parsed));
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

const inviteesFailed = (error) => ({
  type: 'INVITEES_FAILED',
  error
});

const sendInvite = (token, leagueID, invitee, errorCb) => (dispatch) => {
  dispatch(inviteesLoading());
  fetch(`/leagues/invite`, {
    method: 'POST',
    body: JSON.stringify({ leagueID, invitee }),
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object')
        dispatch(newInvites(parsed.invites));
      else
        dispatch(inviteesFailed(parsed));
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

const getInvites = (token, username) => (dispatch) => {
  dispatch(loadingInvites());
  fetch(`/leagues/invites/${username}`, {
    method: 'GET',
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object')
        dispatch(gotInvites(parsed.invites));
      else
        dispatch(failedInvites(parsed));
    });
};

////////////////////////////////////////////////////////////////////////////////
// accept/reject actions
////////////////////////////////////////////////////////////////////////////////

const invitesError = (error) => ({
  type: 'INVITES_ERROR',
  error
});

const accept = (token, leagueID) => (dispatch) => {
  dispatch(invitesError(''));
  fetch('leagues/accept-invite', {
    method: 'POST',
    body: JSON.stringify({ leagueID }),
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object')
        dispatch(push(`/leagues/${leagueID}`));
      else
        dispatch(invitesError(parsed));
    });
};

const reject = (token, leagueID, errorCb) => (dispatch, getState) => {
  dispatch(invitesError(''));
  fetch('leagues/reject-invite', {
    method: 'POST',
    body: JSON.stringify({ leagueID }),
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object')
        dispatch(getInvites(token, getState().auth.username));
      else
        dispatch(invitesError(parsed));
    });
};

////////////////////////////////////////////////////////////////////////////////
// remove action
////////////////////////////////////////////////////////////////////////////////

const remove = (token, leagueID, target, successCb) => (dispatch) => {
  fetch('/leagues/remove', {
    method: 'POST',
    body: JSON.stringify({ leagueID, target }),
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.ok)
        return resp.json();
      else
        return resp.text();
    })
    .then(parsed => {
      if(typeof parsed === 'object')
        successCb(parsed.message);
      else //TODO BETTER ERROR HANDLING
        console.log(parsed)
    });
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
  reject,
  remove
};

export default Actions;