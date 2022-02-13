import { FinderCommand } from '@baseCommands'
import { ItemManager } from '@managers'
import str from '@stringsLang'
import { GuildConfig, PartialEmbed } from '@types'
import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { addStringOptionWithRarityChoices } from '@utils/registerCommands'
import mappings from '@utils/mappings'
const { rarityMap } = mappings

export const commandData = () => {
  const builder = new SlashCommandBuilder()
  builder
    .setName('equip')
    .setDescription(str.equipCommandDescription)
    .addStringOption(option => option.setName('name').setDescription(str.equipNameCommandOptionDescription).setRequired(true))
    .addNumberOption(option => option.setName('level').setDescription(str.equipLevelCommandOptionDescription))
  addStringOptionWithRarityChoices(builder, 'rarity', 'The rarity of the equipment')
  return builder
}

export default class EquipCommand extends FinderCommand {
  constructor (interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public async execute (): Promise<void> {
    if (!this.interaction.isCommand()) return
    const rarity = this.interaction.options.getString('rarity')
    const name = this.interaction.options.getString('name')
    const level = this.interaction.options.getNumber('level')

    const options = {
      rarityName: rarity,
      level
    }

    const results = ItemManager.getEquipmentByName(name, options)
    if (!results.length) {
      this.returnNotFound()
      return
    }

    const equipEmbed = this.mountEquipEmbed(results)
    const sentMessage = await this.send({ embeds: [equipEmbed] })

    // TO DO: Waiting for a better way to get item ids before dynamically getting their recipes
    // const reactions = []
    // const recipes = RecipesManager.findRecipeByName(results[0].name, options)
    // if (recipes.length) {
    //   reactions.unshift('🛠️')
    // }
    // await MessageManager.reactToMessage(reactions, sentMessage)
  }

  private mountEquipEmbed (results): PartialEmbed {
    const firstResult = results[0]
    const image = `https://ez.community/images/items/equipment/${firstResult.name}-${firstResult.rarity}.png`
    const equipEmbed: PartialEmbed = {
      color: rarityMap[firstResult.rarity.toLowerCase()].color,
      title: `${rarityMap[firstResult.rarity.toLowerCase()].emoji} ${firstResult.name}`,
      thumbnail: { url: image.replace(/\s/g, '%20')},
      fields: [
        {
          name: str.capitalize(str.level),
          value: firstResult.level,
          inline: true
        },
        {
          name: str.capitalize(str.slot),
          value: str.capitalize(firstResult.slot),
          inline: true
        },
        {
          name: str.capitalize(str.rarity),
          value: str.capitalize(firstResult.rarity),
          inline: true
        }
      ]
    }

    const stats = Object.entries(firstResult.stats)
    if (stats.length) {
      equipEmbed.fields.push({
        name: str.capitalize(str.stats),
        value: stats.map(([ key, value ]) => `${key}: ${value}`).join('\n'),
        inline: false
      })
    }

    const perks = firstResult.perks
    if (perks.length) {
      equipEmbed.fields.push({
        name: str.capitalize(str.perks),
        value: perks.join('\n'),
        inline: false
      })
    }

    const equipamentsFoundText = this.getTruncatedResults(results, 20, true, true)
    if (results.length > 1) {
      equipEmbed.footer = {
        text: `${str.capitalize(str.equipmentFound)}: ${equipamentsFoundText}`
      }
    }
    return equipEmbed
  }
}
