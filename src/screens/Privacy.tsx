import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="section center text">
            <h1>Privacy Policy</h1>
            <p>
                The following user data is processed by the service:
            </p>
            <ul>
                <li>file name, file type and file size</li>
                <li>WebRTC data such as: ICE candidate descriptions and WebRTC offers/answers</li>
                <li>the IP address of the user</li>
            </ul>
            <p>
                None of the above are stored by the service in any way, once the user's connection with the service is over (WebSockets connection closed) all the temporarily stored (in RAM) data is irrecoverably removed.
            </p>
            <p>
                In some edge cases (both the receiving and sending device being behind NAT) the binary file data may be sent over the service's TURN servers. The data is not stored in any way. The data is also not being processed in any other way than just being sent to the target device.
            </p>
        </div>
    );
}

export default Privacy;
