import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18not';

import 'react-nano-scrollbar/dist/index.css';
import './App.scss';

import { Router } from './config.js';
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
    <Router>
      <div className="app">
        <Header />
        <Status />
        <Routes>
          <Route path="/abuse" element={<Abuse />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/tos" element={<ToS />} />
          <Route path="/tech" element={<TechnicalInformation />} />
          <Route path="/:networkName" element={<Home />} />
          <Route index element={<Redirect />} />
        </Routes>
      </div>
    </Router>
  );
};
