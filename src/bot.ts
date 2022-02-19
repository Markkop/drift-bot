import 'module-alias/register'
require('dotenv').config()
import { Client, Interaction, MessageReaction, User, Intents, Guild } from 'discord.js'
import { handleInteractionError, handleReactionError } from './utils/handleError'
import { ConfigManager } from '@managers'
import ReactionService from './services/ReactionService'
import {
  EquipCommand,
  AboutCommand,
  RecipeCommand,
  PartyCreateCommand,
  PartyUpdateCommand,
  HelpCommand,
  ConfigCommand,
  PerksCommand
} from '@commands'
import { GuildConfig } from '@types'
import { saveServersNumber } from '@utils/serversNumber'
import { registerCommands } from '@utils/registerCommands'

const commandsMap = {
  equip: EquipCommand,
  about: AboutCommand,
  recipe: RecipeCommand,
  'party-create': PartyCreateCommand,
  'party-update': PartyUpdateCommand,
  help: HelpCommand,
  config: ConfigCommand,
  perks: PerksCommand
}

class Bot {
  private client: Client
  private token: string
  private configManager: ConfigManager

  constructor(client: Client, token: string, configManager: ConfigManager) {
    this.client = client
    this.token = token
    this.configManager = configManager
  }

  public listen(): void {
    this.client.on('interactionCreate', this.onInteractionCreate.bind(this))
    this.client.on('ready', this.onReady.bind(this))
    this.client.on('messageReactionAdd', this.onMessageReactionAdd.bind(this))
    this.client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this))
    this.client.on('guildCreate', this.onGuildCreate.bind(this))

    this.client.login(this.token)
  }

  private onReady() {
    const servers = this.client.guilds.cache.size
    console.log(`Online on ${servers} servers: ${this.client.guilds.cache.map(guild => guild.name).join(', ')}`)
    this.client.user.setActivity('/about or /help', { type: 'PLAYING' })
    saveServersNumber(servers)
    this.registerCommandsAfterLoadingConfigs()
  }

  private onGuildCreate(guild: Guild) {
    registerCommands(this.client, guild.id, guild.name)
    console.log(`Just joined on ${guild.name} and registered slash commands!`)
  }

  private registerCommandsAfterLoadingConfigs() {
    const interval = setInterval(() => {
      if (!this.configManager.hasLoadedConfigs) return
      clearInterval(interval)
      this.client.guilds.cache.forEach(guild => {
        registerCommands(this.client, guild.id, guild.name)
      })
      console.log("Slash commands registered!");
    }, 1000)
  }

  private async onInteractionCreate(interaction: Interaction) {
    try {
      if (!interaction.isCommand()) return;

      const commandName = interaction.commandName
      const Command = this.getCommand(commandName)

      if (!Command) return;

      const guildConfig = this.configManager.getGuildConfig(interaction.guildId)

      const CommandClass = new Command(interaction, guildConfig)
      await CommandClass.execute()
    } catch (error) {
      handleInteractionError(error, interaction)
    }
  }

  private async onMessageReactionAdd(reaction: MessageReaction, user: User) {
    try {
      const guildConfig = this.configManager.getGuildConfig(reaction.message.guild.id)
      ReactionService.handleReactionAdd(reaction, user, guildConfig as GuildConfig)
    } catch (error) {
      handleReactionError(error, reaction, user)
    }
  }

  private async onMessageReactionRemove(reaction: MessageReaction, user: User) {
    try {
      const guildConfig = this.configManager.getGuildConfig(reaction.message.guild.id)
      ReactionService.handleReactionRemove(reaction, user, guildConfig as GuildConfig)
    } catch (error) {
      handleReactionError(error, reaction, user)
    }
  }

  private getCommand(commandWord: string) {
    return commandsMap[commandWord]
  }
}

export default function initiateBot() {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGES],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
  })
  const configManager = ConfigManager.getInstance()
  const token = process.env.DISCORD_BOT_TOKEN

  const bot = new Bot(client, token, configManager)
  bot.listen()
}

initiateBot()

