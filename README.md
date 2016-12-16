# presskit.html

![Build status](https://travis-ci.org/pixelnest/presskit.html.svg?branch=master)

Complete re-implementation of [presskit()](http://dopresskit.com) (originally created by [Rami Ismail](https://twitter.com/tha_rami)).

The goal is to generate only HTML pages — no PHP required at all. Just fill some XML/JSON/Markdown data files, execute a command, and boom. It's done.

## Installation

Simpliest way to install **presskit.html** is to use [npm](http://npmjs.org/):

```
npm install <TODO,  package not ready!>
```

This should add the `presskit` command to your shell.

## Usage

`presskit` will scan your local working directory (where you are executing the command) and all sub-directories for data files.

A data file is either:

- a [presskit()](http://dopresskit.com) `data.xml` file
- a new data.json file
(- soon a data.md file)

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

Note: the webserver is **not** included.

<!-- TODO -->
<!-- Contributing -->
<!-- Live examples -->
