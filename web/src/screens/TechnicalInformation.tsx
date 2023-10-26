import React from 'react';
import { observer } from 'mobx-react-lite';

import * as browser from '../utils/browser.js';
import { TextSection } from '../components/TextSection.js';
import { connection } from '../stores/index.js';

export const TechnicalInformation: React.FC = observer(() => {
  const remoteAddress = connection.remoteAddress;

  const info = {
    remoteAddress,
    userAgent: navigator.userAgent,
    ...browser,
  };

  return (
    <TextSection>
      <h2>Technical Information</h2>
      <ul>
        {Object.entries(info).map(([name, value]) => (
          <li key={name}>
            <strong>{name}:</strong> {String(value)}
          </li>
        ))}
      </ul>
    </TextSection>
  );
});

export default TechnicalInformation;
