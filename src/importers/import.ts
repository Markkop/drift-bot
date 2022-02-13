import Downloader from "./Downloader";
import { performance } from 'perf_hooks'
import ItemsGenerator from "./ItemsGenerator";

const downloadFolder = 'data/raw'
const generatedFolder = 'data/generated'

async function importData() {
  const startTime = performance.now();
  const downloader = new Downloader(downloadFolder)
  await downloader.scrapEzWebsite()

  const itemsGenerator = new ItemsGenerator(downloadFolder, generatedFolder)
  itemsGenerator.mountItems()

  // const recipesGenerator = new RecipesGenerator(downloadFolder, generatedFolder)
  // recipesGenerator.combineAndSaveRecipes()
  // const zenithParser = new ZenithParser(downloadFolder, generatedFolder)
  // zenithParser.parseAndSaveZenithSublimations()

  const endTime = performance.now();
  const time = ((endTime - startTime) / 1000) / 60
  console.log(`Data importation took ${time.toFixed(2)} minutes.`);
}

importData()

