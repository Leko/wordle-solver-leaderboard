FROM node:16-alpine

ARG pkg

WORKDIR /work

RUN npm i -g ${pkg}
RUN ln -s $(which ${pkg}) /work/cmd

ENTRYPOINT [ "/work/cmd" ]
