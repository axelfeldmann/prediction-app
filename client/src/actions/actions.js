import { push } from 'react-router-redux';

const login = (to) => (dispatch, getState) => {
  setTimeout(() => {
    dispatch({ type: 'LOGIN' });
    dispatch(push(to));
  }, 200);
}

const logout = () => (dispatch, getState) => {
  setTimeout(() => {
    dispatch({ type: 'LOGOUT' });
    dispatch(push('/'));
  }, 200);
} 

const Actions = {
  login,
  logout
};

export default Actions;