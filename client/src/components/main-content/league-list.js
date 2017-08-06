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
  pushID: (id) => () => dispatch(push(`/leagues/${id}`)),
  leave: (token, leagueID, target) =>
    dispatch(Actions.leave(token, leagueID, target)),
  setError: (error) => dispatch(Actions.leagueListFailed(error))
});

class LeagueList extends React.Component{

  constructor(props){
    super(props);
    this.leave = this.leave.bind(this);
  }

  componentDidMount(){
    this.props.getLeagueList(this.props.token);
  } 

  renderErrors(){
    let error;
    if(!this.props.leagues)
      error = 'no leagues found';
    if(this.props.error)
      error = this.props.error;

    if(error)
      return (<div className='form-error'>{ error }</div>);
    return null;
  }

  leave(leagueID){
    const { leave, token, username } = this.props;
    leave(token, leagueID, username);
  }

  renderLeagues(){
    const creatorLeagues = [], memberLeagues = [];

    if(!this.props.leagues) return null;

    this.props.leagues.forEach((league, idx) => {
      if(league.creator === this.props.username){
        creatorLeagues.push(
          <tr key={ idx } onClick={ this.props.pushID(league._id) }>
            <td className='title'>{ league.name }</td>
            <td className='right'>{ league.creator }</td>
          </tr>
        );
      } else {
        memberLeagues.push(
          <tr key={ idx }>
            <td className='title' onClick={ this.props.pushID(league._id) }>
              { league.name }
            </td>
            <td className='right' onClick={ this.props.pushID(league._id) }>
              { league.creator }
            </td>
            <td className='table-right-buttons'>
              <button
                className='table-button'
                onClick={ () => this.leave(league._id) }>
                leave
              </button>
            </td>
          </tr>
        );
      }
    });

    const leagueLists = [];
    if(creatorLeagues.length > 0) 
      leagueLists.push(
        <div className='league-list' key={ 0 }>
          <label className='list-label'>Leagues (admin)</label>
          <table className='full-list'>
            <tbody className='full-list-body'>
              { creatorLeagues }
            </tbody>
          </table>
        </div>
      );

    if(memberLeagues.length > 0)
      leagueLists.push(
        <div className='league-list' key={ 1 }>
          <label className='list-label'>Leagues (member)</label>
          <table className='full-list'>
            <tbody className='full-list-body'>
              { memberLeagues }
            </tbody>
          </table>
        </div>
      );

    return leagueLists;
  }

  render(){
    const { loading } = this.props;
    if(loading)
      return (<h1>loading...</h1>);
    return (
      <div className='league-lists'>
        { this.renderErrors() }
        { this.renderLeagues() }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueList);