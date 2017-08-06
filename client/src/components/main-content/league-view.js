import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';
import Expandable from '../general/expandable';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  league: state.league.league,
  error: state.league.error,
  username: state.auth.username,
  membersLoading: state.league.membersLoading,
  invitesLoading: state.league.invitesLoading,
  loading: state.league.loading
});

const mapDispatchToProps = (dispatch) => ({
  getLeague: (token, leagueID) => dispatch(Actions.getLeague(token, leagueID)),
  sendInvite: (token, leagueID, invitee, errorCb) =>
    dispatch(Actions.sendInvite(token, leagueID, invitee, errorCb)),
  setError: (error) => dispatch(Actions.gotLeagueError(error)),
  uninvite: (token, leagueID, target) => dispatch(Actions.uninvite(token, leagueID, target)),
  kick: (token, leagueID, target) => dispatch(Actions.kick(token, leagueID, target))
});

class LeagueView extends React.Component{

  constructor(){
    super();

    this.state = {
      membersExp: false,
      inviteExp: false,
      invitee: ''
    };

    this.toggleFn = this.toggleFn.bind(this);
    this.renderInvites = this.renderInvites.bind(this);
    this.updateInvitee = this.updateInvitee.bind(this);
    this.submit = this.submit.bind(this);

    this.renderMembers = this.renderMembers.bind(this);
  }

  kick(target){
    const { league, kick, token } = this.props;
    kick(token, league._id, target);
  }

  uninvite(target){
    const { league, uninvite, token } = this.props;
    uninvite(token, league._id, target);
  }

  componentDidMount(){
    this.props.getLeague(this.props.token, this.props.match.params.leagueID);
  }

  toggleFn(field){
    const { setError } = this.props;
    return () => {
      setError('');
      const update = {};
      update[field] = !this.state[field];
      this.setState(update);
    };
  }

  updateInvitee(event){
    this.setState({ invitee: event.target.value });
  }

  submit(){
    const { token, league, sendInvite } = this.props;
    const { invitee } = this.state;
    this.setState({ invitee: '' });
    sendInvite(token, league._id, invitee, this.errorCb);
  }

  renderError(){
    const { error } = this.props;
    if(error)
      return (<div className='form-error'>{ error }</div>);
    else
      return null;
  }

  renderTitle(){
    const { league, loading } = this.props;
    if(league)
      return (<h2 className='league-title'>{ league.name }</h2>);
    else if(loading)
      return (<h2 className='league-title'>loading...</h2>);
    return null;
  }

  renderInvites(){
    const { league, invitesLoading } = this.props;
    if(league && league.isCreator){

      let content;
      //not loading
      if(!invitesLoading && league.invites.length){
        const outstanding = league.invites.map((invitee, idx) => (
          <tr className='dark-row' key= { idx }>
            <td className='title'>{ invitee }</td>
            <td className='table-right-buttons'>
              <button
                className='table-button'
                onClick={ () => this.uninvite(invitee) }>
                uninvite
              </button>
            </td>
          </tr>
        ));
        content = (
          <table className='full-list mt10'>
            <tbody className='full-list-body'>
              { outstanding }
            </tbody>
          </table>
        );
      } else if(!invitesLoading) {
        content = null;
      } else {
        content = (<h1>loading...</h1>);
      }

      return(
        <Expandable
          toggleFn={ this.toggleFn('inviteExp') }
          expanded={ this.state.inviteExp }
          label='Invites'
        >
          <div className='invite-form'>
            <div className='form-element'>
              <label>invite</label>
              <input
                onChange={ this.updateInvitee }
                type='text'
                value={ this.state.invitee }
              />
            </div>
            <div className='form-submit'>
              <button onClick={ this.submit }>invite</button>
            </div>
            { content }
          </div>
        </Expandable>
      );      
    }
    return null;
  }

  renderMembers(){
    const { league, username, membersLoading } = this.props;
    if(league){

      let content;
      if(league.members && !membersLoading){

        const members = league.members.map((m, idx) => (
          <tr key={ idx } className='dark-row'>
            <td className='title'>{ m }</td>
            { (username !== m && league.isCreator) && 
            <td className='table-right-buttons'>
              <button
                className='table-button'
                onClick={ () => this.kick(m) }>
                kick
              </button>
            </td>
            }
          </tr>
        ));
        content = (
          <table className='full-list'>
            <tbody className='full-list-body'>
              { members }
            </tbody>
          </table>
        );

      } else {
        content = (<h1>loading...</h1>);
      }

      return(
        <Expandable
          toggleFn={ this.toggleFn('membersExp') }
          expanded={ this.state.membersExp }
          label='League Members'
        >
          { content }
        </Expandable>
      );
    }
    return null;

  }

  renderContent(){
    const { league } = this.props;
    if(league)
      return (
        <div className='league-content'>
          content
        </div>
      );
    else
      return null; 
  }

  render(){
    return (
      <div className='league-view-container'>
        { this.renderTitle() }
        { this.renderError() }
        { this.renderInvites() }
        { this.renderMembers() }
        { this.renderContent() }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueView);