import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GithubCorner from 'react-github-corner';

import 'react-perfect-scrollbar/dist/css/styles.css';
import 'rc-tooltip/assets/bootstrap_white.css';
import './App.scss';

import Header from './components/Header';
import Home from './screens/Home';
import Transfers from './screens/Transfers';
import Privacy from './screens/Privacy';
import ToS from './screens/ToS';
import Abuse from './screens/Abuse';
import Status from './components/Status';
import { Router, abuseEmail } from './config';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <div className="line"></div>
        <GithubCorner
          href="https://github.com/mat-sz/filedrop-web"
          octoColor="#111"
          bannerColor="#ff6f06"
        />
        <Header />
        <Status />
        <Routes>
          {abuseEmail ? <Route path="/abuse" element={<Abuse />} /> : null}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/tos" element={<ToS />} />
          <Route path="/:networkName" element={<Transfers />} />
          <Route index element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
