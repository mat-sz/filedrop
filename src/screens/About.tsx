import React from 'react';
import { Link } from 'react-router-dom';

import { title } from '../config';

const About: React.FC = () => {
  return (
    <section>
      <div className="subsection left">
        <h2>Welcome</h2>
        <p>Welcome to {title}! Let me explain what this website is.</p>
        <p>
          This website allows you to copy files over the network (LAN if both
          devices are on the same local network and support WebRTC, otherwise
          the traffic goes through a TURN relay). Originally I've created this
          project to avoid logging into my e-mail on computers I don't own or
          having to type long URLs by hand. I hope it is as useful for you as it
          is for me. :)
        </p>
        <p>
          You can start a file transfer in a few easy steps:
          <ol>
            <li>Open this website on one device (you're here right now!)</li>
            <li>
              Scan the QR code or open the URL from the "Invite" section on
              another device.
            </li>
            <li>
              Drag and drop your files onto a tile (any tile that isn't marked
              as "You", you can also click on a tile to open a file selection
              dialog).
            </li>
            <li>Accept the transfer on another device.</li>
          </ol>
        </p>
        <p>
          {title} is open source! The code lives on GitHub:{' '}
          <a href="https://github.com/mat-sz/filedrop-web">front end</a> and{' '}
          <a href="https://github.com/mat-sz/filedrop-ws">back end</a>. If you
          enjoy using the website please consider giving these projects a star.
          You can also report issues there or help the project by creating a
          pull request.
        </p>
        <p>
          By interacting with the service you accept our{' '}
          <Link to="/privacy">Privacy Policy</Link> and{' '}
          <Link to="/tos">Terms of Service</Link>.
        </p>
      </div>
    </section>
  );
};

export default About;
