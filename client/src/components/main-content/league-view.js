import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';
import Expandable from '../general/expandable';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  league: state.league.league,
  error: state.league.error,
  loading: state.league.loading,
  username: state.auth.username
});

const mapDispatchToProps = (dispatch) => ({
  getLeague: (token, leagueID) => dispatch(Actions.getLeague(token, leagueID))
});

class LeagueView extends React.Component{

  constructor(){
    super();
    this.state = { membersExp: false, inviteExp: false, contentExp: false };
    this.toggleFn = this.toggleFn.bind(this);
  }

  componentDidMount(){
    this.props.getLeague(this.props.token, this.props.match.params.leagueID);
  }

  toggleFn(field){
    return () => {
      const update = {};
      update[field] = !this.state[field];
      this.setState(update);
    };
  }

  render(){
    const { loading, error, league, username } = this.props;
    const isCreator = ( league.creator === username);
    if(loading)
      return (<h1>loading...</h1>);
    if(error)
      return (<h1>{ error }</h1>);
    return (
      <div className='league-view-container'>
        { isCreator &&
          /* only display invites widget if the person is the league creator */
          <Expandable
            toggleFn={ this.toggleFn('inviteExp') }
            expanded={ this.state.inviteExp }
            label='League Invites'
          >
            <h1>invites</h1>
          </Expandable>
        }
        <Expandable
          toggleFn={ this.toggleFn('membersExp') }
          expanded={ this.state.membersExp }
          label='League Members'
        >
          <h1>members</h1>
        </Expandable>

        <Expandable
          toggleFn={ this.toggleFn('contentExp') }
          expanded={ this.state.contentExp }
          label='League Content'
        >
          <h1>content</h1>
        </Expandable>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueView);