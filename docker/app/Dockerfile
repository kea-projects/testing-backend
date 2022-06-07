# Lightweight environment with node pre-installed
FROM node:alpine AS builder

# Directory to work in the container
WORKDIR /app

# Copy package.json to the root of the WORKDIR
COPY package.json ./

# Copy all files different to local machine to container
# The way caching works, any changes to any files will force everything under it to
#   rebuild all subsequent steps
COPY . .

# Run npm install inside container
# --legacy-peer-deps This line is currently required for the dependencies to install
# Should be tested once in a while and removed when possible, as package maintainers
#   updated their dependencies to the new automated system.
RUN  npm ci 

# Execute this command in the docker container

CMD ["npm", "test"]
