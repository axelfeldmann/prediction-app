import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  invites: state.invites.invites,
  loading: state.invites.loading,
  loadError: state.invites.error,
  username: state.auth.username
});

const mapDispatchToProps = (dispatch) => ({
  getInvites: (token, username) => dispatch(Actions.getInvites(token, username)),
  accept: (token, leagueID, errorCb) => dispatch(Actions.accept(token, leagueID, errorCb)),
  reject: (token, leagueID, errorCb) => dispatch(Actions.reject(token, leagueID, errorCb))
});

class Invites extends React.Component{

  constructor(props){
    super(props);
    this.renderInvites = this.renderInvites.bind(this);
    this.errorCb = this.errorCb.bind(this);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
    this.state = { respondError : '' };
  }

  errorCb(message){
    this.setState({ respondError: message });
  }

  componentDidMount(){
    const { token, username, getInvites } = this.props;
    getInvites(token, username);
  }

  accept(leagueID){
    return () => {
      this.setState({ respondError: '' });
      const { token, accept } = this.props;
      accept(token, leagueID, this.errorCb);
    };
  }

  reject(leagueID){
    return () => {
      this.setState({ respondError: '' });
      const { token, reject } = this.props;
      reject(token, leagueID, this.errorCb);
    };
  }

  renderInvites(){
    const { invites } = this.props;
    return invites.map(({ name, _id }, idx) => (
      <tr key={ idx }>
        <td className='title'>{ name }</td>
        <td className='table-right-buttons'>
          <button
            className='table-button'
            onClick={ this.accept(_id) }>
            accept
          </button>
          <button
            className='table-button'
            onClick={ this.reject(_id) }>
            reject
          </button>
        </td>
      </tr>
    ));
  }

  render(){
    const { loadError, loading, invites } = this.props;
    if(loading)
      return (<h1>loading...</h1>);
    if(loadError)
      return(<h1>{ loadError }</h1>);
        else
      return (
        <div className='invites'>
          { this.state.respondError ? (<div className='form-error'>{ this.state.respondError }</div>) : null }
          { !invites.length ? (<div className='form-error'>no invites</div>) : null }
          <table className='full-list'>
            <tbody className='full-list-body'>
              { this.renderInvites() }
            </tbody>
          </table>
        </div>
      );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Invites);