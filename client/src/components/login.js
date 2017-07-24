import React from 'react';
import { connect } from 'react-redux';
import Actions from '../actions/actions';

const mapDispatchToProps = (dispatch) => ({
  login: (to, credentials) => () => dispatch(Actions.login(to, credentials))
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

  render(){
    const { login, location } = this.props;
    const dest = (location && location.state) ? (location.state.from.pathname) : '/profile';
    return (
      <div>
        <h1> login </h1>
        <button onClick={ login(dest, this.state) }> login </button>
        username
        <input onChange={ this.updateUsername } type='text' value={ this.state.username }/>
        password
        <input onChange={ this.updatePassword } type='text' value={ this.state.password }/>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Login);