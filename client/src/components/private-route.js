import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

const mapStateToProps = (state) => ({
  auth: state.auth.status
});

const mapDispatchToProps = (dispatch) => ({
  toLogin: () => dispatch(push('/login'))
});

const PrivateRoute = ({ auth, toLogin, component: Component, ...rest }) => (
  <Route { ...rest } render={(props) => {
    if(auth === 'TRUE'){
      return (<div> <Component/> </div>)
    }
    else
      return (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      );
  }}/>
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute));