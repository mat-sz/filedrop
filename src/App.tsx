import React from 'react';
import { Routes, Route } from 'react-router-dom';

import 'react-nano-scrollbar/dist/index.css';
import './App.scss';

import Home from './screens/Home';
import Transfers from './screens/Transfers';
import Privacy from './screens/Privacy';
import ToS from './screens/ToS';
import Abuse from './screens/Abuse';
import About from './screens/About';
import TechnicalInformation from './screens/TechnicalInformation';
import Header from './components/Header';
import Status from './components/Status';
import Footer from './components/Footer';
import { Router, abuseEmail } from './config';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <div className="background">
          <div className="color-1"></div>
          <div className="color-2"></div>
          <div className="color-3"></div>
        </div>
        <Header />
        <Status />
        <Routes>
          {abuseEmail ? <Route path="/abuse" element={<Abuse />} /> : null}
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

export default App;
