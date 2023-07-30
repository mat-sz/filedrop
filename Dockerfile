# => Build container
FROM node:19-alpine as build

# set version label
ARG BUILD_DATE
ARG VERSION

LABEL build_version="filedrop version: ${VERSION}, Build Date: ${BUILD_DATE}"

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . /app

RUN apk add --no-cache bash
RUN yarn install
RUN yarn build
EXPOSE 5000

COPY /web/.env.example /web/.env

CMD ["yarn", "start:prod"]
