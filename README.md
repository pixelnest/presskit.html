# presskit.html

![Build status](https://travis-ci.org/pixelnest/presskit.html.svg?branch=master)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Complete re-implementation of [presskit()](http://dopresskit.com) (originally created by [Rami Ismail](https://twitter.com/tha_rami)).

The goal is to generate only HTML pages — no PHP required at all. Just fill some XML data files, add some images, execute a command, and boom. It's done.

## Roadmap

The roadmap is available on [Trello](https://trello.com/b/5T6BIyi3/open-source-presskit-html). Feel free to send a pull request.

## Installation

The simplest way to install **presskit.html** is to use [npm](http://npmjs.org/):

```
npm install -g <TODO,  package not ready!>
```

(You can also use [Yarn](https://yarnpkg.com/en/) instead.)

This should add (globally) the `presskit` command to your shell.

## Usage

`presskit` will scan your local working directory (where you are executing the command) and all direct sub-directories for data files.

A data file is a `data.xml` file, which follows a clear structure.

### Files structure

You should have:

- one data file for your company
- one data file per product in unique subfolders
- all assets (images) located in an `images/` subfolder next to your data file

Example:

```
/data.xml
/images
  /header.png
  /logo.png
/product-name-01/
  /data.xml
  /images  
    /header.png
    /logo.png
    /screenshot1.png
    /screenshot2.png
```

You can also [try our example](https://github.com/pixelnest/presskit.html/tree/master/data) from this repository.

### Output

After looking for all data, `presskit` will generate a `build/` folder with all the html files ready to be uploaded on your server.

Simply copy **all** the files to your hosting location... and you're done!

*Note: the webserver is __not__ included.*

<!-- TODO -->
<!-- Contributing -->
<!-- Live examples -->

## Images

The images used in this repository can be found on [Unsplash](https://unsplash.com/), a free provider of high-quality images.
