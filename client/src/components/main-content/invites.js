import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';

const mapStateToProps = (state) => ({
  token: state.auth.token,
  invites: state.invites.invites,
  loading: state.invites.loading,
  error: state.invites.error,
  username: state.auth.username
});

const mapDispatchToProps = (dispatch) => ({
  getInvites: (token, username) => dispatch(Actions.getInvites(token, username)),
  accept: (token, leagueID) => dispatch(Actions.accept(token, leagueID)),
  reject: (token, leagueID) => dispatch(Actions.reject(token, leagueID))
});

class Invites extends React.Component{

  constructor(props){
    super(props);
    this.renderInvites = this.renderInvites.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
  }

  componentDidMount(){
    const { token, username, getInvites } = this.props;
    getInvites(token, username);
  }

  accept(leagueID){
    return () => {
      const { token, accept } = this.props;
      accept(token, leagueID);
    };
  }

  reject(leagueID){
    return () => {
      const { token, reject } = this.props;
      reject(token, leagueID);
    };
  }

  renderErrors(){
    let error;

    if(!this.props.invites.length)
      error = 'no invites';

    if(this.props.error)
      error = this.props.error;

    if(error)
      return (<div className='form-error'>{ error }</div>);
    return null;
  }

  renderInvites(){
    const { invites } = this.props;

    if(!invites) return null;

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
    const { loading } = this.props;
    if(loading)
      return (<h1>loading...</h1>);
    else
      return (
        <div className='invites'>
          { this.renderErrors() }
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