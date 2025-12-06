FROM node:20-alpine

WORKDIR /app

# Expose port
EXPOSE 3000

# Start dev server (everything mounted via volumes)
CMD ["npm", "run", "dev"]
