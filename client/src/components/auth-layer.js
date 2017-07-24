import React from 'react';
import Actions from '../actions/actions';

class AuthLayer extends React.Component {

  componentWillMount(){
    const token = window.localStorage.getItem('token');
    Actions.checkAuth(token);
  }

  render(){
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

export default AuthLayer;