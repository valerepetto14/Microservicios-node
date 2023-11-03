FROM node:alpine
WORKDIR '/app'

COPY . .

RUN npm install
RUN npm i typescript
RUN npm run build
RUN npx prisma generate
CMD npm run start