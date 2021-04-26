# https://dev.to/avatsaev/create-efficient-angular-docker-images-with-multi-stage-builds-1f3n

### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:14.16.0-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./

# Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm ci
COPY . .

# Variables available for the build stage
ARG APP_API_URL
ARG APP_BROWSER_STORAGE_KEY

# Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build -- --prod --output-path=dist


### STAGE 2: Setup ###

FROM nginx:1.19.8-alpine

# Remove the default.conf and copy your nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY ./proxy/nginx.conf /etc/nginx/conf.d/

# Remove the default security headers and copy yours
COPY ./proxy/security-headers.conf /etc/nginx/security-headers.conf

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
