import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { TextSection } from '../components/TextSection';
import { applicationStore } from '../stores';

export const Abuse: React.FC = observer(() => {
  const abuseEmail = applicationStore.abuseEmail;

  if (!abuseEmail) {
    return null;
  }

  return (
    <TextSection>
      <h2>Report Abuse</h2>
      <p>
        <strong>Follow the instructions below, if:</strong>
      </p>
      <ul>
        <li>
          you've witnessed usage that goes against the{' '}
          <Link to="/tos">Terms of Service</Link>,
        </li>
        <li>you'd like to submit a DMCA notice.</li>
      </ul>
      <p>Send a message to the following e-mail address: {abuseEmail}</p>
    </TextSection>
  );
});
