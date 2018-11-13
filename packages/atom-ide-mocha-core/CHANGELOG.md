# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
