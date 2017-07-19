import React from 'react';
import { connect } from 'react-redux';
import Actions from '../actions/actions';

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(Actions.login())
});

const Login = ({ login }) => (
  <div>
    <h1> login </h1>
    <button onClick={ login }> login </button>
  </div>
);

export default connect(null, mapDispatchToProps)(Login);