# FAQ

## What is the motivation behind the project?

I didn't feel comfortable logging into my e-mail account on devices I don't own just to download an attachment and cloud services have extremely long URLs that aren't really easy to type.

## Where do my files go after I send them through the service?

To the other device. Sometimes the (encrypted, since WebRTC uses encryption by default) data goes through the TURN server I run. It's immediately discarded after being relayed. File metadata also is not saved.

## Doesn't this exist already?

While [ShareDrop](https://github.com/cowbell/sharedrop) and [SnapDrop](https://github.com/RobinLinus/snapdrop) are both excellent projects and most definitely exist, I felt the need to create my own version for a several reasons:

- I wanted to build something using React.js and TypeScript.
- ShareDrop doesn't work when the devices are on different networks but still behind NAT.
- I didn't like the layout and design of both, I feel like the abstract design of FileDrop makes it easier to use.
- I was not aware of these projects while I started working on this project.
- ShareDrop's URLs are extremely long.

## How is it related to the other projects you've mentioned?

I don't use PeerJS (while the other two projects do) and I also host TURN and WebSocket servers myself (instead of relying on Firebase). Sometimes you may get connected to Google's STUN server (always if a TURN server is not provided in the configuration).
