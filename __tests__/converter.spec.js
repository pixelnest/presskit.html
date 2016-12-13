'use strict'

const converter = require('../lib/converter')
const templateDoPresskitXML = '<?xml version="1.0" encoding="UTF-8"?>\n<game><title>Game Name</title><release-date>1 May, 2012</release-date><website>http://www.gamesite.com/</website><press-can-request-copy>TRUE</press-can-request-copy><platforms><platform><name>PC / Mac</name><link>http://www.gamesite.com/</link></platform><platform><name>Steam</name><link>http://www.steampowered.com/</link></platform><platform><name>Apple App Store</name><link>http://www.itunes.com/</link></platform></platforms><prices><price><currency>USD</currency><value>$1.99</value></price><price><currency>EUR</currency><value>€1.59</value></price><price><currency>CAD</currency><value>$1.99</value></price><price><currency>GBP</currency><value>£1.29</value></price></prices><description>Hello. This is a short compilation of facts about the game. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</description><history>Since we\'re an indie developer, we want a history to our game. This paragraph will explain this history in short. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</history><features><feature>Includes something really interesting about the game which players will love.</feature><feature>This feature line is about the 8-bit pixels that are no doubt featuring in this game.</feature><feature>Since it is unlikely that the audio isn\'t fucking amazing, say something about the audio, maybe?</feature><feature>Make sure to stress that everything about this game is absolutely fabulous.</feature><feature>Something to wrap up this 5-point feature list with a nice ring to it.</feature></features><trailers><trailer><name>Trailer</name><youtube>7jQbITg0MSk</youtube><vimeo>23571681</vimeo></trailer><trailer><name>Gameplay Video</name><youtube>7jQbITg0MSk</youtube><vimeo>23571681</vimeo></trailer></trailers><awards><award><description>Winner in this highly relevant contest.</description><info>Award Location, 20 October, 1989</info></award><award><description>Nomination for this prestigious award.</description><info>Award Ceremony, 4 December, 1991</info></award><award><description>Winner in this highly relevant contest.</description><info>Award Location, 20 October, 1989</info></award><award><description>Nomination for this prestigious award.</description><info>Award Ceremony, 4 December, 1991</info></award></awards><quotes><quote><description>This is a rather insignificant quote by a highly important person.</description><name>Person Name</name><website>Website</website><link>http://</link></quote><quote><description>An extremely positive quote from a rather insignificant person. Also great.</description><name>Some Guy</name><website>This Page Is Visited By 12 Visitors A Month</website><link>http://</link></quote><quote><description>I pretend to love this game even though I do not actually understand it.</description><name>Pretentious Bastard</name><website>Artsy Page</website><link>http://</link></quote><quote><description>HOLY SHIT SO AMAZING</description><name>Caps Guy</name><website>Angry Review</website><link>http://</link></quote></quotes><additionals><additional><title>Original Soundtrack</title><description>Available for free from</description><link>http://somemusicsite.com/thislink</link></additional><additional><title>Release Blog Post</title><description>The blog-post through which this game was released is available at</description><link>http://vlambeer.com/bloglink</link></additional></additionals><credits><credit><person>Rami Ismail</person><role>Business &amp; Development, Vlambeer</role></credit><credit><person>Jan Willem Nijman</person><role>Game Designer, Vlambeer</role></credit><credit><person>John Doe</person><role>Artist, Freelancer</role></credit><credit><person>Oliver Twist</person><website>www.olivertwist.com</website><role>Artist, Freelancer</role></credit><credit><person>Jane Doette</person><website>www.olivertwist.com</website><role>Music, Freelancer</role></credit></credits></game>'

it('handles undefined XML strings', () => {
  converter.convert(undefined, function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles null XML strings', () => {
  converter.convert(null, function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles empty XML strings', () => {
  converter.convert('', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles invalid XML strings', () => {
  converter.convert('Test. This is not XML', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles incompleted XML strings', () => {
  converter.convert('<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew'
  , function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles valid XML strings but invalid presskit data', () => {
  converter.convert('<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book></catalog>'
  , function (err, data) {
    expect(data).toBeUndefined()
    expect(err).toBeDefined()
  })
})

it('handles valid XML presskit string', () => {
  converter.convert(templateDoPresskitXML, function (err, data) {
    expect(err).toBeNull()
    expect(data.title).toBeDefined()
    expect(data.description).toBeDefined()
  })
})
