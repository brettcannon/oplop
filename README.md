# Oplop

Generate account passwords based on a nickname and a master password.

## Implementations

* [Web](https://oplop.appspot.com)
* [Emacs](https://github.com/brettcannon/oplop/wiki/Instructions-For-Emacs)
* [SL4A](https://raw.github.com/brettcannon/oplop/master/SL4A/qr_code.png)
* [Command-line](https://pypi.python.org/pypi/Oplop)
* [J2ME](https://github.com/brettcannon/oplop/wiki/Oplop-For-J2ME)
* [webOS](http://developer.palm.com/webChannel/index.php?packageid=com.googlecode.oplop)
* [Perl](http://search.cpan.org/~mdom/Digest-Oplop/) (third-party)

[![Build Status](https://drone.io/github.com/brettcannon/oplop/status.png)](https://drone.io/github.com/brettcannon/oplop/latest) for web and command-line

## Help

* [+Oplop](https://plus.google.com/107738569015002517928/posts) on [Google+](https://plus.google.com/)
* [Help/wiki pages](https://github.com/brettcannon/oplop/wiki)
* [Issues](https://github.com/brettcannon/oplop/issues)


## How It Works

### A quick note about the robustness of Oplop

Oplop uses something called [MD5](http://en.wikipedia.org/wiki/MD5) which is no longer cutting edge security technology; the project has been in existence since 2004 it can't switch to the newest technology overnight without hurting current users and a lot of work. As such, if you are worried you might be personally targeted for attack by a person, government, etc. then you should consider using a stronger approach to generate your passwords.

If you would like to help move Oplop forward to use newer security technology then please consider
[helping out](https://github.com/brettcannon/oplop/issues/14).

### In Plain English

[Oplop](http://oplop.mobi) makes it easy to create unique passwords for every account you have. By using some math, Oplop only requires of you to remember a nickname and a master password to create a very safe and secure password just for you. You get to choose the nicknames you use for each of your accounts so they act as a mnemonic, letting you make sure they are memorable. And your master password you only have to choose once as you use it for every nickname you have (hence the "master" part). That means you can have safe and secure passwords for all of your accounts simply by remembering one master password and easy-to-remember nicknames for each of your accounts you use Oplop with.

For example, let's say I have an account at [Amazon](http://www.amazon.com) and another one at [Google](http://www.google.com). First I need to choose nicknames for these two accounts. A _nickname_ can be anything I want it to be, just as long as I can remember it. For Amazon I will choose the nickname `Amazon` and for Google I will choose `FizzBuzz`. What you choose for an nickname is entirely up to you; it is merely a mnemonic you have for the account so that you can easily recall it any time you need the password for that account. In technical terms the nickname acts as a _nonce_.

Next I need to choose a _master password_ that I will use with all of my nicknames. Let's say I choose the password `secret password`. If I go to [Oplop](https://oplop.appspot.com/) and enter in `Amazon` as my nickname and `secret password` I will get a unique account password to use at Amazon: `sar4_zIs`. If I enter `FizzBuzz` as my nickname and `secret password` as my master password (remember, you use the same master password for all of your accounts), I get `yyexMS5c` as my unique account password for Google.

Every time I use Oplop and enter the same information -- such as `Amazon` and `secret password` for my nickname and master password, respectively -- I will always get back the same unique _account password_ of `sar4_zIs`. The same regularity applies to my Google account.

And notice how random-looking those unique account passwords are? That's the math at work on your nickname and master password. Making the unique account passwords seem so random prevents people from guessing your password for each of your accounts. And even if someone manages to get your password for one account, you are still safe since Oplop makes a unique password for every nickname you use. Oplop also makes sure there is at least one digit and one letter in every unique account password in case a web site requires that sort of thing.

In those rare cases this is still not enough to appease the requirements for a password, I append a consistent set of extra characters which make your account password acceptable. So if you must have three capital letters and your account password doesn't have that, I would simply append ABC to the end of the account password, e.g., making the Amazon example password above as `sar4_zIsABC`. That way you still have the security and uniqueness of your account password while still meeting the requirement forced upon your password.

Thanks to all of this, the only thing you have to **really** keep secret is your master password. You can write your nicknames on a piece of paper you keep safely somewhere as long as you **never** tell anyone or write down your master password and make sure it is strong (i.e. complicated and could not be guessed by anyone who knows you).

To learn how to use Oplop itself and more details, such as choosing nicknames and a master password, read about [best practices](https://github.com/brettcannon/oplop/wiki/Best-Practices).

### Technical Details

Oplop is a password hashing algorithm. The steps it takes to generate an account password is:

  1. Concatenate the master password with the nickname (in that order!).
  2. Generate the [MD5](http://en.wikipedia.org/wiki/MD5) hash of the concatenated string.
  3. Convert the MD5 hash to URL-safe [Base64](http://en.wikipedia.org/wiki/Base_64).
  4. See if there are any digits in the first 8 characters. If no digits are found ...
    1. Search for the first uninterrupted substring of digits.
    2. If a substring of digits is found, prepend them to the Base64 string.
    3. If no substring is found, prepend a `1`.
  5. Use the first 8 characters as the account password.

The Python implementation is considered the canonical implementation of the algorithm.

These steps guarantee that the account password is always at least alphanumeric, if not alphanumeric with `-` and/or `_` characters (this is _technically_ incorrect as there is a 0.0000004% chance the account password will be numeric-only, but that is obviously a **very** rare occurrence so it's not a possibility that Oplop guards against). It also guarantees the account password is 8 characters which is typically a required length of passwords.

You do not need to worry about the use of MD5 as the hashing algorithm as compared to SHA-256 or some other hashing algorithm. You can read about MD5's weaknesses such as the [preimage and collision attacks](http://www.cryptography.com/cnews/hash.html) if you want, but remember that MD5 is being used more for a consistent randomness factor than for its cryptographic strength. It does not matter if someone has the same unique account password for a completely different pairing of nickname and master password. The important thing is someone cannot work backwards from an account password to your master password.

It must also be realized that Oplop is designed to run anywhere -- including in a web browsers on a mobile phone -- which restricts the number of rounds that can be used. While it would be technically safer to use several MD5 rounds (as [should be used on servers storing passwords](http://chargen.matasano.com/chargen/2007/9/7/enough-with-the-rainbow-tables-what-you-need-to-know-about-s.html)), Oplop does not have that luxury for performance reasons; a mobile phone cannot run MD5 thousands of times very quickly.

You can read more about what Oplop does (not) protect against in its [threat model](https://github.com/brettcannon/oplop/wiki/Threat-Model).
