import { FinderCommand } from '@baseCommands'
import { RecipesManager } from '@managers'
import str from '@stringsLang'
import { GuildConfig, PartialEmbed, Recipe } from '@types'
import { Interaction } from 'discord.js'
import mappings from '@utils/mappings'
const { rarityMap } = mappings
import { SlashCommandBuilder } from '@discordjs/builders'
import { addStringOptionWithRarityChoices } from '@utils/registerCommands'

export const commandData = () => {
  const builder = new SlashCommandBuilder()
  builder
    .setName('recipe')
    .setDescription(str.recipeCommandDescription)
    .addStringOption(option => option.setName('name').setDescription(str.recipeNameCommandOptionDescription).setRequired(true))
    .addNumberOption(option => option.setName('level').setDescription(str.recipeLevelCommandOptionDescription))
  addStringOptionWithRarityChoices(builder, 'rarity', str.recipeRarityCommandOptionDescription)
  return builder
}

export default class RecipeCommand extends FinderCommand {
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

    const results = RecipesManager.findRecipeByName(name, options)
    if (!results.length) {
      this.returnNotFound()
      return
    }

    const recipeEmbed = this.mountRecipeEmbed(results)
    this.send({ embeds: [recipeEmbed] })
  }

  private mountRecipeEmbed (results: Recipe[]): PartialEmbed {
    const firstRecipe = results[0]
    const recipeRarity = firstRecipe?.rarity?.toLowerCase()
    const isEquipment = Boolean(recipeRarity)
    const imageUrl = isEquipment ? `https://ez.community/images/items/equipment/${firstRecipe.name}-${firstRecipe.rarity}.png` : `https://ez.community/images/items/consumable/${firstRecipe.name}.png`
    const rarityEmoji = recipeRarity ? `${rarityMap[recipeRarity].emoji} ` : ''
    const embedColor = recipeRarity ? rarityMap[recipeRarity].color : 0xBCC0C0
    const embed: PartialEmbed = {
      color: embedColor,
      title: `${rarityEmoji}${str.capitalize(str.recipe)}: ${firstRecipe.name}`,
      thumbnail: { url: imageUrl.replace(/\s/g, '%20')},
      fields: RecipesManager.getRecipeFields(results)
    }
  
    if (results.length > 1) {
      const moreRecipesText = this.getTruncatedResults(results, 20, false, true)
      embed.footer = {
        text: `${str.capitalize(str.recipesFound)}: ${moreRecipesText}`
      }
    }
    return embed
  }
}
