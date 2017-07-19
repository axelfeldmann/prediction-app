import React from 'react';
import { connect } from 'react-redux';
import Actions from '../actions/actions';
import { push } from 'react-router-redux';

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(Actions.logout()),
  toHomepage: () => dispatch(push('/'))
});

const Profile = ({ logout, toHomepage }) => (
  <div>
    <h1> profile page </h1>
    <button onClick={ logout }> logout </button>
    <button onClick={ toHomepage }> to homepage </button>
  </div>
);

export default connect(null, mapDispatchToProps)(Profile);