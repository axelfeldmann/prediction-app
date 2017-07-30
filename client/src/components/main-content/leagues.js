import React from 'react';
import LeagueView from './league-view';
import LeagueList from './league-list';
import { Route } from 'react-router';

const Leagues = () => (
  <div>
    <Route exact path='/leagues/' component={ LeagueList }/>
    <Route path='/leagues/:leagueID' component={ LeagueView }/>
  </div>
);

export default Leagues;