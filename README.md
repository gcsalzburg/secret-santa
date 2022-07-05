# 🎅 Secret Secret Santa Generator

>
> **Try it here:** https://play.interactionmagic.com/secret-santa/
>

What's wrong with most Secret Santa list generators online?

+ They aren't very secret, you have to give everyone's email addresses to the system
+ You might not know everyone's email addresses
+ The emails probably go to some people's spam folders

This is a secret santa generator for the modern era, where its more important to keep things secret from the internet, not your friends (See below).

## How it works

+ The website generates you a unique link that contains a base64 encoding of all the names + a pairing scheme
+ When your friends click on the link, they can enter their name to see who they have to buy for
+ `localStorage` is used to prevent people entering lots of different names and checking who everyone is buying for (see below)
+ Because all the data is contained in the link, it is private and is not logged by this website or in any database

### But is it secret?

What do we mean by secret?

Expand...

## Todo

+ Add checksum to the data to ensure link doesn't get truncated when sharing
