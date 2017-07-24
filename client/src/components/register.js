import React from 'react';
import Actions from '../actions/actions';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch) => ({
  register: (username, password) => () => 
    dispatch(Actions.register(username, password))
});

class Register extends React.Component {
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
        <h3>register</h3>
        username
        <input onChange={ this.updateUsername } type='text' value={ this.state.username }/>
        password
        <input onChange={ this.updatePassword } type='text' value={ this.state.password }/>
        <button onClick={ this.props.register(this.state.username, this.state.password) }> register </button>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Register);