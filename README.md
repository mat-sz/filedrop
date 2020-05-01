# filedrop-web

Easy WebRTC file transfer. [CLI tool is available here.](https://github.com/mat-sz/droplol)

<p align="center">
    <a href="https://drop.lol/">
        <strong>Click here to open drop.lol.</strong>
    </a>
</p>

<p align="center">
    <a href="https://drop.lol/">
        <img src="https://raw.githubusercontent.com/mat-sz/filedrop-web/master/filedrop.gif" alt="Screenshot">
    </a>
</p>

## Self-hosting

A docker-compose configuration is available in the [filedrop-docker](https://github.com/mat-sz/filedrop-docker) repository.

Installation can be achieved without Docker as well:

> First you need to clone, build and run [filedrop-ws](https://github.com/mat-sz/filedrop-ws) and a TURN server (like [coturn](https://github.com/coturn/coturn)), read the README in filedrop-ws for more information on configuration.
>
> Then you need to clone this project, point it to the WebSockets backend (filedrop-ws) (in .env.local), build it and place it on some static file server (I use nginx for that). I also use nginx to proxy the back end through it. [Here's a guide on how to achieve that.](https://www.nginx.com/blog/websocket-nginx/)

### Environment variables

The following variables are used in the build process:

| Variable                       | Default value             | Description                                                                 |
| ------------------------------ | ------------------------- | --------------------------------------------------------------------------- |
| `REACT_APP_TITLE`              | `filedrop`                | Application title.                                                          |
| `REACT_APP_SERVER`             | `ws://[hostname]:5000/ws` | WebSockets server location.                                                 |
| `REACT_APP_USE_BROWSER_ROUTER` | `0`                       | `1` if you want the application to use BrowserRouter instead of HashRouter. |
| `REACT_APP_ABUSE_EMAIL`        | null                      | E-mail to show in the Abuse section.                                        |
| `REACT_APP_SHOW_CLI_TOOL_INFO` | `0`                       | `1` if you want to link to [droplol](https://github.com/mat-sz/droplol).    |

## FAQ

### What is the motivation behind the project?

I didn't feel comfortable logging into my e-mail account on devices I don't own just to download an attachment and cloud services have extremely long URLs that aren't really easy to type.

### Where do my files go after I send them through the service?

To the other device. Sometimes the (encrypted, since WebRTC uses encryption by default) data goes through the TURN server I run. It's immediately discarded after being relayed. File metadata also is not saved.

### Doesn't this exist already?

While [ShareDrop](https://github.com/cowbell/sharedrop) and [SnapDrop](https://github.com/RobinLinus/snapdrop) are both excellent projects and most definitely exist, I felt the need to create my own version for a several reasons:

- I wanted to build something using React.js and TypeScript.
- ShareDrop doesn't work when the devices are on different networks but still behind NAT.
- I didn't like the layout and design of both, I feel like the abstract design of FileDrop makes it easier to use.
- I was not aware of these projects while I started working on this project.
- ShareDrop's URLs are extremely long.

### How is it related to the other projects you've mentioned?

I don't use PeerJS (while the other two projects do) and I also host TURN and WebSocket servers myself (instead of relying on Firebase). Sometimes you may get connected to Google's STUN server (always if a TURN server is not provided in the configuration).
