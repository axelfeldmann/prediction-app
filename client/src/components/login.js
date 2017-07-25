import React from 'react';
import { connect } from 'react-redux';
import Actions from '../actions/actions';
import { Redirect } from 'react-router';

const mapDispatchToProps = (dispatch) => ({
  login: (to, username, password) => () => dispatch(Actions.login(to, username, password))
});

const mapStateToProps = (state) => ({
  authStatus: state.auth.status,
});

class Login extends React.Component {
  constructor(){
    super();
    this.state = { username: '', password: '' };
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  updateUsername(event){
    this.setState({ username: event.target.value });
  }
  updatePassword(event){
    this.setState({ password: event.target.value });
  }

  renderContent(status, dest, login){
    console.log(status);
    if(status === 'TRUE'){
      return (
        <Redirect to={ dest }/>
      );
    } else if(status === 'LOADING'){
      return (
        <h1> loading... </h1>
      );
    } else{ //status === 'FALSE'
      return (
        <div className='auth-form'>
          <div className='auth-element'>
            <label>username</label>
            <input onChange={ this.updateUsername } type='text' value={ this.state.username }/>
          </div>
          <div className='auth-element'>
            <label>password</label>
            <input onChange={ this.updatePassword } type='text' value={ this.state.password }/>
          </div>
          <div className='auth-element'>
            <button className='auth-submit' onClick={ login(dest, this.state.username, this.state.password) }>login</button>
          </div>
        </div>
      );
    }
  }

  render(){
    const { authStatus, login, location } = this.props;
    const dest = (location && location.state) ? (location.state.from.pathname) : '/profile';
    return (
      <div className='container'>
        <div className='header'>
        </div>
        <div className='content'>
          { this.renderContent(authStatus, dest, login) }
        </div>
        <div className='footer'>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);