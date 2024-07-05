# Create a Docker image for the nodejs application running the server.js

# Use the official image as a parent image
FROM node:20.10.0


RUN apt-get update 
RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2


# Set the working directory
WORKDIR /usr/src/app

# Copy Package.json
COPY package*.json ./

ENV node_env=production
# Install dependencies
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY ur3z4mifggsqhhm
ENV PM2_SECRET_KEY 1psvz0wwwi6clpr

RUN npm install



# Copy code
COPY . .


# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
# CMD ["npm", "install"]
CMD ["pm2-runtime", "server.js"]


