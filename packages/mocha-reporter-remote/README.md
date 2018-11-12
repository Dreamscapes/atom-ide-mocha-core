# mocha-reporter-remote

> Deliver Mocha progress events over Unix sockets/TCP connections to someplace else

This reporter allows Mocha to send its progress updates, which would normally appear on console, somewhere else - over Unix sockets or plain TCP connections. This is useful if you need Mocha to "contact" some independent process and feed it with progress, like [ide-mocha][ide-mocha] for Atom, but the use cases are not limited to that.

## Usage

Just install the reporter into your project:

```sh
npm i -D mocha-reporter-remote
```

And then run Mocha with the chosen reporter and specify where the reporter should send the events:

```sh
# For Unix socket connections, specify where the socket exists:
npx mocha --reporter mocha-reporter-remote --reporter-options address=/var/folders/np/yp1y_nk504b0k61prl2pk4b40000gn/T/mocha-reporter-remote.sock

# For TCP connections, just pick a port to connect to:
npx mocha --reporter mocha-reporter-remote --reporter-options address=12345
```

> The socket or TCP server must exist before the reporter starts. The receiving end should likely be permanently listening for data regardless of whether or not Mocha is actually being run. ⚠️

## Receiving events

@TODO 😢

For now, have a look at what data is being sent to the receiving end [here](src/serialisers.mjs) and how the data is parsed from the socket and consumed [here](https://github.com/Dreamscapes/atom-ide-mocha-core/blob/master/packages/ide-mocha/src/remote/index.mjs).

## License

See the [LICENSE](LICENSE) file for information.

[ide-mocha]: https://github.com/Dreamscapes/atom-ide-mocha-core/tree/master/packages/ide-mocha
