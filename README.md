[![Build Status](https://travis-ci.org/interactive-apps/indicator-search.svg?branch=master)](https://travis-ci.org/interactive-apps/indicator-search)
[![dependencies Status](https://david-dm.org/interactive-apps/indicator-search/status.svg)](https://david-dm.org/interactive-apps/indicator-search)
[![devDependencies Status](https://david-dm.org/interactive-apps/indicator-search/dev-status.svg)](https://david-dm.org/interactive-apps/indicator-search?type=dev)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Indicator Search

Flexible and Lightweight App that simplify Searching and understanding of Indicators in DHIS2, let you know about the performance, trend and the quality of data for that indicator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

## Prerequisites

1.  nodejs
2.  npm
3.  git

## Getting started

Clone the repository by running this command

```bash
$ git clone https://github.com/interactive-apps/indicator-search.git
```

Go to the app directory

```bash
$ cd indicator-search
```

Install all required dependencies for the app

```bash
$ npm install
```

## Development server

To open a dev server run

```bash
$ npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

This command will require proxy-config.json file available in the root of your source code, usually this file has this format

```json
{
  "/api": {
    "target": "https://play.dhis2.org/2.29/",
    "secure": "false",
    "auth": "admin:district",
    "changeOrigin": "true"
  },
  "/": {
    "target": "https://play.dhis2.org/2.29/",
    "secure": "false",
    "auth": "admin:district",
    "changeOrigin": "true"
  }
}
```

We have provided `proxy-config.example.json` file as an example, make a copy and rename to `proxy-config.json`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

To build a project, run

```bash
$ npm run build
```

The build artifacts will be stored in the `dist/`, this will included a zip file ready for deploying to any DHIS2 instance.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
