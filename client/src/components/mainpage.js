import React from 'react';
import { connect } from 'react-redux';
import Actions from '../actions/actions';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';

import Profile from './main-content/profile';
import Leagues from './main-content/leagues';
import NewLeague from './main-content/new-league';
import Invites from './main-content/invites';

import classnames from 'classnames';

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(Actions.logout()),
  goTo: (path) => () => {
    dispatch(push(path));
  }
});

const renderContent = ({ pathname }) => {
  let component;
  switch(pathname){
    case '/profile':
      component = <Profile/>
      break;
    case '/leagues':
      component = <Leagues/>
      break;
    case '/newleague':
      component = <NewLeague/>
      break;
    case '/invites':
      component = <Invites/>
      break;
    default:
      return null;
  }
  return (<div className='main-content'>{ component }</div>);
};

const renderSidebar = ({ pathname }, goTo) => {

  const classes = (path) => classnames('sidebar-link', {
    'selected': path === pathname
  });

  const sidebarLink = (path, label) => (
    <a onClick={ goTo(path) } className={ classes(path) }>{ label }</a>
  );

  return (
    <div className='sidebar'>
      { sidebarLink('/profile', 'Profile') }
      { sidebarLink('/leagues', 'Leagues') }
      { sidebarLink('/newleague', 'New League') }
      { sidebarLink('/invites', 'Invites') }
    </div>
  );
};

const MainPage = ({ logout, location, goTo }) => (
  <div className='container'>
    <div className='header'>
      <div className='header-right'>
        <button onClick={ goTo('/') } className='header-badge'>home</button>
        <button onClick={ logout } className='header-badge'>logout</button>
      </div>
    </div>
    <div className='content'>
      { renderSidebar(location, goTo) }
      { renderContent(location) }
    </div>
    <div className='footer'>
    </div>
  </div>
);

export default withRouter(connect(null, mapDispatchToProps)(MainPage));