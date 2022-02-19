# :robot: Drift Bot

[![build](https://github.com/Markkop/drift-bot/actions/workflows/production.yml/badge.svg)](https://github.com/Markkop/drift-bot/actions/workflows/production.yml)
[![servers](https://img.shields.io/endpoint?url=https://mark-nest.herokuapp.com/api/drift-bot-servers)](https://discord.com/api/oauth2/authorize?client_id=942472521725407302&permissions=1342565456&scope=bot)
![Repo status](https://www.repostatus.org/badges/latest/active.svg)
![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)

Drift is a [Discord Bot](https://discord.js.org/#/) that provides information about the [Zenith VR MMORPG](https://zenithmmo.com/) game.

Most of the data is currently obtained from [EZ's Website](https://ez.community/)  
Equipment Perk data is being retrived from [ZenithMMO Fandom Wiki](https://zenithmmo.fandom.com/wiki/Equipment_Perks)  

If you wish to **add this bot** to your server, access this [link](https://discord.com/api/oauth2/authorize?client_id=942472521725407302&permissions=139586825280&scope=bot%20applications.commands).  

If you need help or want to report bugs, feel free to **join the bot's discord**: https://discord.gg/qtATGySSQ4

To keep the bot running, please consider [donating](https://www.buymeacoffee.com/markkop) `<3`

## Commands

* `/recipe`: search for recipes by name and rarity
* `/equip`: search for equipment by name and rarity
* `/perks`: list or search for equipment perks by name
* `/party`: create, update, join or leave a party listing
* `/about`: get information about this bot
* `/config`: configure custom settings for each discord channel
* `/help`: get help for available commands

## Features 

### 👥 Party Listing

When using `/party-create` command, the bot create a new party list and it'll post it on the cannel defined by the `/config` command (`party-listing` by default).  
It'll also listen to reactions so members can join or leave groups.  
To make use of this feature, make sure that the bot has enough permissions to the configured channel.  

**Examples**:
```bash
/party-create name: Cooking contest
/party-create name: Pirate King description: If it's your first time, it's okay date: Tomorrow 8PM level: 40 slots: 10
/party-update id: 20 date: 02/04/2020
```

![image](https://user-images.githubusercontent.com/16388408/153883093-dde0b40b-47b5-4910-9de7-34ff6b907e3d.png)


### 🛡 Equipment search

An equipment search is available with `/equip` command.  
It's also possible to filter them by level and rarity.

**Examples**:
```bash
/equip name: galian
/equip name: hardened rarity: unique
```

![image](https://user-images.githubusercontent.com/16388408/153883275-1e8296ba-a795-44cc-a4d6-b1efb9d12327.png)

### 🧧 Perks list and search

List or search for equipment perk by name

**Examples**:
```bash
/perks list
/perks search name: warlock
```

![image](https://user-images.githubusercontent.com/16388408/154810208-843741ab-e738-400c-bddf-fac9f71abc54.png)


### 📜 Recipe search

Similar to the commands above, you can search for crafting recipes by name, rarity and level.  

**Examples**:
```bash
/recipe name: noodles
/recipe name: hard rarity: unique
```

![image](https://user-images.githubusercontent.com/16388408/153883445-2866815d-49d7-4415-8ed8-2f04ccee2303.png)

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
