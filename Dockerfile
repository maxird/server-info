FROM maxird/node:7-6.10.0

ADD . /app

WORKDIR /app

RUN npm install --production

ENV PORT 80

ENTRYPOINT ["node", "index.js"]
