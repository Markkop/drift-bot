import { hasTextOrNormalizedTextIncluded } from '@utils/strings'
import str from '@stringsLang'
import { CommandOptions, ItemData } from '@types'
import mappings from '@utils/mappings'
import { MessageReaction, MessageEmbed } from 'discord.js'
import { RecipesManager } from '@managers'
const equipmentData = require('../../data/generated/items.json')

class ItemManager {
  private itemsList: ItemData[]
  private equipmentList: ItemData[]

  constructor () {
    this.itemsList = equipmentData
    this.setEquipmentList()
  }

  public getEquipmentList() {
    return this.equipmentList
  }

  private setEquipmentList () {
    // Move this sorting to a function
    this.itemsList.sort((a,b) => {
      const rarityA = mappings.rarityMap[b.rarity.toLowerCase()].id
      const rarityB = mappings.rarityMap[a.rarity.toLowerCase()].id
      return rarityA - rarityB
    })
    this.itemsList.sort((a,b) => {
      return Number(b.level) - Number(a.level)
    })
    this.equipmentList = this.itemsList
  }

  public getItemByName (itemList: ItemData[], name: string, options: CommandOptions) {
    if (!options.rarityName && !options.level) {
      return itemList.filter(equip => hasTextOrNormalizedTextIncluded(equip.name, name))
    }

    return itemList.filter(equip => {
      let filterAssertion = true
      const includeName = hasTextOrNormalizedTextIncluded(equip.name, name)
      if (options.rarityName) {
        filterAssertion = filterAssertion && String(options.rarityName).toLowerCase() === equip.rarity.toLowerCase()
      }

      if (options.level) {
        filterAssertion = filterAssertion && String(options.level) === equip.level
      }
      return includeName && filterAssertion
    })
  }

  public getEquipmentByName(name: string, options: CommandOptions) {
    return this.getItemByName(this.equipmentList, name, options)
  }

  // TODO: Waiting for a better way to obtain item ids
  // public async enrichItemMessage (reaction: MessageReaction) {
  //   const reactionEmbed = reaction.message.embeds[0]
  //   if (!reactionEmbed) return

  //   const levelField = reactionEmbed.fields.find(field => !/\D/.test(field.value))
  //   const levelName = levelField.name || ''

  //   const id = Number(reactionEmbed.description.split('ID: ')[1])
  
  
  //   if (reaction.emoji.name === '🛠️') {
  //     const hasRecipeField = reactionEmbed.fields.some(field => {
  //       return Object.values(str.job).some(jobName => jobName === field.name.toLowerCase())
  //     })
  //     if (hasRecipeField) return
  
  //     const recipes = RecipesManager.findRecipeByName('', {})
  //     if (!recipes.length) return
  
  //     const recipeFields = RecipesManager.getRecipeFields(recipes)
  //     reactionEmbed.fields = [
  //       ...reactionEmbed.fields,
  //       ...recipeFields
  //     ]
  //   }
  //   const newEmbed = new MessageEmbed(reactionEmbed)
  //   await reaction.message.edit({ embeds: [newEmbed]})
  // }
}

const itemManager = new ItemManager()
export default itemManager
