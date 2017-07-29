import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';

const mapStateToProps = (state) => ({
  loading: state.leagues.loading,
  error: state.leagues.error,
  leagues: state.leagues.leagues,
  token: state.auth.token
});

const mapDispatchToProps = (dispatch) => ({
  getLeagues: (token) => dispatch(Actions.getLeagues(token))
})

class Leagues extends React.Component{

  componentWillMount(){
    const { token, getLeagues } = this.props;
    getLeagues(token);

  }

  render(){
    const { loading, error, leagues } = this.props;

    if(loading){
      return (<h1> loading... </h1>);
    }
    if(error){
      return (<h1>{ error }</h1>);
    }
    return (<div>{ JSON.stringify(leagues) }</div>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Leagues);