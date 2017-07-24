import { push } from 'react-router-redux';

const headers = new Headers();
headers.append('Content-Type', 'application/json');

///////////////////////////////////////////////////////////////////////////////
// check authentication
///////////////////////////////////////////////////////////////////////////////

const checkAuth = (token) => (dispatch, getState) => {

};

const authFailed = () => ({
  type: 'AUTH_FAILED'
});

const authSuccess = (username, token) => ({
  type: 'AUTH_SUCCESS',
  username,
  token
});

///////////////////////////////////////////////////////////////////////////////
// login actions
///////////////////////////////////////////////////////////////////////////////

const login = (to, { username, password }, errorCb) => (dispatch, getState) => {
  fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers
  })
    .then(resp => resp.json())
    .then(json => {
      if(json.success){
        window.localStorage.setItem('token', json.token);
        dispatch(authSuccess());
        dispatch(push('/profile'));
      }
      else
        errorCb(json.message);
    });
};

///////////////////////////////////////////////////////////////////////////////
// register actions
///////////////////////////////////////////////////////////////////////////////

const signup = (username, password, errorCb) => (dispatch, getState) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json')
  fetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers
  })
    .then(resp => resp.text())
    .then(text => console.log(text));
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