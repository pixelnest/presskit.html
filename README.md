# presskit.html

![Build status](https://travis-ci.org/pixelnest/presskit.html.svg?branch=master)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Complete re-implementation of [presskit()](http://dopresskit.com) (originally created by [Rami Ismail](https://twitter.com/tha_rami)).

The goal is to generate only HTML pages — no PHP required at all. Just fill some XML/JSON/Markdown data files, execute a command, and boom. It's done.

## Installation

The simplest way to install **presskit.html** is to use [npm](http://npmjs.org/):

```
npm install -g <TODO,  package not ready!>
```

This should add (globally) the `presskit` command to your shell.

## Usage

`presskit` will scan your local working directory (where you are executing the command) and all direct sub-directories for data files.

A data file is either:

- a [presskit()](http://dopresskit.com) `data.xml` file
- a new `data.json` file
- (soon a `data.md` file)

### Files structure

You should have:
- one data file for your company
- one data file per product in unique subfolders
- all assets (images) located in an `images/` subfolder next to your data file

Example:

```
/data.json
/images
  /header.png
/product1/
  /data.json
  /images  
    /screenshot1.png
    /screenshot2.png
```

You can also [try our example](https://github.com/pixelnest/presskit.html/tree/master/docs/example) from this repository.

### Output

After looking for all data, `presskit` will generate a `build/` folder with all the html files ready to be uploaded on your server.

Simply copy **all** the files to your hosting location... and you're done!


*Note: the webserver is __not__ included.*

<!-- TODO -->
<!-- Contributing -->
<!-- Live examples -->
