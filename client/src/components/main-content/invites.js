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
  getInvites: (token, username) => dispatch(Actions.getInvites(token, username))
});

class Invites extends React.Component{

  constructor(props){
    super(props);
    this.renderInvites = this.renderInvites.bind(this);
  }

  componentDidMount(){
    const { token, username, getInvites } = this.props;
    getInvites(token, username);
  }

  renderInvites(){
    const { invites } = this.props;
    if(!invites.length)
      return (<h1>no invites</h1>);
    return invites.map(({ name, _id }, idx) => (
      <tr>
        <td className='title'>{ name }</td>
        <td className='table-right-buttons'>
          <button className='table-button'>accept</button>
          <button className='table-button'>reject</button>
        </td>
      </tr>
    ));
  }

  render(){
    const { invites, error, loading } = this.props;
    if(loading)
      return (<h1>loading...</h1>);
    if(error)
      return(<h1>{ error }</h1>);
    else
      return (
        <table className='full-list'>
          <tbody className='full-list-body'>
            { this.renderInvites() }
          </tbody>
        </table>
      );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Invites);