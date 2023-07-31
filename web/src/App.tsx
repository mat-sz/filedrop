import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import 'react-nano-scrollbar/dist/index.css';
import './App.scss';

import { Router } from './config';
import { StateType } from './reducers';
import { Home } from './screens/Home';
import { Transfers } from './screens/Transfers';
import { Privacy } from './screens/Privacy';
import { ToS } from './screens/ToS';
import { Abuse } from './screens/Abuse';
import { About } from './screens/About';
import { TechnicalInformation } from './screens/TechnicalInformation';
import { Header } from './components/Header';
import { Status } from './components/Status';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const abuseEmail = useSelector((state: StateType) => state.abuseEmail);

  return (
    <Router>
      <div className="app">
        <Header />
        <Status />
        <Routes>
          {abuseEmail && <Route path="/abuse" element={<Abuse />} />}
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/tos" element={<ToS />} />
          <Route path="/tech" element={<TechnicalInformation />} />
          <Route path="/:networkName" element={<Transfers />} />
          <Route index element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};
