import React from 'react';

const Privacy: React.FC = () => {
  return (
    <section>
      <div className="subsection left">
        <h2>Privacy Policy</h2>
        <p>The following user data is processed by the service:</p>
        <ul>
          <li>file metadata such as: file name, size and type,</li>
          <li>
            WebRTC data from your browser such as: ICE candidate descriptions
            and WebRTC offers/answers,
          </li>
          <li>your IP address.</li>
        </ul>
        <p>
          None of the above are stored by the service in any way, once the your
          connection to the service is over (WebSockets connection closed) or
          times out all the temporarily stored (in RAM) data is irrecoverably
          removed.
        </p>
        <p>
          For clients that support end-to-end encryption, the WebRTC data and
          file metadata will be encrypted and unknown to the service.
        </p>
        <p>
          In some cases (both the receiving and sending device being behind NAT)
          the binary file data may be sent over the service's TURN servers. The
          data is not stored in any way. The data is also not being processed in
          any other way than just being sent to the target device.
        </p>
        <p>
          No HTTP cookies will be stored on your device. The application stores
          the client name in local storage, this can't and won't be used to
          track users.
        </p>
        <p>
          Your IP address may be shared with the other device involved in the
          file transfer once you accept a transfer or your transfer is accepted.
          This data is used to create a WebRTC connection.
        </p>
      </div>
    </section>
  );
};

export default Privacy;
