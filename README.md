# presskit.html

![Build status](https://travis-ci.org/pixelnest/presskit.html.svg?branch=master)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Complete re-implementation of [presskit()][dopresskit] (originally created by [Rami Ismail](https://twitter.com/tha_rami)).

The goal is to generate only HTML pages — no PHP required at all. Just fill some XML data files, add some images, execute a command, and boom. It's done.

**You already have a presskit and you want to use this tool instead of the old unmaintained PHP-based [presskit()][dopresskit]? [Read the migration guide](#migration-guide).**

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

`presskit` will scan your local working directory (where you are executing the command) and all direct sub-directories for `data.xml` files.

A data file is a `data.xml` file, which follows a clear structure.

### Files structure

You should have:

- One `data.xml` for your company.
- One `data.xml` per product in unique subfolders
- All assets (images) located in an `images/` subfolder next to the corresponding `data.xml`.

Example:

```
📄 data.xml
📂 images/
  📄 header.png
  📄 logo.png
📂 product-name-01/
  📄 data.xml
  📂 images/
    📄 header.png
    📄 logo.png
    📄 screenshot1.png
    📄 screenshot2.png
```

You can also [try our example](https://github.com/pixelnest/presskit.html/tree/master/data) from this repository.

### Output

After looking for all data, `presskit` will generate a `build/` folder with all the html files ready to be uploaded on your server.

Simply copy **all** the files to your server… and you're done!

_Note: the webserver is **not** included._

## Migration Guide

This tool is almost a drop-in replacement from [presskit()][dopresskit] (well, except for the fact that it generates HTML instead of using a PHP back-end — but that's simpler, not harder). Which means that you can go in your folder containing the `data.xml` and `images/`, run `presskit build` and boom, you're done. Well, almost.

We have made some breaking changes between this format and the original [presskit()][dopresskit] format.

But be reassured: there are fairly small, and are, indeed, useful.

Follow the guide.

### URLs

[presskit()][dopresskit] didn't require the protocol (ie., `http` or `https`) for most URLs.

For example:

```xml
<socials>
  <social>
    <name>twitter.com/pixelnest/</name>
    <link>twitter.com/pixelnest/</link>
  </social>
</socials>
```

Note that the `<link>` has no `http` or `https` protocol before its destination.

The problem with that is that we cannot deduce the protocol automatically. It will work seamlessly for the biggest sites like Facebook or Twitter, but we cannot guarantee that it will link correctly for everything.

That's why we require that you specify the protocol for your URLs:

```xml
<socials>
  <social>
    <name>twitter.com/pixelnest/</name>
    <link>https://twitter.com/pixelnest/</link>
  </social>
</socials>
```

Otherwise, the URL will be relative to your presskit, and thus, will break.

### Company `data.xml`

Your main `data.xml` containing your company information should use a `<company></company>` root tag for your XML document.

Before:

```xml
<?xml version="1.0" encoding="utf-8"?>
<game>
	<title>Pixelnest Studio</title>
  <!-- The rest -->
</game>
```

After:

```xml
<?xml version="1.0" encoding="utf-8"?>
<company>
  <title>Pixelnest Studio</title>
  <!-- The rest -->
</company>
```

**Why?** It allows us to better differentiate the main `data.xml` from the others. And moreover, it does not make sense that the company `data.xml` is considered as a `<game>`, right?

### Release dates

The original [presskit()][dopresskit] assumed that you had only one release date for a product or game. And we all know that it's simply not true.

That's why we handle multiple release dates.

So, in your product/game `data.xml`, you must change your `<release-date>` tag.

Before:

```xml
<?xml version="1.0" encoding="utf-8"?>
<product>
	<title>My Super Game</title>
  <release-date>04 Feb, 2016</release-date>
  <!-- The rest -->
</product>
```

After:

```xml
<?xml version="1.0" encoding="utf-8"?>
<product>
	<title>My Super Game</title>
	<release-dates>
		<release-date>PC/Mac - 04 Feb, 2016</release-date>
		<release-date>iOS/Android - 04 Feb, 2017</release-date>
	</release-dates>
  <!-- The rest -->
</product>
```

**Why?** We all know that there's no single release date for a product or a game.

---

## Credits

### [presskit()][dopresskit]

This couldn't have be made without the awesome work from the original [presskit()][dopresskit] team. Thanks to them!

### Assets

The images used in this repository can be found on [Unsplash](https://unsplash.com/), a free provider of high-quality images.


[dopresskit]: http://dopresskit.com
