import axios, { AxiosInstance } from 'axios'
import scrapEquipmentPerks from '../scrappers/fandomWiki/equipmentPerks'
import scrapCookingItems from '../scrappers/fandomWiki/cookingItems'
import scrapEquipmentSynthesis from '../scrappers/ez'
import { saveFile } from '../utils/files'

export default class Downloader {
  private httpClient: AxiosInstance
  private downloadFolder: string

  constructor(downloadFolder) {
    this.httpClient = axios.create()
    this.downloadFolder = downloadFolder
  }

  public async scrapEzWebsite() {
    const { equipmentSynthesisByLocation } = await scrapEquipmentSynthesis()
    saveFile(equipmentSynthesisByLocation, `${this.downloadFolder}/ez/equipmentSynthesisByLocation.json`)
  }

  public async scrapFandomWikiWebsite() {
    const { equipmentPerks } = await scrapEquipmentPerks()
    saveFile(equipmentPerks, `${this.downloadFolder}/fandomWiki/equipmentPerks.json`)

    const { items: cookingItems } = await scrapCookingItems()
    saveFile(cookingItems, `${this.downloadFolder}/fandomWiki/cookingItems.json`)
  }

  public async getCookingList() {
    try {
      console.log('Getting cooking recipe list...')
      const { data } = await this.httpClient.get('https://ez.community/api/recipes/list')
      return data
    } catch (error) {
      console.log(error)
    }
  }

  public async getRecipeByName(name: string) {
    try {
      console.log(`Getting recipe ${name}`)
      const { data } = await this.httpClient.get(`https://ez.community/api/recipes/recipe/${name}`)
      return data
    } catch (error) {
      console.log(error)
    }
  }

  public async getAndSaveCookingRecipes() {
    const list = await this.getCookingList()
    const recipes = []
    for (let index = 0; index < list.length; index++) {
      const listItem = list[index];
      const recipe = await this.getRecipeByName(listItem.name)
      recipes.push(recipe)
    }
    saveFile(recipes, `${this.downloadFolder}/ez/cookingRecipes.json`)
  }
}