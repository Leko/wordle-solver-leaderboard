FROM denoland/deno:alpine-1.18.0

ARG entrypoint

WORKDIR /work

RUN deno compile --output /work/cmd ${entrypoint}

ENTRYPOINT [ "/work/cmd" ]
