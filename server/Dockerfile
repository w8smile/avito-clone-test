
FROM node:22.13.1

WORKDIR /app


COPY server/package*.json ./


RUN npm install


COPY server/ .


EXPOSE 3000


CMD ["npm", "start"]