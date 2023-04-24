# Base image
FROM node:18

# Create app directory
WORKDIR /quiz-app-backend

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main" ]
