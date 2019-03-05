# Atom-IDE-Mocha

> Integrate your Mocha test suite's progress with Atom using Atom-IDE-UI components 🎨

## About

This repository holds two major components:

- [mocha-reporter-remote][reporter-home] - A Mocha reporter which sends progress events over a Unix socket or a plain TCP connection
- [ide-mocha][ui-home] - The Atom package which reads the Mocha progress reports and feeds them into various Atom-IDE-UI components

> See the individual packages' README files for more details.

The main Atom package repo can be [found here][ide-mocha-repo].

## Examples

The gif is in terrible quality, but it does show everything - from starting the test suite independently of Atom to seeing progress reports as well as diagnostics messages.

![ide-mocha in action][ide-mocha-gif]

## Contributing

Please do! 🙏 If you discover issues or have suggestions to improve the module please open up an issue. Thanks!

## License

See the [LICENSE](LICENSE) file for information.

[reporter-home]: packages/mocha-reporter-remote
[ui-home]: packages/ide-mocha
[ide-mocha-repo]: https://github.com/Dreamscapes/atom-ide-mocha
[ide-mocha-gif]: https://user-images.githubusercontent.com/3058150/48307632-32ab5100-e551-11e8-90d8-8dc18891d46c.gif
