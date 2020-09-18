FROM node

WORKDIR /app

ADD . /app

RUN npm install
RUN npm run build

ENV DATABASE ./data/bigbrotherbot.db

CMD ["node", "dist/bot.js"]
