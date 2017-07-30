import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';
import LeagueView from './league-view';
import { Route } from 'react-router';

const mapStateToProps = (state) => ({
  loading: state.leagues.loading,
  error: state.leagues.error,
  leagues: state.leagues.leagues,
  token: state.auth.token,
  me: state.auth.username
});

const mapDispatchToProps = (dispatch) => ({
  getLeagues: (token) => dispatch(Actions.getLeagues(token))
})

class Leagues extends React.Component{

  componentWillMount(){
    const { token, getLeagues } = this.props;
    getLeagues(token);

  }

  generateRoutes(leagues){
    return leagues.map(({ _id, name, creator }) => {
      return (<Route path={ _id.toString() } key={ _id } render={ () => <LeagueView name={ name }/> }/>);
    });
  }

  listLeagues(leagues){
    return (<div>{ JSON.stringify(leagues) }</div>);
  }

  render(){
    const { loading, error, leagues } = this.props;

    if(loading){
      return (<h1> loading... </h1>);
    }
    if(error){
      return (<h1>{ error }</h1>);
    }
    return (
      <div>
        { this.generateRoutes(leagues) }
        { this.listLeagues(leagues) }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Leagues);