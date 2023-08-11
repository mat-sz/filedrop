import React from 'react';
import { Routes, Route } from 'react-router-dom';

import 'react-nano-scrollbar/dist/index.css';
import './App.scss';

import { Router } from './config';
import { Home } from './screens/Home';
import { Redirect } from './screens/Redirect';
import { Privacy } from './screens/Privacy';
import { ToS } from './screens/ToS';
import { Abuse } from './screens/Abuse';
import { About } from './screens/About';
import { TechnicalInformation } from './screens/TechnicalInformation';
import { Header } from './components/Header';
import { Status } from './components/Status';

export const App: React.FC = () => {
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
