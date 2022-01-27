## How to participate

1. Fork this repository
1. Please add your information to [packages/runner/src/contestants.ts](../packages/runner/src/contestants.ts)
   - The key of the object is your nickname
   - The value is the metadata needed to execute your code
   - Node.js
     1. Publish your solver as a npm package.
     2. `runtime` field must be `"nodejs"`
     3. Set the name of the package to the `npm` field
     4. Set the name of the executable to the `bin` field
   - Deno
     1. Upload the code to somewhere accessible from the Internet
     2. `runtime` field must be `"deno"`
     3. Set the URL to the entrypoint to the `entrypoint` field
   - Rust
     1. Publish your solver as a Cargo bin package.
     2. `runtime` field must be `"rust"`
     3. Set the name of the package to the `cargo` field
     4. Set the name of the executable to the `bin` field

## Add new runtime

1. Add a Dockerfile into `packages/runner/src/runtimes`
   - It must have at least one [build arg](https://docs.docker.com/engine/reference/commandline/build/#set-build-time-variables---build-arg) so the runner could build Docker images based on contestants metadata.
   - It must have `ENTRYPOINT` so the runner could launch the image without any CLI arguments.
   - Example: [Node.js](packages/runner/src/runtimes/nodejs/Dockerfile), [Deno](packages/runner/src/runtimes/deno/Dockerfile), [Rust](packages/runner/src/runtimes/rust/Dockerfile)
2. Add type definition to `packages/runner/src/contestants.ts`
3. Implement build process in `packages/runner/src/runtime.ts`
4. Update CONTRIBUTING.md
