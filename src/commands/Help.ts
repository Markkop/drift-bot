import { BaseCommand } from '@baseCommands'
import stringsLang from '@stringsLang'
import { GuildConfig } from '@types'
import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import helpMessages from '@utils/helpMessages'

export const commandData = new SlashCommandBuilder()
  .setName('help')
  .setDescription(stringsLang.helpCommandDescription)
  .addStringOption(option => {
    option.setName('command')
      .setDescription(stringsLang.commandOptionHelpCommandDescription)
      .setRequired(true)
    Object.keys(helpMessages).forEach(command => {
      option.addChoice(command, command)
    })
    return option
  })


export default class HelpCommand extends BaseCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public execute (): void {
    if (!this.interaction.isCommand()) return
    const command = this.interaction.options.getString('command')

    this.sendHelp(command)
  }
}
