import { BaseCommand } from '@baseCommands'
import stringsLang from '@stringsLang'
import { GuildConfig, PartialEmbed } from '@types'
import { openFile } from '@utils/files'
import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

export const commandData = new SlashCommandBuilder()
    .setName('about')
    .setDescription(stringsLang.aboutCommandDescription)

export default class AboutCommand extends BaseCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public execute (): void {
    if (!this.interaction.isCommand()) return

    const embed = this.mountAboutEmbed()
    this.send({ embeds: [embed] })
  }

  private mountAboutEmbed (): PartialEmbed {
    return {
      color: 0xFFFF00,
      title: ':robot: About Drift Bot',
      description: stringsLang.aboutText,
    }
  }
}
