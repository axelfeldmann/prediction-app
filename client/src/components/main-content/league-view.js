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
  getLeague: (token, leagueID) => dispatch(Actions.getLeague(token, leagueID)),
  sendInvite: (token, leagueID, invitee, errorCb) =>
    dispatch(Actions.sendInvite(token, leagueID, invitee, errorCb))
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
    const { error } = this.state;
    const outstanding = invites.map((invitee, idx) => (<div key={ idx }>{ invitee }</div>));
    return (
      <div className='invite-form'>
        { error ? <div className='form-error'>{ error }</div> : null }
        <label>invite:</label>
        <input
          onChange={ this.updateInvitee }
          type='text'
          value={ this.state.invitee }
        />
        <div className='form-submit'>
          <button onClick={ this.submit }>create</button>
        </div>
        { outstanding }
      </div>
    );
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