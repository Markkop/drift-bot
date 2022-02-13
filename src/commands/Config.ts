import { BaseCommand } from '@baseCommands'
import { ConfigManager } from '@managers'
import { GuildConfig } from '@types'
import { Interaction, Permissions } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import str from '@stringsLang'

export const commandData = new SlashCommandBuilder()
  .setName('config')
  .setDescription(str.configCommandDescription)
  .addSubcommand(subcommand =>
		subcommand
			.setName('get')
			.setDescription(str.getConfigCommandDescription))
	.addSubcommand(subcommand => {
		subcommand
			.setName('set')
			.setDescription(str.setConfigCommandDescription)
      .addChannelOption(option => option.setName('party-channel').setDescription(str.partyChannelConfigCommandOptionDescription))
    return subcommand
  })

export default class ConfigCommand extends BaseCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public async execute (): Promise<void> {
    if (!this.interaction.isCommand()) return

    const guildId = String(this.interaction.guild.id)
    if (this.interaction.options.getSubcommand() === 'set') {
      const userPermissions = this.interaction.member.permissions as Permissions
      if (!userPermissions.has(Permissions.ALL)) {
        this.send('You need administrator permission for this')
        return 
      }
      
      const configManager = ConfigManager.getInstance()
      const currentConfig = configManager.getGuildConfig(guildId)
      
      const partyChannel = this.interaction.options.getChannel('party-channel')

      if(!partyChannel) {
        this.send('At least one option is required')
        return
      }

      const newConfig = {
        id: guildId,
        partyChannel: partyChannel?.name || currentConfig.partyChannel,
      }

      await configManager.updateGuildConfig(newConfig)
      const configEmbed = this.mountConfigEmbed('Config updated', newConfig)
      await this.send({ embeds: [configEmbed] })
      return
    }

    const configManager = ConfigManager.getInstance()
    const currentConfig = configManager.getGuildConfig(guildId)
    if (!currentConfig) {
      const configEmbed = this.mountConfigEmbed('No custom config found. Using default', ConfigManager.getDefaultConfig())
      this.send({ embeds: [configEmbed] })
      return
    }
    const configEmbed = this.mountConfigEmbed(`Config for "${this.interaction.guild.name}"`, currentConfig)
    this.send({ embeds: [configEmbed] })
    return
  }

  private mountConfigEmbed (title, config) {
    const guildConfigText = JSON.stringify(config, null, 2)
    return {
      title,
      description: '```json\n' + guildConfigText + '\n```'
    }
  }
}
