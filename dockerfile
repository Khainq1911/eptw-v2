FROM node:22.16.0-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

FROM node:22.16.0-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]

