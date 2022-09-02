import React from 'react';
import { Link } from 'react-router-dom';
import { abuseEmail } from '../config';

const Abuse: React.FC = () => {
  if (!abuseEmail) return null;

  return (
    <section>
      <div className="subsection left">
        <h2>Report Abuse</h2>
        <p className="bold">
          Follow the instructions below, if:
          <ul>
            <li>
              you've witnessed usage that goes against the{' '}
              <Link to="/tos">Terms of Service</Link>,
            </li>
            <li>you'd like to submit a DMCA notice.</li>
          </ul>
        </p>
        <p>Send a message to the following e-mail address: {abuseEmail}</p>
      </div>
    </section>
  );
};

export default Abuse;
