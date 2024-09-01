# Step 1: Start the node js server 
FROM node:alpine3.18 as build
WORKDIR /app 
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "start"]

# Step 2: Server With Nginx
FROM nginx:1.23-alpine
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

# WORKDIR /usr/share/nginx/html
# RUN rm -rf *
# COPY --from=build /app/build .
# EXPOSE 80
# ENTRYPOINT [ "nginx", "-g", "daemon off;" ]