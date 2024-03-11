# Stage 1: Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy application dependencies
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=true

# Install dependencies
RUN npm install

# Build the Next.js application with lint disabled
#RUN npm run build --no-lint

# Stage 2: Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=build /app /app
# Expose port

# Command to run the application
CMD ["npm", "run", "dev"]