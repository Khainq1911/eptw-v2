##### Dockerfile #####

## build stage ##
FROM node:24-alpine AS builder

WORKDIR /app

# copy package trước để cache layer
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


## run stage ##
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

# chỉ cài production deps
RUN npm install --omit=dev

# chỉ copy dist + node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js"]