FROM node:14 as base
WORKDIR /src

# Add Tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
COPY . .

RUN npm i

# RUN npx prisma generate
#RUN rm -rf ./prisma/migrations
#RUN npm run reset --force
#RUN npx prisma migrate dev --name "clean" 
# RUN npm run build
#RUN npm run reset
#RUN npm run mseed


# CMD ["node","./dist/index.js"]
CMD ["npm", "run", "start:migration:prod"]

