import { saveFile, openFile } from '../utils/files'

export default class ItemsGenerator {
  private equipmentSynthesisByLocation
  private equipmentData
  private generatedFolderPath
  private perksData

  constructor(rawFolderPath: string, generatedFolderPath: string) {
    this.generatedFolderPath = generatedFolderPath
    this.equipmentSynthesisByLocation = openFile(`${rawFolderPath}/ez/equipmentSynthesisByLocation.json`)
    this.perksData = openFile(`${rawFolderPath}/fandomWiki/equipmentPerks.json`)
  }

  public mountItems() {
    console.log('Mounting items...')
    this.equipmentData = this.equipmentSynthesisByLocation.flatMap(locationItems => locationItems.items)
    console.log('Saving items.json file...')
    saveFile(this.equipmentData, `${this.generatedFolderPath}/items.json`)
    console.log('items.json file saved!')
  }

  private filterByExistingName(item) {
    return Boolean(item.name)
  }

  private mapToIncludeType(type: string) {
    return item => ({
      ...item,
      type
    })
  }

  public mountPerks() {
    console.log('Mounting perks...')
    const perks = [
      ...this.perksData.activePerks.filter(this.filterByExistingName).map(this.mapToIncludeType('active')),
      ...this.perksData.passivePerks.filter(this.filterByExistingName).map(this.mapToIncludeType('passive'))
    ]
    const perksData = {
      introText: this.perksData.introText,
      buffsAndStacksText: this.perksData.buffsAndStacksText,
      perks
    }
    console.log('Saving perks.json file...')
    saveFile(perksData, `${this.generatedFolderPath}/perks.json`)
    console.log('perks.json file saved!')
  }

}