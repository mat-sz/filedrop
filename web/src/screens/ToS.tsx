import React from 'react';

const ToS: React.FC = () => {
  return (
    <section>
      <div className="subsection left">
        <h2>Terms of Service</h2>
        <p className="bold">
          By using the service (usage is understood by, but not limited to,
          accepting the "Welcome" notice, transferring files, connecting to the
          TURN server provided by the service, connecting to the STUN server
          provided by the service, connecting to the WebSocket server provided
          by the service and/or multiple visits by the end user) you are
          accepting the following Terms of Service.
        </p>
        <p>
          The software and the service are provided "as is" and any express or
          implied warranties, including, but not limited to, the implied
          warranties of merchantability and fitness for a particular purpose are
          disclaimed. In no event shall the service owner be lieable for any
          direct, indirect, incidental, special, exemplary, or consequential
          damages (including, but not limited to, procurement of substitute
          goods or services; loss of use, data, or profits; or business
          interruption) however caused and on any theory of liability, whether
          in contract, strict liability, or tort (including negligence or
          otherwise) arising in any way out of the use of this service, even if
          advised of the possibility of such damage.
        </p>
        <ol>
          <li>
            By accessing the service you are agreeing to be bound by these Terms
            of Service.
          </li>
          <li>
            Terms of Service are subject to change without prior notice. By
            continuing the use of the service you are agreeing to be bound by
            the current revision of these terms.
          </li>
          <li>
            Your access to this service may be terminated without prior notice
            for any reason (including no reason being given).
          </li>
          <li>
            The service's intention is providing you with a way to transfer
            small files (excluding files prohibited by the Terms of Service)
            between devices over your local network or via the provided TURN
            server.
          </li>
          <li>
            Actions that will result in a termination of your access to the
            service include, but are not limited to:
            <ul>
              <li>
                using the service to perform illegal activities, especially
                those considered illegal by the law of the United States,
                France, Germany, Poland or the European Union,
              </li>
              <li>
                using the service to perform acts prohibited by international
                law,
              </li>
              <li>using the service to perform fraud,</li>
              <li>
                using the service to transfer copyrighted or pornographic
                material,
              </li>
              <li>using the service to transfer excessive amounts of data,</li>
              <li>using the service to distribute malware,</li>
              <li>
                using the service's TURN server for activities unrelated to the
                normal functioning of the service,
              </li>
              <li>
                trying to exploit and/or exploiting vulnerabilities in the
                service.
              </li>
            </ul>
          </li>
          <li>
            The service does not store any user data on the servers. WebRTC
            connections are end-to-end encrypted according to the WebRTC
            specification and no actions will be taken by the service to decrypt
            the contents (in case of the packets being relayed by the service's
            TURN servers). Metadata related to file transfers (such as file
            name, file size and file type) is not permanently stored and is
            removed from the server's memory after the transfer is complete.
          </li>
          <li>
            No cookies will be stored on your device. Every session uses a newly
            generated client identifier which will be destroyed once the session
            is over and will not be used to track the user.
          </li>
          <li>
            The service is provided free of charge and no warranty is given. The
            service's provider is not liable for any damage caused by the usage
            of the service.
          </li>
          <li>
            The service's owner reserves the right to take the service down for
            any reason (including no reason being given) temporarily and/or
            permanently. The service's owner is not obligated to continue
            providing the service.
          </li>
        </ol>
      </div>
    </section>
  );
};

export default ToS;
