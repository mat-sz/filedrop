# => Build container
FROM node:19-alpine as build

# set version label
ARG BUILD_DATE
ARG VERSION

LABEL build_version="filedrop-web version: ${VERSION}, Build Date: ${BUILD_DATE}"

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn

ENV PATH /app/node_modules/.bin:$PATH
COPY . /app

RUN yarn install
RUN yarn build

# => Run container
FROM nginx:alpine


# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

# COPY --from=build /app/conf/nginx /etc/nginx
COPY --from=build /app/build /usr/share/nginx/html/

# Default port exposure
EXPOSE 80

WORKDIR /usr/share/nginx/html

# copy .env.example as .env to the container
COPY .env.example .env

RUN apk add --update nodejs
RUN apk add --update npm
RUN npm install -g runtime-env-cra@0.2.4

# Add bash
RUN apk add --no-cache bash

# Start Nginx server
CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]
