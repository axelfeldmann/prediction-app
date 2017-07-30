import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';
import { push } from 'react-router-redux';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  leagues: state.leagueList.leagues,
  error: state.leagueList.error,
  loading: state.leagueList.loading,
  username: state.auth.username
});

const mapDispatchToProps = (dispatch) => ({
  getLeagueList: (token) => dispatch(Actions.getLeagueList(token)),
  push: (id) => () => dispatch(push(`/leagues/${id}`))
});

class LeagueList extends React.Component{

  componentDidMount(){
    this.props.getLeagueList(this.props.token);
  }

  renderLeagues(){
    const creatorLeagues = [], memberLeagues = [];
    this.props.leagues.forEach((league, idx) => {
      if(league.creator === this.props.username){
        creatorLeagues.push(
          <tr key={ idx } onClick={ this.props.push(league._id) }>
            <td className='title'>{ league.name }</td>
            <td className='right'>{ league.creator }</td>
          </tr>
        );
      } else {
        memberLeagues.push(
          <tr key={ idx } onClick={ this.props.push(league._id) }>
            <td className='title'>{ league.name }</td>
            <td className='right'>{ league.creator }</td>
          </tr>
        );
      }
    });

    return (
      <div className='league-lists'>
        { (creatorLeagues.length > 0) && (
          <div className='league-list'>
            <label className='list-label'>Leagues (admin)</label>
            <table><tbody className='full-list'>{ creatorLeagues }</tbody></table>
          </div>
          ) }
        { (memberLeagues.length > 0) && (
          <div className='league-list'>
            <label className='list-label'>Leagues (member)</label>
            <table><tbody className='full-list'>{ memberLeagues }</tbody></table>
          </div>
          ) }
      </div>
    );
  }

  render(){
    const { loading, error } = this.props;
    if(loading)
      return (<h1>loading...</h1>);
    if(error)
      return (<h1>{ error }</h1>);
    return this.renderLeagues();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueList);