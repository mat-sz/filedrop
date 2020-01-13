import React from 'react';

const Privacy: React.FC = () => {
    return (
        <section>
            <h2>Privacy Policy</h2>
            <div className="subsection left">
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
                <p>
                    No HTTP cookies will be stored on your device. The application stores the acknowledgement of the "Welcome" notice in local storage, this can't and won't be used to track users.
                </p>
                <p>
                    Your IP address is shared with other users of the service once you accept a transfer or your transfer is accepted. This data is used to create a WebRTC connection.
                </p>
            </div>
        </section>
    );
}

export default Privacy;
