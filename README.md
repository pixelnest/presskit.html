# ![presskit.html](header.png)

> Re-implementation of presskit() as a static site generator

![Build Status](https://travis-ci.org/pixelnest/presskit.html.svg?branch=master)
[![NPM - Presskit](https://badgen.net/npm/v/presskit)](https://www.npmjs.com/package/presskit)
[![Code Style - Standard](https://badgen.net/badge/code%20style/standard/f2a)](http://standardjs.com/)

* [Why presskit.html?](#why)
* [Showcase](#showcase)
* [Roadmap](#roadmap)
* [Quickstart](#quickstart-for-existing-presskit-users)
* [Installation](#installation)
* [Usage](#usage)
* [Documentation](#documentation)
* [Migration Guide](#migration-guide)
* [Credits](#credits)

_Created by [Pixelnest Studio](http://pixelnest.io/)._

This is a complete re-implementation, with a permissive MIT license, of [presskit()][dopresskit], which was originally created by [Rami Ismail](https://twitter.com/tha_rami) of [Vlambeer](http://www.vlambeer.com).

Warning: **presskit.html** is, _currently_, a tool for developers. You need to know how to use the command-line — but that's all, to be honest. However, we plan to create a small app to simplify this process in the future. Stay tuned by following our [Twitter account](https://twitter.com/pixelnest).

---

**presskit.html** is a tool to create a presskit for your company, products or games.

To quote the original [presskit()][dopresskit]:

> Developers & press both have the same goal: to bring great games to as many people as possible - after all, a good game is worth nothing if no-one plays it. For the press, finding out about a game but not having access to information & media for the game means that they can't write about it. Of course, developers want to spend their valuable time making games instead of press pages.

> **presskit()** (pronounced _'do presskit'_) is the solution. Free for everyone, open and easy-to-use for both developers & press. Developers only have to spend an hour or so creating well-laid out press pages with everything the press needs to write to their hearts desire. Everybody wins.

It uses an **almost-identical format and output** as its precursor. The goal is to be compatible, as much as possible.

And even if presskit() was conceived with videogames in mind, we think that you can use it for any kind of product.

Examples (built with **presskit.html**):

* [Pixelnest Studio](http://pixelnest.io/presskit/)
* [Fake Pizza Burger Studio](http://pixelnest.io/presskit.html/example/)

The goal of **presskit.html** is to generate only static HTML pages — no PHP required at all. Just fill some XML data files, add some images, execute a command, and boom. It's done.

**You already have a presskit and you want to use this tool instead of the old un-maintained PHP-based presskit()? [Read the migration guide](#migration-guide).**

## Why

**Why reimplement [presskit()][dopresskit]?** **presskit.html** is basically a static site generator for presskit(). Everything is built once on your computer, and then distributed as static files to your users.

We love the concept behind static site generators like [Jekyll](https://jekyllrb.com) or [Hugo](https://gohugo.io). These tools create lightweight static HTML pages, which are, by design, more secure and efficient than using a PHP server, for example.

Moreover, if you use one of these tools to build your company or product's website, you can simply drop the result of **presskit.html** into your site directly, whatever the technology you are using — it's just HTML pages, after all. 😉

That's mainly why we built **presskit.html** — that's how we make our websites, and we can integrate our presskits more easily this way.

We have also added some nice little things (like thumbnails generation, a "Press Copy Request" button, widgets integration, relations between products or an optional hamburger menu, for example) and created a more robust implementation of presskit() (which is, unfortunately, un-maintained since 2014).

However, _we have tried to be as close as possible to the original presskit format and style._ In fact, comparing the output of **presskit.html** with the one of presskit() should be almost indistinguishable.

This is by design: the aim of the original presskit() was to create an instantly-recognizable website — almost a standard in the videogame industry.

You already have a presskit? Just try it: [follow our migration guide](#migration-guide), run **presskit.html** in the folder containing your presskit()-based `data.xml` and `images/` and you will have a ready to deploy set of HTML pages which are almost identical to what you already have.

## Showcase

Built with **presskit.html**:

* [Pixelnest Studio](http://pixelnest.io/presskit/) ([source code](https://github.com/pixelnest/presskit/))
* [Genix Lab](http://www.genix-lab.com/presskit/)
* [Creative Brothers](http://www.creativebrothers.io/presskit/en/)

<small>_You are using **presskit.html**? Tell us or submit a pull request!_</small>

Want to compare with presskit() websites? Check these ones:

* [Vlambeer](http://www.vlambeer.com/press/)
* [Flying Oak Games](http://www.flying-oak.com/presskit/index.php)

## Roadmap

The roadmap is available on [Trello](https://trello.com/b/5T6BIyi3/open-source-presskit-html).

## Quickstart for existing presskit users

1. Install [Node.js](https://nodejs.org).
2. Open your terminal ("Terminal" on macOS, "cmd" on Windows).
3. Run `npm install -g presskit`.
4. Type `cd`, press space, and drag the folder containing your `data.xml` files.
5. Run `presskit build`.
6. Open the `build/` folder, double-click on index.html and… 🍾

## Installation

You will need a terminal and [Node.js](https://nodejs.org/).

The simplest way to install **presskit.html** is to use [npm](http://npmjs.org/) (bundled with Node.js):

```shell
npm install -g presskit
```

(Feeling fancy? Use [Yarn](https://yarnpkg.com/en/) instead.)

This should add a globally available `presskit` command to your shell.

To update to a new version of **presskit.html**, just type:

```shell
npm update -g presskit
```

## Usage

Run this command:

```
presskit build
```

**presskit.html** will then scan your local working directory (where you are executing the command) and all direct sub-directories for `data.xml` files and `images/` folders.

To launch your presskit with a server and automatically reload it each time your save a `data.xml`, just use:

```
presskit build --watch
```

You can also specify the folder to scan:

```shell
presskit build path/to/folder
```

The `presskit` command does a bunch more (watch mode, generation of `data.xml`, etc.). Use `presskit -h` to learn more.

In order to generate a complete presskit, you should have:

- One `data.xml` for your company.
- One `data.xml` per product in unique subfolders.
- All assets (mostly images) located in an `images/` subfolder next to the corresponding `data.xml`.

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

The `header.png` is used as the banner for the corresponding page. `logo.png` will be used as the product's brand.

The arborescence above should generate a build folder containing:

```
📂 build/
  📄 index.html
  📂 images/
    📄 header.png
    📄 logo.png
    📄 images.zip
    📄 logo.zip
  📂 product-name-01/
    📄 index.html
    📂 images/
      📄 header.png
      📄 logo.png
      📄 screenshot1.png
      📄 screenshot2.png
      📄 images.zip
      📄 logo.zip
  📂 css/
  📂 js/
```

Simply copy **all** the files in the `build/` folder to your server… and you're done!

_Note: the webserver is **not** included._

You can also [try our example](https://github.com/pixelnest/presskit.html/tree/master/data) from this repository, available online here: http://pixelnest.io/presskit.html/example/.

### Additional options of `presskit build`

`presskit build` has a few other features. Use `presskit build -h` to discover them all.

Two interesting ones are:

- `presskit build --collapse-menu` uses a collapsed menu for the main navigation at the top (commonly-known as the "[hamburger button](https://en.wikipedia.org/wiki/Hamburger_button)") — only for small screens. This option toggles this behavior on all pages.
- `presskit build --pretty-links` hides `index.html` at the end of URLs.

You can combine all these options together, of course.

### Create `data.xml` files with `presskit new`

You can also generate empty `data.xml` with the `presskit new` command.

## Documentation

For a tag by tag walkthrough, open these links:

- [Company `data.xml` file](http://pixelnest.io/presskit.html/company/)
- [Product or game `data.xml` file](http://pixelnest.io/presskit.html/product/)

**If you have never written a presskit before, those links are a must-read.**

For a more detailed documentation about some specific features, see below.

_NB: since **presskit.html** is 99% compatible with [presskit()][dopresskit], you can also just read the existing documentation there._

### Tags

**Warning: do not put XML tags inside your content.**

For example, do not do this (note the `<br />`):

```xml
<description>
  Lorem ipsum<br /> sit amet.
</description>
```

#### Widgets

This is a new feature of **presskit.html**: you can put your widgets directly into your presskit pages.

- Mailchimp `<mailchimp>LIST_URL inside your signup form</mailchimp>`
- App Store `<appstore>APP_ID</appstore>`
- Play Store `<playstore>com.domain.yourappid</playstore>`
- Steam `<steam>STEAM_ID</steam>`
- Humble Bundle `<humble>product_name/BUNDLE_ID</humble>`
- Itch.io `<itch>ITCH_ID</itch>`
- Game Jolt `<gamejolt>PACKAGE_ID</gamejolt>`
- Bandcamp `<bandcamp>BANDCAMP_ID</bandcamp>`

Just add the `<widgets>` tag, and the widget providers that you want:

```xml
<widgets>
  <mailchimp>//url.us3.list-manage.com/subscribe/post?u=USER_ID&amp;id=LIST_ID</mailchimp>
  <appstore>950812012</appstore>
  <playstore>com.noodlecake.altosadventure</playstore>
  <steam>347160</steam>
  <humble>steredenn/7SDLfk23hw</humble>
  <itch>27992</itch>
  <gamejolt>8ReMi2Nw</gamejolt>
  <bandcamp>1135613467</bandcamp>
</widgets>
```

We don't support other widgets for the moment, but feel free to send a pull request or submit an issue.

**Warning: widgets import many scripts and assets. This may have a penalty on your page size and responsiveness.**

#### Relations

This is a new feature of **presskit.html**: you can specify relations between products using the `<relations>` tag.

For example, on a product page, you could add something like:

```xml
<title>StarCraft</title>

[…]

<relations>
  <relation>
    <type>Expansion</type>
    <product>StarCraft: Brood War</product>
  </relation>
  <relation>
    <type>Sequel</type>
    <product>StarCraft II</product>
  </relation>
</relations>
```

_This tag should be added on the **main** page; not the related product._

At build time, a relation will be added to the product and its related product, with a link between the two.

You can have as many relations as you want. You can use it to show DLCs, expansions, sequels, prequels, etc.

**Warning**: you need to rebuild the presskit to see the changes.

#### Other tags

We recommend to read the [company](http://pixelnest.io/presskit.html/company/) and [product](http://pixelnest.io/presskit.html/product/) documentation pages for more information. New tags include `<partners>` and `<abouts>`. More might be implemented later.

### Images

For each `data.xml`, you can add an `images/` folder containing the assets of your product or game.

- An image named `header.png` or `header.jpg` will be used for the page's banner.
- An image named `logo.png` or `logo.jpg` will be used as your page's logo.
- Each `jpg`, `jpeg`, `png` or `gif` will be displayed in the gallery.

For each non-header/non-logo image, a thumbnail will be automatically generated during the build process. If you don't want to use the thumbnails, you can disable them with the `--ignore-thumbnails` option of `presskit build`. However, we do not recommend this: it might drastically increase the size of your pages. It can be a massive change: for example, on our presskit, one of our page has gone from 100mB to 4mB. We also convert gifs to small JPGs, that you can animate with a click.

#### Logos

You can provide multiple logos for a page. As long as they start with "logo", they will be displayed in the "Logo & Icon" section.

This will work, for example:

```
📄 logo01.png
📄 logo02.png
📄 logo03.jpg
```

#### Categories

Inside the `images/` folder, you can sort images by categories. It's simple: put a few images into a subfolder (like `images/wallpapers/`), and a new category will be automatically added to the gallery.

[You can find an example here.](http://pixelnest.io/presskit.html/example/product/#gallery-wallpapers)

#### Favicon

If a `favicon.ico` is found in the `images/` folder of a `data.xml`, it will be used as the favicon of this HTML page. It will not be exported in the `images.zip`, nor visible in the images gallery.

### Archives

**presskit.html** will find every images and logos in the `images/` folder of a `data.xml`. Then, it will create two archives: `images.zip` and `logo.zip`.

There's a small trick to know: if you provide one (or both) of these zips in your `images/` folder, **presskit.html** will just copy it directly, instead of overriding it. This is nice, because it allows you to provide a more complete (and heavy) zip. In this archive, you can, for example, put bigger gifs, images, artworks, or even videos.

That's purely optional, and most products or games won't need a specially crafted archive. 😉

## Migration Guide

This tool is almost a drop-in replacement for presskit() (well, except for the fact that it generates HTML instead of using a PHP back-end — but that's simpler, not harder). Which mean that you can go in your folder containing the `data.xml` and `images/`, run `presskit build` and boom, you're done.

_Well, almost._

We have made some breaking changes between this format and the original presskit() format. But be reassured: they are fairly small, and are, indeed, useful.

Follow the guide.

### URLs

This re-implementation of presskit() has a big difference: all your product URLs will break. With presskit(), you pointed to `/sheet.php?p=MYSUPERGAME` for the `MYSUPERGAME` page. Here, you will point to `/MYSUPERGAME/` directly (the `index.html` is not required, which makes prettier URLs).

**This can't be changed.** We don't use PHP, but simple, robust and lightweight HTML files, and this difference is inevitable.

### External URLs

presskit() didn't require the protocol (ie., `http` or `https`) for most URLs in the `data.xml`.

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

**This is recommended, but presskit.html is smart enough to detect the company `data.xml` automatically, if your file structure is correct.**

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

The original presskit() assumed that you had only one release date for a product or game. And we all know that it's simply not true.

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

### Contacts

In each `data.xml`, you can set a list of contacts:

```xml
<contacts>
  <contact>
    <name>Inquiries</name>
    <mail>contact@pizzaburger.studio</mail>
  </contact>
  <!-- Others -->
</contacts>
```

In presskit(), you needed to set these informations _only in the company page_. Each product then retrieved the values from the company and added them automatically.

We modified that: now, you **need** to set these informations everywhere. That way, you can change mails and links for each product individually.

---

## Pixelnest Studio

[Pixelnest Studio](http://pixelnest.io/) is a small indie company, creating games and apps. You can contact us on [Twitter at @pixelnest](https://twitter.com/pixelnest). Want to check our game, Steredenn? Go to http://steredenn.pixelnest.io/.

## Credits

### [presskit()][dopresskit]

This couldn't have be made without the awesome work of [Rami Ismail](https://twitter.com/tha_rami) and the [presskit()][dopresskit] team. Thanks to them!

### Assets

* The images used in this repository can be found on [Unsplash](https://unsplash.com/), a free provider of high-quality images.
* Pizza gif is from [Giphy](http://giphy.com/).


[dopresskit]: http://dopresskit.com
