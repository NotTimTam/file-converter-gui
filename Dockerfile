# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Run the start script when the container launches
CMD ["npm", "start"]