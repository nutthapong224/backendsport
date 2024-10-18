# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application with PM2
CMD ["pm2-runtime", "start", "server.js"]  
