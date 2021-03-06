import { CommandInteraction, Interaction, Message, MessageOptions } from 'discord.js'
import { GuildConfig, PartialEmbed } from '@types'
import commandsHelp from '@utils/helpMessages'
import { handleInteractionError } from '@utils/handleError'
import stringsLang from '@stringsLang'

export default abstract class BaseCommand {
  protected guildConfig: GuildConfig
  protected interaction: Interaction
  protected commandWord: string

  constructor (interaction: Interaction|null, guildConfig: GuildConfig) {
    this.guildConfig = guildConfig
    this.interaction = interaction
    this.commandWord = interaction?.isCommand() ? interaction.commandName : '' 
  }

  protected async send (content: MessageOptions | string): Promise<Message> {
    try {
      const interaction = this.interaction as CommandInteraction
      const messageContent = typeof content === 'string' ? { content } : content
      const sentContent = await interaction.reply({...messageContent, fetchReply: true })
      return sentContent as Message
    } catch (error) {
      handleInteractionError(error, this.interaction)
    }
  }

  protected async sendHelp (command): Promise<Message> {
    const helpEmbed = this.mountCommandHelpEmbed(command)
    return this.send({ embeds: [helpEmbed] })
  }

  private mountCommandHelpEmbed (command): PartialEmbed {
    const commandWord = command || this.commandWord
    const commandsListText = Object.keys(commandsHelp).filter(cmd => cmd !== 'default').map(command => `\`${command}\``).join(', ')
    const commandHelp = commandsHelp[commandWord]
    return {
      color: 0xBCC0C0,
      title: `:grey_question: Help: \`/help ${commandsHelp[commandWord] ? commandWord : ''}\``,
      description: commandHelp.help,
      fields: [
        {
          name: stringsLang.examples,
          value: commandHelp.examples.map(example => `\`${example}\``).join('\n'),
          inline: false
        },
        {
          name: stringsLang.availableCommands,
          value: commandsListText,
          inline: false
        }
      ]
    }
  }
}
