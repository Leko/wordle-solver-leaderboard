FROM rust:1.58-alpine

ARG cargo

WORKDIR /work

RUN cargo install ${cargo} --bin wordle-solver

ENTRYPOINT [ "wordle-solver" ]
