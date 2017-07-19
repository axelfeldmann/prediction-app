import { push } from 'react-router-redux';

const login = (dest) => (dispatch, getState) => {
  setTimeout(() => {
    dispatch({ type: 'LOGIN' });
    const to = (dest ? dest : '/profile');
    dispatch(push(to));
  }, 200);
}

const logout = () => (dispatch, getState) => {
  setTimeout(() => {
    dispatch({ type: 'LOGIN' });
    dispatch(push('/'));
  }, 200);
} 

const Actions = {
  login,
  logout
};

export default Actions;