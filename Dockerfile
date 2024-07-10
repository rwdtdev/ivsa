# Stage 1: Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy application dependencies
COPY . .
RUN rm -f .env.sample && mv .env.mivc .env

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=true

# Install dependencies
RUN npm ci

# Build the Next.js application with lint disabled
RUN npm run build
# Stage 2: Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=build /app /app
# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npx", "next", "start"]