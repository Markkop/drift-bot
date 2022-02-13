# :robot: Drift Bot

[![build](https://github.com/Markkop/drift-bot/actions/workflows/production.yml/badge.svg)](https://github.com/Markkop/drift-bot/actions/workflows/production.yml)
![Repo status](https://www.repostatus.org/badges/latest/active.svg)
![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)

Drift is a [Discord Bot](https://discord.js.org/#/) that provides information about the [Zenith VR MMORPG](https://zenithmmo.com/) game.

If you wish to **add this bot** to your server, access this [link](https://discord.com/api/oauth2/authorize?client_id=942472521725407302&permissions=139586825280&scope=bot%20applications.commands).  

If you need help or want to report bugs, feel free to **join the bot's discord**: https://discord.gg/qtATGySSQ4

To keep the bot running, please consider [donating](https://www.buymeacoffee.com/markkop) `<3`

## Commands

* `/recipe`: search for recipes by name and rarity
* `/equip`: search for equipment by name and rarity
* `/party`: create, update, join or leave a party listing
* `/about`: get information about this bot
* `/config`: configure custom settings for each discord channel
* `/help`: get help for available commands

## Features 


### 👥 Party Listing

When using `/party create` command, the bot will guide you through creating a new party list and it'll post it on the cannel defined by the `/config` command (`party-listing` by default).  
It'll also listen to reactions so members can join or leave groups.  
To make use of this feature, make sure that the bot has enough permissions to the configured channel.  

**Examples**:
```bash
.party create
.party update
```


### 🛡 Equipment search

An equipment search is available with `/equip <name>` command.  
It's also possible to filter them by rarity.
If a recipe is associated, it can be displayed by reacting with 🛠️  

**Examples**:
```bash
/equip name: galian
/equip name: hardened rarity: unique
```

### 📜 Recipe search

Similar to the commands above, you can search for recipes by name and rarity.  
Recipes with same results are shown together.  

**Examples**:
```bash
.recipe brakmar sword
.recipe espada de brakmar lang=pt
.recipe peace pipe rarity=mythical
```

![image](https://user-images.githubusercontent.com/16388408/134066195-1496574c-d92e-4ea3-929c-bbcbc7395e25.png)

### ⚙️ Configurable options

Some bot options can be configurable according to each server using `/config`/.  
**Options**:
* partyChannel: channel to receive the `/party` command (default: `party-listing`)

**Examples**:
```bash
/config get
/config set party-channel: #party-listing
```


## 📈 How to contribute

Feel free to open a [Pull Request](https://github.com/Markkop/drift-bot/pulls) to this project.  
In case you just want to report a bug or submit a suggestion, join us in the bot's [Discord server](https://discord.gg/qtATGySSQ4).


```
# Install system dependencies
sudo apt install nodejs npm git

# Clone this repository
git clone https://github.com/Markkop/drift-bot.git

# Install project dependencies
cd drift-bot
npm install

# Setup environment variables
cp .env.example .env

# Create a Discord bot and set it's DISCORD_BOT_TOKEN for local testing

# After coding, run tests and lint
npm run test
npm run lint

# Create a new branch and push it to make a Pull Request
git checkout -b <branch name>
git add .
git commit -m "<commit name>"
git push origin <branch name>

# Deploy is made automatically on master via Github Actions to Heroku
```
