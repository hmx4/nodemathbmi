FROM node:buster
WORKDIR /mathbmi
COPY . .
CMD node ./bin/www