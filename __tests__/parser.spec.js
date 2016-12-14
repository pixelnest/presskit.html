'use strict'

const parser = require('../lib/parser')

const templateGamePresskitXML = '<?xml version="1.0" encoding="UTF-8"?><product><title>My Super Game</title><release-date>04 Feb, 2016</release-date><website>http://pizzaburger.studio/mysupergame</website><!-- true or false --><press-can-request-copy>true</press-can-request-copy><platforms><platform><name>PC / Mac</name><link>http://itch.io/</link></platform><platform><name>Steam</name><link>http://steampowered.com/</link></platform></platforms><prices><price><currency>EUR</currency><value>€20</value></price><price><currency>USD</currency><value>$20</value></price><price><currency>GBP</currency><value>£16</value></price><price><currency>JPY</currency><value>¥2300</value></price></prices><description>Here goes a quick description of your game. Be concise and explain in very few words the gameplay and why it\'s really cool and why everyone should play it.</description><history>Add some storytelling here. Not the scenario of your game but rather some background of the creation process: why are you making this game? Most projects starts with a cool story.</history><features><feature>List some "Key Sellings Points" to grab player\'s attention.</feature><feature>Don\'t be too generic ("pixel art graphics!"), don\'t be too pretentious ("most incredible game experience!").</feature><feature>Also, people like numbers, so you can add some (450 weapons, hundreds of levels, dozens of hours of playtime!)</feature><feature>Need ideas? Maybe explain some game modes?</feature><feature>It would be a nice place to say something about multiplayer, if you have some.</feature><feature>Have you translated your game? (You probably should btw.)</feature></features><trailers><trailer><name>Official Trailer</name><youtube>EtXajayBLzw</youtube><vimeo>189815199</vimeo></trailer><trailer><name>Gameplay Video #2</name><youtube>EPNK1j3TMjU</youtube><vimeo>189815199</vimeo></trailer><trailer><name>Gameplay Video #1</name><youtube>EPNK1j3TMjU</youtube><vimeo>189815199</vimeo></trailer></trailers><awards><award><description>Game of the year without a doubt.</description><info>Saint-Père-Marc-En-Poulet (France), 04 February, 2016</info></award><award><description>Best soundtrack.</description><info>A great game festival (World), 01 October, 2015</info></award><award><description>Best MYGAMENGINE game.</description><info>Deep into the woods (Forest), 31 March, 2014</info></award></awards><quotes><quote><description>This is my favorite game of all time.</description><name>Mum</name><website>At home</website><link>http://at.home/</link></quote><quote><description>A very serious quote you\'re very proud of by someone you respect.</description><name>Master</name><website>Master\'s website</website><link>http://mast.er/</link></quote><quote><description>10/10 would play it again and again.</description><name>A friendly anonymous Steam reviewer</name><website>Steam review</website><link>http://steam.review/</link></quote></quotes><additionals><additional><title>Original Soundtrack (OST)</title><description>Composed by an awesome musician. Listen for free, download for $3 at</description><link>http://zandernoriega.bandcamp.com/album/steredenn-original-soundtrack</link></additional><additional><title>Release announcement</title><description>Announcement are exciting, so we usually make blog posts or news about it on</description><link>http://pixelnest.io/journal/</link></additional></additionals><credits><credit><person>Krokmou</person><role>Bot Leader, Game Designer, Pixelnest Studio</role></credit><credit><person>Hiccup</person><role>Developer, Pixelnest Studio</role></credit><credit><person>Astrid</person><website>http://www.astridsupergame.com</website><role>Musician, Freelancer</role></credit></credits></product>'
const templateCompanyPresskitXML = '<?xml version="1.0" encoding="UTF-8"?><company><title>Pizza Burger Studio</title><based-in>Paris, France</based-in><founding-date>February 6, 2014</founding-date><website>http://pizzaburger.studio/</website><press-contact>contact@pizzaburger.studio</press-contact><press-can-request-copy>true</press-can-request-copy><monetization-permission>monetize</monetization-permission><phone>+42 (3) 42 42 42 42 42</phone><address><line>42, invisible lane</line><line>35000 Rennes</line><line>France</line></address><socials><social><name>twitter.com/pizzaburgerstudio</name><link>twitter.com/pizzaburgerstudio</link></social><social><name>facebook.com/pizzaburgerstudio</name><link>facebook.com/pizzaburgerstudio</link></social><social><name>Skype</name><link>callto:pizzaburgerstudio</link></social></socials><description>What is your company? What are you doing?</description><histories><history><header>Beginning</header><text>Tell your story.</text></history><history><header>Now</header><text>More to tell? Use multiple history block.</text></history></histories><trailers><trailer><name>Example from YouTube. Don\'t give a full link: the ID is enough</name><youtube>er416Ad3R1g</youtube></trailer><trailer><name>Example from both YouTube and Vimeo</name><youtube>YH3c1QZzRK4</youtube><vimeo>108650530</vimeo></trailer></trailers><awards><award><description>An award.</description><info>Name, location, 29 April, 1988</info></award><award><description>A nomination.</description><info>Name, location, 03 October, 1988</info></award></awards><quotes><quote><description>There\'s not enough pizza in your life. It\'s never enough.</description><name>@mrhelmut</name><website>Tweet</website><link>https://twitter.com/mrhelmut/status/717276362814447616</link></quote></quotes><additionals><additional><title>Patricia Pizza Twitter</title><description>@patpiz at</description><link>https://twitter.com/patpiz</link></additional><additional><title>Bob Burger Twitter</title><description>@bobburg at</description><link>https://twitter.com/bobburg</link></additional></additionals><credits><credit><person>Patricia Pizza</person><role>Founder, Developer, Pizza Burger Studio</role></credit><credit><person>Bob Burger</person><role>Founder, Designer, Pizza Burger Studio</role></credit><credit><person>Jake Burgza</person><website>www.jakeburgza.com</website><role>Artist, Collaborator</role></credit><credit><person>Sophia Pizer</person><website>www.sophiapizer.com</website><role>Musician, Collaborator</role></credit></credits><contacts><contact><name>Inquiries</name><mail>contact@pizzaburger.studio</mail></contact><contact><name>Twitter</name><link>https://twitter.com/pizzaburgerstudio</link></contact><contact><name>Facebook</name><link>https://facebook.com/pizzaburgerstudio</link></contact><contact><name>Web</name><link>pizzaburger.studio</link></contact></contacts></company>'

it('handles undefined XML strings', () => {
  parser.convert(undefined, function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles null XML strings', () => {
  parser.convert(null, function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles empty XML strings', () => {
  parser.convert('', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles invalid XML strings', () => {
  parser.convert('Test. This is not XML', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles incompleted XML strings', () => {
  parser.convert('<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew'
  , function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles valid XML strings but invalid presskit data', () => {
  parser.convert('<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book></catalog>'
  , function (err, data) {
    expect(data).toBeUndefined()
    expect(err).toBeDefined()
  })
})

it('handles valid XML company presskit string', () => {
  parser.convert(templateCompanyPresskitXML, function (err, data) {
    expect(err).toBeNull()
    expect(data.type).toBe('company')
    expect(data.title).toBeDefined()
    expect(data.description).toBeDefined()
  })
})

it('handles valid XML game presskit string', () => {
  parser.convert(templateGamePresskitXML, function (err, data) {
    expect(err).toBeNull()
    expect(data.type).toBe('product')
    expect(data.title).toBeDefined()
    expect(data.description).toBeDefined()
  })
})
