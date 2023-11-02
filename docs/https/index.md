# HTTPS setup

## Reverse proxy

1. Configure your reverse proxy to proxy requests to `127.0.0.1:PORT` and then follow the instructions for using SSL certificates with said proxy.
2. Ensure the TURN server can be connected to from the outside.
3. Ensure the `X-Forwarded-For` header is set for every proxied request and contains the IP of the client.
4. Ensure that filedrop is configured with `WS_USE_X_FORWARDED_FOR=1` (or `-f` argument with `docker-start.sh`)

## Examples

- [Nginx](./nginx.md)
