import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  league: state.league.league,
  error: state.league.error,
  loading: state.league.loading
});

const mapDispatchToProps = (dispatch) => ({
  getLeague: (token, leagueID) => dispatch(Actions.getLeague(token, leagueID))
});

class LeagueView extends React.Component{

  componentDidMount(){
    console.log(this.props);
    this.props.getLeague(this.props.token, this.props.match.params.leagueID);
  }

  render(){
    const { loading, error, league} = this.props;
    if(loading)
      return (<h1>loading...</h1>);
    if(error)
      return (<h1>{ error }</h1>);
    return (<div>{ JSON.stringify(league)}</div>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueView);