FROM node:alpine as build

WORKDIR /app
ARG SERVER
ARG TITLE
ENV PATH /app/node_modules/.bin:$PATH
COPY . /app

RUN yarn install
RUN REACT_APP_SERVER=${SERVER} REACT_APP_TITLE=${TITLE} REACT_APP_USE_BROWSER_ROUTER=1 yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]