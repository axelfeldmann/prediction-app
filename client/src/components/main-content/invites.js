import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  invites: state.invites.invites,
  loading: state.invites.loading,
  error: state.invites.error,
  username: state.auth.username
});

const mapDispatchToProps = (dispatch) => ({
  getInvites: (token, username) => dispatch(Actions.getInvites(token, username))
});

class Invites extends React.Component{

  componentDidMount(){
    const { token, username, getInvites } = this.props;
    getInvites(token, username);
  }

  render(){
    const { invites, error, loading } = this.props;
    if(loading)
      return (<h1>loading...</h1>);
    if(error)
      return(<h1>{ error }</h1>);
    else
      return (<div>{ JSON.stringify(invites) }</div>)
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Invites);