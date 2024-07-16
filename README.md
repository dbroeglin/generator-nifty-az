# generator-nifty-az 
> A collection of useful Azure Demo generators

## Installation

First, install [Yeoman](http://yeoman.io) and `generator-nifty-az` using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-nifty-az
```

### Generate your new demo

```bash
yo nifty-az hello-demo
```

### Customize your demo

See the generated `README.md` for additional information about the deployment process.

```bash
cd hello-demo
yo nifty-az:customize
```

### Deploy by running

See the generated `README.md` for additional information about the deployment process.

#### Python version

```bash
azd up
```

#### Java version

```bash
cd deploy/aca
azd up
```

## Licenses

MIT Licenses, see `LICENSE`.