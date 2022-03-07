import { saveFile, openFile, saveJsonAsYamlFile } from '../utils/files'
import { toSnakeCase } from '../utils/strings'

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

    const perksWithIds = perks.map(perk => ({
      id: toSnakeCase(perk.name),
      ...perk
    }))

    const perksData = {
      introText: this.perksData.introText,
      buffsAndStacksText: this.perksData.buffsAndStacksText,
      perks: perksWithIds
    }
    console.log('Saving perks.json file...')
    saveFile(perksData, `${this.generatedFolderPath}/perks.json`)
    console.log('perks.json file saved!')
  }

  // While I don't make an exclusive project for data importation for Alexa and Google skills, this will stay here
  public mountAssistantsPerkValues() {
    console.log('Mounting Assistants perks...')
    const perks = [
      ...this.perksData.activePerks.filter(this.filterByExistingName).map(this.mapToIncludeType('active')),
      ...this.perksData.passivePerks.filter(this.filterByExistingName).map(this.mapToIncludeType('passive'))
    ]

    const alexaPerkValues = perks.map(perk => {
      const perkSynonyms = perk.name.split(' ').reduce((synonyms, partOfPerkName) => {
        if (partOfPerkName.length <= 2) return synonyms
        if (partOfPerkName.includes("'s")) return [...synonyms, partOfPerkName.replace("'s", ''), perk.name.replace("'s", '')]
        if (partOfPerkName === perk.name) return synonyms
        return [...synonyms, partOfPerkName]
      }, [])
      return {
        name: {
          value: perk.name,
          id: perk.id,
          synonyms: perkSynonyms.length > 1 ? perkSynonyms : undefined
        }
      }
    })
    const synonyms = alexaPerkValues.reduce((allSynonyms, perk) => {
      const perkSynonyms = perk.name.synonyms
      if (!perkSynonyms) return allSynonyms
      return [...allSynonyms, ...perkSynonyms]
    }, [])

    alexaPerkValues.forEach(perk => {
      if (!perk.name.synonyms) return
      perk.name.synonyms = perk.name.synonyms.filter(perk => {
        return synonyms.filter(syn => syn === perk).length <= 1
      })
      if (!perk.name.synonyms.length) {
        perk.name.synonyms = undefined
      }
    })

    const googlePerkValues = alexaPerkValues.reduce((perks, perk) => {
      const synonyms = perk.name.synonyms ? perk.name.synonyms : []
      perks[toSnakeCase(perk.name.value)] = {
        synonyms: [perk.name.value, ...synonyms]
      }
      return perks
    }, {})

    const googlePerkList = {
      synonym: {
        entities: googlePerkValues,
        matchType: 'EXACT_MATCH'
      }
    }


    console.log('Saving alexaPerkValues.json file...')
    saveFile(alexaPerkValues, `${this.generatedFolderPath}/alexaPerkValues.json`)
    console.log('alexaPerkValues.json file saved!')

    console.log('Saving googlePerkValues.yaml file...')
    saveJsonAsYamlFile(googlePerkList, `${this.generatedFolderPath}/googlePerkValues.yaml`)
    console.log('googlePerkValues.yaml file saved!')

    console.log('Saving jovoValues.yaml file...')
    saveFile(alexaPerkValues.map(value => value.name), `${this.generatedFolderPath}/jovoValues.json`)
    console.log('jovoValues.yaml file saved!')
  }

}