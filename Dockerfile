FROM node:14-slim

# Create app directorya
WORKDIR /app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production



# Bundle app source
COPY . .

RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN npm init -y &&  \
  npm i puppeteer \
  && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /node_modules \
  && chown -R pptruser:pptruser /package.json \
  && chown -R pptruser:pptruser /package-lock.json

#RUN npm init -y &&  \
# npm i puppeteer \
#&& groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
#&& mkdir -p /home/pptruser/Downloads \
#&& chown -R pptruser:pptruser /home/pptruser \
#&& chown -R pptruser:pptruser /app/node_modules \
#&& chown -R pptruser:pptruser /app/package.json \
#&& chown -R pptruser:pptruser /app/package-lock.json

EXPOSE 80

CMD [ "node", "dist/index.js" ]
#CMD [ "google-chrome-stable","node", "dist/index.js" ]