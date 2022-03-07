import { saveFile, openFile } from '../utils/files'
import pluralize from 'pluralize'

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
      perks: perks
    }
    console.log('Saving perks.json file...')
    saveFile(perksData, `${this.generatedFolderPath}/perks.json`)
    console.log('perks.json file saved!')
  }

  private extractSynonymsFromName(resources, nameProperty: string) {
   return resources.map(perk => {
      const perkSynonyms = perk[nameProperty].split(' ').reduce((synonyms, partOfPerkName) => {
        if (partOfPerkName.length <= 2) return synonyms
        if (partOfPerkName.includes("'s")) return [...synonyms, partOfPerkName.replace("'s", ''), perk[nameProperty].replace("'s", '')]
        if (partOfPerkName === perk[nameProperty]) return synonyms
        return [...synonyms, partOfPerkName]
      }, [])
      return {
        value: perk[nameProperty],
        synonyms: perkSynonyms.length > 1 ? perkSynonyms : undefined
      }
    })
  }
  
  private addPluralSynonyms(resources) {
    return resources.map(resource => {
      const plural = pluralize(resource.value)
      if (!plural) {
        return resource
      }
      const existingSynonyms = resource.synonyms
      return {
        ...resource,
        synonyms: existingSynonyms ? [
          ...existingSynonyms,
          plural
        ] : [plural]
      }
    })
  }

  private removeDuplicateSynonyms(resources) {
    // Create a list with synonyms of all resources
    const synonyms = resources.reduce((allSynonyms, perk) => {
      const perkSynonyms = perk.synonyms
      if (!perkSynonyms) return allSynonyms
      return [...allSynonyms, ...perkSynonyms]
    }, [])

    // Remove duplicate synonyms
    resources.forEach(perk => {
      if (!perk.synonyms) return
      perk.synonyms = perk.synonyms.filter(perk => {
        return synonyms.filter(syn => syn === perk).length <= 1
      })
      if (!perk.synonyms.length) {
        perk.synonyms = undefined
      }
    })

    return resources
  }

  private moveInvalidNamesToTheEnd(resources) {
    // Move names with 's to the final because the generated Google model uses the first values as
    // types for training phrases and those woth 's are not supported
    resources.sort((a, b) => {
      const aIncludes = a.value.includes("'s")
      const bIncludes = b.value.includes("'s")
      if (aIncludes && !bIncludes) return 1
      if (!aIncludes && bIncludes) return -1
      return 0
    })
    return resources
  }

  private saveJovoModel(resourcesEntityTypes, resourceName) {
    const jovoModelPath = "../jovo-essence-helper/models/en.json"
    const jovoModel = openFile(jovoModelPath)
    const newJovoModel = {
      ...jovoModel,
      entityTypes: {
        ...jovoModel.entityTypes,
        [resourceName]: {
          values: resourcesEntityTypes
        }
      }
    }

    console.log(`Saving ${jovoModelPath} file...`)
    saveFile(newJovoModel, jovoModelPath)
    console.log(`${jovoModelPath} file saved!`)
  }

  // While I don't make an exclusive project for data importation for Alexa and Google skills, this will stay here
  public mountAssistantsPerkValues() {
    console.log('Mounting Assistants perks...')
    const perks = [
      ...this.perksData.activePerks.filter(this.filterByExistingName).map(this.mapToIncludeType('active')),
      ...this.perksData.passivePerks.filter(this.filterByExistingName).map(this.mapToIncludeType('passive'))
    ]

    const perkEntityTypesWithSynonyms = this.extractSynonymsFromName(perks, 'name')
    const perkEntityTypesWithUniqueSynonyms = this.removeDuplicateSynonyms(perkEntityTypesWithSynonyms)
    const orderedPerkEntityTypes = this.moveInvalidNamesToTheEnd(perkEntityTypesWithUniqueSynonyms)
    this.saveJovoModel(orderedPerkEntityTypes, 'perk')
  }

  public mountAssistantsDiscoverableValues() {
    console.log('Mounting Assistants discoverables...')
    const discoverables = openFile('data/raw/fandomWiki/cookingItems.json')

    const discoverableEntityTypesWithSynonyms = this.extractSynonymsFromName(discoverables, 'title')
    const discoverableEntityTypesWithSynonymsAndPlural = this.addPluralSynonyms(discoverableEntityTypesWithSynonyms)
    const discoverableEntityTypesWithUniqueSynonyms = this.removeDuplicateSynonyms(discoverableEntityTypesWithSynonymsAndPlural)
    const orderedDiscoverableEntityTypes = this.moveInvalidNamesToTheEnd(discoverableEntityTypesWithUniqueSynonyms)
    this.saveJovoModel(orderedDiscoverableEntityTypes, 'discoverable')
  }
}