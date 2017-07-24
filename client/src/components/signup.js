import React from 'react';
import Actions from '../actions/actions';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch) => ({
  signup: (username, password) => () => 
    dispatch(Actions.signup(username, password))
});

class Signup extends React.Component {
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
    return (
      <div>
        <h3>Signup</h3>
        username
        <input onChange={ this.updateUsername } type='text' value={ this.state.username }/>
        password
        <input onChange={ this.updatePassword } type='text' value={ this.state.password }/>
        <button onClick={ this.props.signup(this.state.username, this.state.password) }> sign up! </button>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Signup);