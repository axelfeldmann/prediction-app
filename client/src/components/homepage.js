import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Actions from '../actions/actions';

const mapStateToProps = (state) => ({
  authStatus: state.auth.status,
  username: state.auth.username
});

const mapDispatchToProps = (dispatch) => ({
  toProfile: () => dispatch(push('/profile')),
  toLogin: () => dispatch(push('/login')),
  toSignup: () => dispatch(push('/signup')),
  logout: () => dispatch(Actions.logout())
});

const renderHeader = (props) => {

  const { toProfile, toLogin, toSignup, authStatus, username, logout } = props;
  const classes = 'header-right';

  if(authStatus === 'TRUE'){
    return (
      <div className={ classes }>
        <button onClick={ toProfile } className='header-badge'>{ username }</button>
        <button onClick={ logout } className='header-badge'>logout</button>
      </div>
    );
  } else if(authStatus === 'LOADING'){
    return (
      <div className={ classes }>
        <button className='header-badge'>loading...</button>
      </div>
    );
  } else { //authStatus === 'FALSE'
    return (
      <div className={ classes }>
        <button onClick={ toLogin } className='header-badge'>login</button>
        <button onClick={ toSignup } className='header-badge'>sign up</button>
      </div>
    );
  }
} 

const Homepage = (props) => {

  return (
    <div className='container'>
      <div className='header'>
        { renderHeader(props) }
      </div>
      <div className='content'>
        <h1> welcome to the wizard identification app </h1>
      </div>
      <div className='footer'>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);