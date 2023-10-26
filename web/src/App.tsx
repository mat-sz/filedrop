import React, { Suspense } from 'react';
import { Router, Route, Switch } from 'wouter';
import { useTranslation } from 'react-i18not';

import './App.scss';

import { Home } from './screens/Home.js';
import { Redirect } from './screens/Redirect.js';
import { Header } from './components/Header.js';
import { Status } from './components/Status.js';

const Abuse = React.lazy(() => import('./screens/Abuse.js'));
const TechnicalInformation = React.lazy(
  () => import('./screens/TechnicalInformation.js')
);
const ToS = React.lazy(() => import('./screens/ToS.js'));
const Privacy = React.lazy(() => import('./screens/Privacy.js'));
const About = React.lazy(() => import('./screens/About.js'));

export const App: React.FC = () => {
  const { dir } = useTranslation();
  document.body.dir = dir;

  return (
    <div className="app">
      <Header />
      <Status />
      <Suspense>
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
      </Suspense>
    </div>
  );
};
