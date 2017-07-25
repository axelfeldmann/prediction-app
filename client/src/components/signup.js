import React from 'react';
import Actions from '../actions/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

const mapDispatchToProps = (dispatch) => ({
  signup: (username, password) => () => 
    dispatch(Actions.signup(username, password))
});

const mapStateToProps = (state) => ({
  authStatus: state.auth.status
});

class Signup extends React.Component {
  constructor(){
    super();
    this.state = { username: '', password: '', error: '' };
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.errorCb = this.errorCb.bind(this);
  }
  updateUsername(event){
    this.setState({ username: event.target.value });
  }
  updatePassword(event){
    this.setState({ password: event.target.value });
  }
  errorCb(message){
    this.setState({ error: message });
  }

  renderContent(authStatus, signup){
    if(authStatus === 'FALSE'){
      return (
        <div className='auth-form'>
          { this.state.error ? (<div className='auth-error'>{ this.state.error }</div>) : null }
          <div className='auth-element'>
            <label>new username</label>
            <input onChange={ this.updateUsername } type='text' value={ this.state.username }/>
          </div>
          <div className='auth-element'>
            <label>new password</label>
            <input onChange={ this.updatePassword } type='text' value={ this.state.password }/>
          </div>
          <div className='auth-element'>
            <button 
              className='auth-submit' 
              onClick={ signup(this.state.username, this.state.password, this.errorCb) }
              >
              signup
            </button>
          </div>
        </div>
      );
    } else {
      return ( <Redirect to={ '/' }/> );
    }
  }

  render(){
    return (
      <div className='container'>
        <div className='header'>
        </div>
        <div className='content'>
          { this.renderContent(this.props.authStatus, this.props.signup) }
        </div>
        <div className='footer'>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);