import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/actions';

const mapStateToProps = (state) => ({
  token: state.auth.token
});

const mapDispatchToProps = (dispatch) => ({
  newLeague: (token, leagueName, errorCb) =>
    dispatch(Actions.newLeague(token, leagueName, errorCb))
});

class NewLeague extends React.Component{

  constructor(){
    super();
    this.state = { leagueName: '', error: '' };
    this.updateName = this.updateName.bind(this);
    this.renderError = this.renderError.bind(this);
    this.errorCb = this.errorCb.bind(this);
    this.submit = this.submit.bind(this);
  }

  errorCb(error){
    this.setState({ error });
  }

  updateName(event){
    this.setState({ leagueName: event.target.value });
  }

  renderError(){
    if(this.state.error)
      return (
        <div className='form-error'>{ this.state.error }</div>
      );
    return null;
  }

  submit(){
    const { token, newLeague } = this.props;
    this.setState({ error: '' });
    newLeague(token, this.state.leagueName, this.errorCb);
  }

  render(){
    return (
      <div className='newleague-form m5'>
        { this.renderError() }
        <div className='form-element b1'>
          <label>new league name</label>
          <input
            onChange={ this.updateName }
            type='text'
            value={ this.state.leagueName }
          />
        </div>
        <div className='form-submit'>
          <button onClick={ this.submit }>create</button>
        </div>
      </div>
    );
  }

};

export default connect(mapStateToProps, mapDispatchToProps)(NewLeague);