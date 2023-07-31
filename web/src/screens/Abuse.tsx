import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StateType } from '../reducers';

const Abuse: React.FC = () => {
  const abuseEmail = useSelector((state: StateType) => state.abuseEmail);

  if (!abuseEmail) {
    return null;
  }

  return (
    <section>
      <div className="subsection left">
        <h2>Report Abuse</h2>
        <p className="bold">Follow the instructions below, if:</p>
        <ul>
          <li>
            you've witnessed usage that goes against the{' '}
            <Link to="/tos">Terms of Service</Link>,
          </li>
          <li>you'd like to submit a DMCA notice.</li>
        </ul>
        <p>Send a message to the following e-mail address: {abuseEmail}</p>
      </div>
    </section>
  );
};

export default Abuse;
