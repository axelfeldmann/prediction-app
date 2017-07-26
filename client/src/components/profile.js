import React from 'react';
import { connect } from 'react-redux';
import Actions from '../actions/actions';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(Actions.logout()),
  toHomepage: () => dispatch(push('/'))
});

const mapStateToProps = (state) => ({
  username: state.auth.username
});

const Profile = ({ logout, toHomepage, username }) => (
  <div className='container'>
    <div className='header'>
      <div className='header-right'>
        <button onClick={ toHomepage } className='header-badge'>home</button>
        <button onClick={ logout } className='header-badge'> logout </button>
      </div>
    </div>
    <div className='content'>
      <h1>welcome, { username }</h1>
    </div>
    <div className='footer'>
    </div>
  </div>
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));