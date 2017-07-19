import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

const mapDispatchToProps = (dispatch) => ({
  toProfile: () => dispatch(push('/profile')),
  toLogin: () => dispatch(push('/login'))
});

const Homepage = ({ toProfile, toLogin }) => (
  <div>
    <h1> homepage </h1>
    <button onClick={ toProfile }> to profile </button>
    <button onClick={ toLogin }> to login </button>
  </div>
);

export default connect(null, mapDispatchToProps)(Homepage);