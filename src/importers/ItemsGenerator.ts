import { saveFile, openFile } from '../utils/files'

export default class ItemsGenerator {
  private equipmentSynthesisByLocation
  private equipmentData
  private generatedFolderPath

  constructor(rawFolderPath: string, generatedFolderPath: string) {
    this.generatedFolderPath = generatedFolderPath
    this.equipmentSynthesisByLocation = openFile(`${rawFolderPath}/ez/equipmentSynthesisByLocation.json`)
  }

  public mountItems () {
    console.log('Mounting items...')
    this.equipmentData = this.equipmentSynthesisByLocation.flatMap(locationItems => locationItems.items)
    console.log('Saving items.json file...')
    saveFile(this.equipmentData, `${this.generatedFolderPath}/items.json`)
    console.log('items.json file saved!')
  }

}