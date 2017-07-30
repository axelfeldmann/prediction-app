import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  leagues: state.leagueList.leagues,
  error: state.leagueList.error,
  loading: state.leagueList.loading
});

const mapDispatchToProps = (dispatch) => ({
  getLeagueList: (token) => dispatch(Actions.getLeagueList(token))
});

class LeagueList extends React.Component{

  componentDidMount(){
    this.props.getLeagueList(this.props.token);
  }

  render(){
    const { loading, error, leagues} = this.props;
    if(loading)
      return (<h1>loading...</h1>);
    if(error)
      return (<h1>{ error }</h1>);
    return (<div>{ JSON.stringify(leagues)}</div>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueList);