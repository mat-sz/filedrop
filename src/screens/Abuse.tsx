import React from 'react';
import { Link } from 'react-router-dom';
import { abuseEmail } from '../config';

const Abuse: React.FC = () => {
  if (!abuseEmail) return null;

  return (
    <section>
      <h2>Report Abuse</h2>
      <div className="subsection left">
        <p className="bold">
          Are you aware of a breach of our{' '}
          <Link to="/tos">Terms of Service</Link>? Would you like to send a DMCA
          takedown request? Please follow the instructions below.
        </p>
        <p>Send me an e-mail directly at: {abuseEmail}</p>
      </div>
    </section>
  );
};

export default Abuse;
