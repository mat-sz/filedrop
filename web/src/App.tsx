import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { useTranslation } from 'react-i18not';

import './App.scss';

import { Home } from './screens/Home.js';
import { Redirect } from './screens/Redirect.js';
import { Privacy } from './screens/Privacy.js';
import { ToS } from './screens/ToS.js';
import { Abuse } from './screens/Abuse.js';
import { About } from './screens/About.js';
import { TechnicalInformation } from './screens/TechnicalInformation.js';
import { Header } from './components/Header.js';
import { Status } from './components/Status.js';

export const App: React.FC = () => {
  const { dir } = useTranslation();
  document.body.dir = dir;

  return (
    <div className="app">
      <Header />
      <Status />
      <Router>
        <Switch>
          <Route path="/abuse">
            <Abuse />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/privacy">
            <Privacy />
          </Route>
          <Route path="/tos">
            <ToS />
          </Route>
          <Route path="/tech">
            <TechnicalInformation />
          </Route>
          <Route path="/:networkName">
            <Home />
          </Route>
          <Route>
            <Redirect />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
