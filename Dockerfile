FROM node:8.9.1
MAINTAINER qiangyun.wu 842269153@qq.com

RUN npm install -g yarn --registry=https://registry.npm.taobao.org
COPY ./ /workspace/
WORKDIR /workspace/
RUN yarn install
RUN ls -la
EXPOSE 3000
CMD ["npm", "start"]