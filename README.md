# 🎅 Secret Secret Santa Generator

>
> **Try it here:** https://play.interactionmagic.com/secret-santa/
>

![Animated gif of how it works](<https://play.interactionmagic.com/secret-santa/marketing-assets/secret-secret-santa-receiver.gif>)

What's wrong with most Secret Santa list generators online?

+ They aren't very secret, you have to give everyone's email addresses to the system
+ You might not know everyone's email addresses
+ The emails probably go to some people's spam folders

This is a secret santa generator for the modern era, where its more important to keep things secret from the internet, not your friends (See below).

## How it works

+ The website generates you a unique link that contains a base64 encoding of all the names + a pairing scheme
+ You can share that link how however you link (Whatsapp, Signal, email...)
+ When your friends click on the link, they can enter their name to see who they have to buy for
+ `localStorage` is used to prevent people entering lots of different names and checking who everyone is buying for (see below)
+ Because all the data is contained in the link, it is private and is not logged by this website or in any database

### But is it secret?

What do we mean by secret?

Most secret santa generators believe that the most important secret is who is buying for who (WB4W).

They are built to keep this super secret, using e-mail addresses/logins to authenticate who you are before you find out who you have to buy for. However, they do this at the expense of having you give up the e-mail addresses of your friends, along with useful secondary metadata (e.g. details of present preferences, knowledge of your social graph).

This secret santa generator flips the trade-off. The WB4W is a little less secure from curious friends (savvy users can disable the cache, use private browser windows etc). But your personal data is protected.

This site uses no trackers or analytics scripts. I have no idea if you are using it or not. If you find it useful, drop me an e-mail: george@interactionmagic.com!



## Todo

+ Add checksum to the data to ensure link doesn't get truncated when sharing
