import React from 'react';
import { connect } from 'react-redux';
import Actions from '../actions/actions';

const mapDispatchToProps = (dispatch) => ({
  login: (to) => () => dispatch(Actions.login(to))
});

const Login = ({ login, location }) => {
  const dest = (location && location.state) ? (location.state.from.pathname) : '/profile';
  console.log(dest);
  return (
    <div>
      <h1> login </h1>
      <button onClick={ login(dest) }> login </button>
    </div>
  );
};

export default connect(null, mapDispatchToProps)(Login);