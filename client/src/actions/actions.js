import { push } from 'react-router-redux';

const headers = new Headers();
headers.append('Content-Type', 'application/json');

const login = (to, { username, password }) => (dispatch, getState) => {
  fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers
  })
    .then(resp => resp.text())
    .then(text => console.log(text));
}

const register = (username, password) => (dispatch, getState) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json')
  fetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers
  })
    .then(resp => resp.text())
    .then(text => console.log(text));
}

const logout = () => (dispatch, getState) => {
  setTimeout(() => {
    dispatch({ type: 'LOGOUT' });
    dispatch(push('/'));
  }, 200);
} 

const Actions = {
  login,
  logout,
  register
};

export default Actions;