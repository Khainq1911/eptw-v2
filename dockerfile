##### Dockerfile #####

## build stage ##
FROM node:24.4.1-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

# Cài công cụ build
RUN npm install glob rimraf

# Cài dependencies dev
RUN npm install --only=development

# Copy toàn bộ source
COPY . .

# Build NestJS
RUN npm run build


## run stage ##
FROM node:24.4.1-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# Chỉ cài dependencies production
RUN npm install --only=production

# Copy toàn bộ source (NOT recommended nếu không cần)
COPY . .

# Copy dist từ stage build
COPY --from=development /usr/src/app/dist ./dist

# 👇 Thêm expose port NestJS mặc định
EXPOSE 3000

CMD ["node", "dist/main.js"]
