import { BaseCommand } from '@baseCommands'
import str from '@stringsLang'
import { Interaction } from 'discord.js'
import { GuildConfig, PartialEmbed } from '@types'

export default class FinderCommand extends BaseCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  private mountNotFoundEmbed (): PartialEmbed {
    return {
      color: 0xbb1327,
      title: `:x: ${str.capitalize('No results')}`,
      description: str.capitalize(`Use \`/help command: ${this.commandWord}\` to see some examples of how to search`)
    }
  }

  protected returnNotFound () {
    const notFoundEmbed = this.mountNotFoundEmbed()
    return this.send({ embeds: [notFoundEmbed] })
  }

  protected getTruncatedResults (results, resultsLimit: number, showRarity = false, showLevel = false) {
    let moreResultsText = ''
    if (results.length > resultsLimit) {
      const firstResults = results.slice(0, resultsLimit)
      const otherResults = results.slice(resultsLimit, results.length)
      moreResultsText = ` ${str.andOther} ${otherResults.length} ${str.results}`
      results = firstResults
    }
    return results.map(item => {
      const rarityText = showRarity ? ` (${item.rarity})` : ''
      const levelText = showLevel ? ` [${item.level}]` : ''
      return `${item.name}${levelText}${rarityText}`
    }).join(', ').trim() + moreResultsText
  }
}
