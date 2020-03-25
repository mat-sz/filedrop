import React from 'react';

const IncompatibleBrowser: React.FC = () => {
  return (
    <>
      <h2>Incompatible browser</h2>
      <div className="subsection warning">
        <p>
          Your browser does not support the technologies required for the app to
          work. You can still try to use the app, but it's not guaranteed it'll
          work.
        </p>
      </div>
    </>
  );
};

export default IncompatibleBrowser;
