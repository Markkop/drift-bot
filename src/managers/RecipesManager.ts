import { CommandOptions, CookingRecipe, Recipe } from '@types'
import str from '@stringsLang'
import { MessageManager, ItemManager } from '@managers'
import { hasTextOrNormalizedTextIncluded } from '@utils/strings'
const cookingRecipesData = require('../../data/raw/ez/cookingRecipes.json')
class RecipesManager {
  private recipes: Recipe[]

  constructor () {
    const equipmentRecipes = this.parseEquipmentToItsRecipe(cookingRecipesData)
    const cookingRecipes = this.parseCookingRecipes()
    this.recipes = [...equipmentRecipes, ...cookingRecipes]
  }

  private parseEquipmentToItsRecipe(recipesData: CookingRecipe[]): Recipe[] {
    return recipesData.map(cookingRecipe => {
      return {
        ...cookingRecipe,
        job: 'Cooking',
        instructions: cookingRecipe.directions,
      }
    })
  }

  private parseCookingRecipes(): Recipe[] {
    const equipment = ItemManager.getEquipmentList()
    return equipment.map(equip => {
      const ingredients = equip.components.map(component => ({
        count: Number(component.slice(0, component.indexOf(' '))),
        name: component.slice(component.indexOf(' ') + 1)
      }))

      return {
        name: equip.name,
        job: 'Synthesis',
        level: equip.level,
        rarity: equip.rarity,
        type: equip.slot,
        stats: equip.stats,
        perks: equip.perks,
        instructions: str.synthesisInstructions,
        ingredients,
        zen: equip.zen,
        location: equip.location
      }
    })
  }

  public findRecipeByName (name: string, options: CommandOptions) {
    return this.recipes.filter(recipe => {
      let filterAssertion = true
      const includeName = hasTextOrNormalizedTextIncluded(recipe.name, name)
      if (options.rarityName) {
        filterAssertion = filterAssertion && String(options.rarityName).toLowerCase() === recipe.rarity?.toLowerCase()
      }

      if (options.level) {
        filterAssertion = filterAssertion && String(options.level) === recipe.level
      }
      return includeName && filterAssertion
    })
  }

  public getRecipeFields (recipeResults: Recipe[]) {
    const firstRecipe = recipeResults[0]
    const fields = []

    if (firstRecipe.job) {
      fields.push({
        name: str.capitalize(str.job),
        value: String(firstRecipe.job),
        inline: true
      })
    }

    if (firstRecipe.type) {
      fields.push({
        name: str.capitalize(str.type),
        value: String(firstRecipe.type),
        inline: true
      })
    }

    if (firstRecipe.level) {
      fields.push({
        name: str.capitalize(str.level),
        value: String(firstRecipe.level),
        inline: true
      })
    }

    const ingredientsText = firstRecipe.ingredients.map(ingredient => {
      const ingredientEmoji = ':white_small_square:'
      const quantity = ingredient.count
      const name = ingredient.name.split(' ').map(str.capitalize).join(' ')
      const quantityText = `${quantity}x`
      const quantityCodeText = MessageManager.convertToCodeBlock(quantityText, 5)
      return `${ingredientEmoji} ${quantityCodeText} ${name}`
    })
    const orderedByEmojiTexts = ingredientsText.sort((textA, textB) => {
      const textAhasDefaultEmoji = textA.includes(':white_small_square:')
      const textBhasDefaultEmoji = textB.includes(':white_small_square:')
      if (textAhasDefaultEmoji && !textBhasDefaultEmoji) return 1
      if (!textAhasDefaultEmoji && textBhasDefaultEmoji) return -1
      return 0
    })
    fields.push({
      name: str.capitalize(str.ingredients),
      value: orderedByEmojiTexts.join('\n'),
      inline: false
    })

    if (firstRecipe.instructions.length) {
      fields.push({
        name: str.capitalize(str.instructions),
        value: firstRecipe.instructions.join('\n'),
        inline: false
      })
    }

    if (firstRecipe.effect?.length) {
      const effects = firstRecipe.effect.map(effect => {
        const {stat, amount} = JSON.parse(effect)
        return `${stat}: ${amount}`
      })
      fields.push({
        name: str.capitalize(str.effects),
        value: effects.join('\n'),
        inline: false
      })
    }

    if (firstRecipe.zen) {
      fields.push({
        name: str.capitalize(str.cost),
        value: `${firstRecipe.zen} Zen`,
        inline: false
      })
    }

    if (firstRecipe.tiers) {
      const tiers = firstRecipe.tiers.map((tier, index) => {
        const stars = Array(index + 1).fill(':star:').join('')
        return `${stars} ${tier}`
      })
      fields.push({
        name: str.capitalize(str.tiers),
        value: tiers.join('\n'),
        inline: false
      })
    }

    if (firstRecipe.location) {
      fields.push({
        name: str.capitalize(str.location),
        value: str.capitalize(firstRecipe.location),
        inline: false
      })
    }


    return fields
  }
}

const recipesManager = new RecipesManager()
export default recipesManager
