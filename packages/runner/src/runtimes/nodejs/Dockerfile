FROM node:16-alpine

ARG pkg
ARG bin

WORKDIR /work

RUN npm i -g ${pkg}
RUN ln -s $(which ${bin}) /work/cmd

ENTRYPOINT [ "/work/cmd" ]
