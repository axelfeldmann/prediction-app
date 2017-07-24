import React from 'react';
import Actions from '../actions/actions';
import { connect } from 'react-redux';

class AuthLayer extends React.Component {

  componentWillMount(){
    const token = window.localStorage.getItem('token');
    this.props.dispatch(Actions.checkAuth(token));
  }

  render(){
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

export default connect()(AuthLayer);