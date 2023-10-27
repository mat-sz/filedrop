# filedrop

Easy peer-to-peer file transfer.

<p align="center">
    <a href="https://drop.lol/">
        <strong>Click here to open drop.lol.</strong>
    </a>
</p>

<p align="center">
    <a href="https://drop.lol/">
        <img src="https://raw.githubusercontent.com/mat-sz/filedrop/master/filedrop.gif" alt="Screenshot">
    </a>
</p>

## Self-hosting

### Docker

#### Requirements

- docker
- docker-compose
- bash
- openssl
- git

#### Installation

1. Ensure that your user is in the `docker` group.
1. Run the following commands in terminal:
   1. `git clone https://github.com/mat-sz/filedrop`
   2. `chmod +x ./docker-start.sh`
   3. `./docker-start.sh`

TURN uses TCP port 3478 and UDP ports 49152-65535.

#### docker-start.sh arguments

| Option       | Description                                     |
| ------------ | ----------------------------------------------- |
| `-n <name>`  | Sets application name.                          |
| `-e <email>` | Sets contact email.                             |
| `-p <port>`  | Sets port for the application to be exposed at. |
| `-f`         | Enables WS_USE_X_FORWARDED_FOR.                 |
| `-s`         | Enables WS_REQUIRE_CRYPTO.                      |

### Manual

#### Requirements

- TURN server, ideally with HMAC authentication, example: [coturn](https://github.com/coturn/coturn)
- node.js 18.x.x, 20+
- git

#### Installation

1. Set up and configure your TURN server and note down the secret for next steps.
2. Run the following in terminal:
   1. `git clone https://github.com/mat-sz/filedrop`
   2. `corepack yarn install`
   3. `corepack yarn build`
   4. `corepack yarn start`

### Environment variables

The following variables are used in the build process of the frontend:

| Variable        | Default value | Description                                   |
| --------------- | ------------- | --------------------------------------------- |
| `VITE_APP_NAME` | `filedrop`    | Default application title (while connecting). |

The following variables are used in the WebSockets server:

| Variable                 | Default value                   | Description                                                                                                               |
| ------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `WS_APP_NAME`            | `filedrop`                      | Application title.                                                                                                        |
| `WS_ABUSE_EMAIL`         | null                            | E-mail to show in the Abuse section.                                                                                      |
| `WS_HOST`                | `127.0.0.1`                     | IP address to bind to.                                                                                                    |
| `WS_PORT`                | `5000`                          | Port to bind to.                                                                                                          |
| `WS_USE_X_FORWARDED_FOR` | `0`                             | Set to `1` if you want the application to respect the `X-Forwarded-For` header.                                           |
| `WS_MAX_SIZE`            | `65536`                         | The limit should accommodate preview images (100x100 thumbnails).                                                         |
| `WS_MAX_NETWORK_CLIENTS` | `64`                            | Limits the amount of clients that can connect to one room.                                                                |
| `WS_REQUIRE_CRYPTO`      | `0`                             | Set to `1` if you want to ensure that all communication between clients is encrypted. HTTPS is required for this to work. |
| `WS_STATIC_ROOT`         | `../web/build`                  | Location of frontend build files relative to `./ws`                                                                       |
| `STUN_SERVER`            | `stun:stun1.l.google.com:19302` | STUN server address.                                                                                                      |
| `TURN_MODE`              | `default`                       | `default` for static credentials, `hmac` for time-limited credentials.                                                    |
| `TURN_SERVER`            | null                            | TURN server address.                                                                                                      |
| `TURN_USERNAME`          | null                            | TURN username.                                                                                                            |
| `TURN_CREDENTIAL`        | null                            | TURN credential (password).                                                                                               |
| `TURN_SECRET`            | null                            | TURN secret (required for `hmac`).                                                                                        |
| `TURN_EXPIRY`            | `3600`                          | TURN token expiration time (when in `hmac` mode), in seconds.                                                             |
| `NOTICE_TEXT`            | null                            | Text of the notice to be displayed for all clients.                                                                       |
| `NOTICE_URL`             | null                            | URL the notice should link to.                                                                                            |

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

## HTTPS setup

### Reverse proxy

1. Configure your reverse proxy to proxy requests to `127.0.0.1:PORT` and then follow the instructions for using SSL certificates with said proxy.
2. Ensure the TURN server can be connected to from the outside.
3. Ensure the `X-Forwarded-For` header is set for every proxied request and contains the IP of the client.
4. Ensure that filedrop is configured with `WS_USE_X_FORWARDED_FOR=1` (or `-f` argument with `docker-start.sh`)

#### Nginx configuration example

More details are available here: https://www.nginx.com/blog/websocket-nginx/

Replace `DOMAIN_NAME` with your domain name.

> [!WARNING]
> To use HTTP/3 your nginx must be built with HTTP/3 support.
> To check if your installation of nginx supports HTTP/3 execute `nginx -V` and check for presence of `--with-http_v3_module`.

```nginx
# ...

http {
  # BEGIN: HTTP/2 setup
    http2 on;
  # END: HTTP/2 setup

  # BEGIN: HTTP/3 setup
    # Feel free to leave this out if not using HTTP/3 or already configured.

    http3 on;
    http3_hq on;
    quic_gso on;
    quic_retry on;
  # END: HTTP/3 setup

  upstream filedrop {
    server 127.0.0.1:5000; # 5000 = PORT
  }

  map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
  }

  # ...

  server {
    server_name DOMAIN_NAME;

    listen 443 ssl;
    listen [::]:443 ssl;

    # BEGIN: HTTP/3 (QUIC) setup
      # Feel free to leave this out if not using HTTP/3.

      listen 443 quic;
      listen [::]:443 quic;
      add_header Alt-Svc 'h3=":443"; ma=86400';
      add_header x-quic 'h3';
      add_header Alt-Svc 'h3-29=":443"; ma=86400';
      add_header Alt-Svc 'quic=":443"; ma=86400';
    # END: HTTP/3 (QUIC) setup

    # BEGIN: SSL certificate
      # The following lines will be most likely generated by certbot/Let's Encrypt.
      # You may choose to omit them if using certbot.

      ssl_certificate /path/to/fullchain.pem;
      ssl_certificate_key /path/to/privkey.pem;
      # ...
      ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    # END: SSL certificate

    # ...

    location / {
      proxy_pass http://filedrop;
      proxy_http_version 1.1;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
    }

    # BEGIN: Caching
      location ~* \.(jpg|jpeg|gif|png|svg|bin|img|js|css|woff|woff2|webp)$ {
        proxy_pass http://filedrop;
        proxy_http_version 1.1;
        proxy_cache mycache;
        proxy_cache_min_uses 1;
        proxy_cache_valid 200 302 1d;
        proxy_cache_valid 404 1h;
        expires 12M;
        add_header Cache-Control "public immutable";
        add_header X-Cache-Status $upstream_cache_status;
      }
    # END: Caching
  }

  server {
    if ($host = DOMAIN_NAME) {
      return 301 https://$host$request_uri;
    }


    listen 80;
    listen [::]:80;

    server_name DOMAIN_NAME;
    return 404;
  }
}
```
