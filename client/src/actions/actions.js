import { push } from 'react-router-redux';

const headers = new Headers();
headers.append('Content-Type', 'application/json');

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' }
  if(token)
    headers['Authorization'] = 'bearer ' + token;
  return new Headers(headers);
}

///////////////////////////////////////////////////////////////////////////////
// api requests
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// check authentication
///////////////////////////////////////////////////////////////////////////////

const checkAuth = (token) => (dispatch, getState) => {
  dispatch(authLoading());
  fetch('/api/user', {
    method: 'GET',
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.status !== 200) throw new Error('bad auth');
      return resp.json();
    })
    .then(json => dispatch(authSuccess(json.username, token)))
    .catch(err => dispatch(authFailed()));
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

///////////////////////////////////////////////////////////////////////////////
// login actions
///////////////////////////////////////////////////////////////////////////////

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
} 

///////////////////////////////////////////////////////////////////////////////
// register actions
///////////////////////////////////////////////////////////////////////////////

const signup = (username, password, confirm, errorCb) => (dispatch, getState) => {
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

///////////////////////////////////////////////////////////////////////////////
// league actions
///////////////////////////////////////////////////////////////////////////////

const newLeague = (token, leagueName) => (dispatch, getState) => {
  fetch('/api/newleague', {
    method: 'POST',
    body: JSON.stringify({ test: leagueName }),
    headers: getHeaders(token)
  })
    .then(resp => resp.json())
    .then(json => console.log(json));
}



const Actions = {
  login,
  logout,
  signup,
  checkAuth,
  newLeague
};

export default Actions;