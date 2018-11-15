# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.3.0](https://github.com/Dreamscapes/atom-ide-mocha-core/compare/atom-ide-mocha-core@1.2.2...atom-ide-mocha-core@1.3.0) (2018-11-15)


### Bug Fixes

* change the final stats entry in Console back to log level ([ef05bf2](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/ef05bf2))


### Features

* add button to open the console to the Suite's success notification ([70ae794](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/70ae794))
* support multiple project folder in a single Atom window 🎉 ([0515c7d](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/0515c7d))





## [1.2.2](https://github.com/Dreamscapes/atom-ide-mocha-core/compare/atom-ide-mocha-core@1.2.1...atom-ide-mocha-core@1.2.2) (2018-11-15)


### Bug Fixes

* always attempt to open already existing Console pane ([b157742](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/b157742))
* default to IP interface on win32 systems ([11d5e1c](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/11d5e1c))
* restore "Open Console on Start" functionality ([5940390](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/5940390))





## [1.2.1](https://github.com/Dreamscapes/atom-ide-mocha-core/compare/atom-ide-mocha-core@1.2.0...atom-ide-mocha-core@1.2.1) (2018-11-14)


### Bug Fixes

* do not require Atom restart to apply new settings ([3d63625](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/3d63625))





# [1.2.0](https://github.com/Dreamscapes/atom-ide-mocha-core/compare/atom-ide-mocha-core@1.1.3...atom-ide-mocha-core@1.2.0) (2018-11-14)


### Features

* add option to open Console on suite failure ([c6c1524](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/c6c1524))
* attempt to extract more meaningful stack traces for diagnostics ([454eaf0](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/454eaf0))
* epic rewrite, more stable, such wow 🐕 ([c84de1a](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/c84de1a))





## [1.1.3](https://github.com/Dreamscapes/atom-ide-mocha-core/compare/atom-ide-mocha-core@1.1.2...atom-ide-mocha-core@1.1.3) (2018-11-14)


### Bug Fixes

* improve UX by making all notifications dismissable with ESC ❤️ ([f4be377](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/f4be377))





## [1.1.2](https://github.com/Dreamscapes/atom-ide-mocha-core/compare/atom-ide-mocha-core@1.1.1...atom-ide-mocha-core@1.1.2) (2018-11-13)


### Bug Fixes

* the busy spinner may be released while a suite is pending ([e595fa5](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/e595fa5))





# [1.1.0](https://github.com/Dreamscapes/atom-ide-mocha-core/compare/atom-ide-mocha-core@1.0.2...atom-ide-mocha-core@1.1.0) (2018-11-13)


### Bug Fixes

* do not go below 0 when tracking runs ([5788314](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/5788314))
* forward 'close' events to the receiver ([156085a](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/156085a))
* properly dispose of linter instance ([eb90000](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/eb90000))
* stop spinning busy signal when mocha dies prematurely ([fa61846](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/fa61846))


### Features

* focus console on busy spinner click ([5ab95b8](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/5ab95b8))





## [1.0.2](https://github.com/Dreamscapes/atom-ide-mocha-core/compare/atom-ide-mocha-core@1.0.1...atom-ide-mocha-core@1.0.2) (2018-11-12)


### Bug Fixes

* prevent mocha re-runs in watch mode from crashing spinner.dispose() ([cad1a25](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/cad1a25))
* relay socket errors to the receiver ([3dfebf0](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/3dfebf0))
* we do not have access to the correct package.json from here ([8f1de43](https://github.com/Dreamscapes/atom-ide-mocha-core/commit/8f1de43))





## 1.0.1 (2018-11-12)

**Note:** Version bump only for package atom-ide-mocha-core
