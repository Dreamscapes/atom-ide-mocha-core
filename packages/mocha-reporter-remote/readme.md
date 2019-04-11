# mocha-reporter-remote

> Deliver Mocha progress events over Unix sockets/TCP connections to someplace else

This reporter allows Mocha to send its progress updates, which would normally appear on console, somewhere else - over Unix sockets or plain TCP connections. This is useful if you need Mocha to "contact" some independent process and feed it with progress, like [IDE-Mocha][ide-mocha] for Atom, but the use cases are not limited to that.

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

## Reporter options

The following options are accepted by this reporter:

- `root`: Specifies the root directory where Mocha is being run. This is useful for auto-detecting the socket or port of the remote listener.
- `mode`: Specifies the networking mode to be used. Allowed values are `unix` for Unix sockets, `ip` / `IP` for TCP. Default: `unix`.
- `address`: Either TCP port number of the absolute path to the unix socket to which to send events. Only used if `root` is not provided. ⚠️
- `nostats`: When set to `1` or any "truthy" value, Mocha will not print the final test stats to the console when it is done running. Default: `0`.

Reporter options can be provided on the command line or via _.mocharc.js_ or similar mechanism.

**Command line**:

```sh
# Using address
mocha --reporter mocha-reporter-remote --reporter-options address=/path/to/socket.sock,nostats=1
# using root
mocha --reporter mocha-reporter-remote --reporter-options root=${PWD},nostats=1
```

**_mocharc.js_**:

```js
module.exports = {
  reporter: 'mocha-reporter-remote',
  // This has to be singular, `reporterOptions` does not seem to
  // parse the options correctly
  reporterOption: [
    'address=/path/to/socket.sock',
    'nostats=1'
  ]
  // ... other Mocha options
}
```

## Receiving events

@TODO 😢

For now, have a look at what data is being sent to the receiving end [here](src/serialisers.mjs) and how the data is parsed from the socket and consumed [here](https://github.com/Dreamscapes/atom-ide-mocha-core/blob/master/packages/atom-ide-mocha-core/src/ide-mocha.mjs#L227).

## License

See the [LICENSE](LICENSE) file for information.

[ide-mocha]: https://github.com/Dreamscapes/atom-ide-mocha-core/tree/master/packages/ide-mocha
