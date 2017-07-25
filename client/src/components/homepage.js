import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classnames from 'classnames';

const mapStateToProps = (state) => ({
  authStatus: state.auth.status,
  username: state.auth.username
});

const mapDispatchToProps = (dispatch) => ({
  toProfile: () => dispatch(push('/profile')),
  toLogin: () => dispatch(push('/login')),
  toSignup: () => dispatch(push('/signup'))
});

const renderHeader = (props) => {

  const { toProfile, toLogin, toSignup, authStatus, username } = props;
  const classes = classnames('header-right');

  console.log(authStatus);
  console.log(username);

  if(authStatus === 'TRUE'){
    return (
      <div className={ classes }>
        <div onClick={ toProfile } className='header-badge'>{ username }</div>
      </div>
    );
  } else if(authStatus === 'LOADING'){
    return (
      <div className={ classes }>
        <div className='header-badge'>loading...</div>
      </div>
    );
  } else { //authStatus === 'FALSE'
    return (
      <div className={ classes }>
        <div onClick={ toLogin } className='header-badge'>login</div>
        <div onClick={ toSignup } className='header-badge'>sign up</div>
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