import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';
import Expandable from '../general/expandable';
import isEmpty from 'lodash/isEmpty'

const mapStateToProps = (state) => ({
  token: state.auth.token,
  league: state.league.league,
  error: state.league.error,
  loading: state.league.loading,
  username: state.auth.username,
  inviteesLoading: state.league.inviteesLoading
});

const mapDispatchToProps = (dispatch) => ({
  getLeague: (token, leagueID) => dispatch(Actions.getLeague(token, leagueID)),
  sendInvite: (token, leagueID, invitee, errorCb) =>
    dispatch(Actions.sendInvite(token, leagueID, invitee, errorCb)),
  remove: (token, leagueID, target, successCb) =>
    dispatch(Actions.remove(token, leagueID, target, successCb))
});

class LeagueView extends React.Component{

  constructor(){
    super();
    this.state = {
      membersExp: false,
      inviteExp: false,
      contentExp: false,
      error: '',
      invitee: ''
    };
    this.toggleFn = this.toggleFn.bind(this);
    this.renderInvites = this.renderInvites.bind(this);
    this.updateInvitee = this.updateInvitee.bind(this);
    this.submit = this.submit.bind(this);
    this.errorCb = this.errorCb.bind(this);
    this.renderMembers = this.renderMembers.bind(this);
    this.remove = this.remove.bind(this);
  }

  remove(target){
    const { league, remove, token, getLeague } = this.props;
    remove(token, league._id, target, () => getLeague(token, league._id));
  }

  componentDidMount(){
    this.props.getLeague(this.props.token, this.props.match.params.leagueID);
  }

  toggleFn(field){
    return () => {
      const update = { error: '' };
      update[field] = !this.state[field];
      this.setState(update);
    };
  }

  updateInvitee(event){
    this.setState({ invitee: event.target.value });
  }

  errorCb(message){
    this.setState({ error: message });
  }

  submit(){
    const { token, league, sendInvite } = this.props;
    const { invitee } = this.state;
    this.setState({ error: '', invitee: '' });
    sendInvite(token, league._id, invitee, this.errorCb);
  }

  renderInvites(){
    const invites = this.props.league.invites;
    const loading = this.props.inviteesLoading;
    const { error } = this.state;
    const outstanding = invites.map((invitee, idx) => (
      <tr className='dark-row' key= { idx }>
        <td className='title'>{ invitee }</td>
        <td className='table-right-buttons'>
          <button
            className='table-button'
            onClick={ () => this.remove(invitee) }>
            uninvite
          </button>
        </td>
      </tr>
    ));
    return (
      <div className='invite-form'>
        { error ? <div className='form-error'>{ error }</div> : null }
        <div className='form-element'>
          <label>invite</label>
          <input
            onChange={ this.updateInvitee }
            type='text'
            value={ this.state.invitee }
          />
        </div>
        <div className='form-submit'>
          <button onClick={ this.submit }>create</button>
        </div>
        { (loading) ? (<h1>loading...</h1>) : (
          <table className='full-list mt10'>
            <tbody className='full-list-body'>
              { outstanding }
            </tbody>
          </table>
          ) }
      </div>
    );
  }

  renderMembers(){
    const { creator } = this.props.league;
    const { username } = this.props;
    const members = this.props.league.members.map((m, idx) => (
      <tr key={ idx } className='dark-row'>
        <td className='title'>{ m }</td>
        { (creator !== m && creator === username) && 
        <td className='table-right-buttons'>
          <button
            className='table-button'
            onClick={ () => this.remove(m) }>
            remove
          </button>
        </td>
        }
      </tr>
    ));
    return (
      <table className='full-list'>
        <tbody className='full-list-body'>
          { members }
        </tbody>
      </table>
    );
  }

  render(){
    const { loading, error, league, username } = this.props;
    const isCreator = ( league.creator === username);

    if(loading || isEmpty(league))
      return (<h1>loading...</h1>);

    if(error)
      return (<h1>{ error }</h1>);

    return (
      <div className='league-view-container'>
        <h2>{ league.name }</h2>
        { isCreator &&
          /* only display invites widget if the person is the league creator */
          <Expandable
            toggleFn={ this.toggleFn('inviteExp') }
            expanded={ this.state.inviteExp }
            label='League Invites'
          >
            { this.renderInvites() }
          </Expandable>
        }
        <Expandable
          toggleFn={ this.toggleFn('membersExp') }
          expanded={ this.state.membersExp }
          label='League Members'
        >
          { this.renderMembers() }
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