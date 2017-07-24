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
  fetch('/api/user', {
    method: 'GET',
    headers: getHeaders(token)
  })
    .then(resp => {
      if(resp.status !== 200) throw new Error('bad auth');
      return resp.json();
    })
    .then(json => dispatch(authSuccess(json.username)))
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

const login = (to, { username, password }, errorCb) => (dispatch, getState) => {
  fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: getHeaders()
  })
    .then(resp => resp.json())
    .then(json => {
      if(json.success){
        window.localStorage.setItem('token', json.token);
        dispatch(authSuccess());
        dispatch(push('/profile'));
      } else {
        errorCb(json.message);
      }
    });
};

///////////////////////////////////////////////////////////////////////////////
// register actions
///////////////////////////////////////////////////////////////////////////////

const signup = (username, password, errorCb) => (dispatch, getState) => {
  fetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
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

const logout = () => (dispatch, getState) => {
  window.localStorage.removeItem('token');
  return { type: 'LOGOUT' }
} 

const Actions = {
  login,
  logout,
  signup,
  checkAuth
};

export default Actions;