FROM rust:1.58-alpine

ARG cargo
ARG bin

WORKDIR /work

RUN cargo install ${cargo} --bin ${bin}
RUN ln -s $(which ${bin}) /work/cmd

ENTRYPOINT [ "/work/cmd" ]
