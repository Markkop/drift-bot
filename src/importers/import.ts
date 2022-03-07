import Downloader from "./Downloader";
import { performance } from 'perf_hooks'
import ItemsGenerator from "./ItemsGenerator";

const downloadFolder = 'data/raw'
const generatedFolder = 'data/generated'

async function importData() {
  const startTime = performance.now();
  const downloader = new Downloader(downloadFolder)
  // await downloader.scrapEzWebsite()
  // await downloader.getAndSaveCookingRecipes()
  // await downloader.scrapFandomWikiWebsite()
  const itemsGenerator = new ItemsGenerator(downloadFolder, generatedFolder)
  itemsGenerator.mountPerks()
  itemsGenerator.mountAssistantsPerkValues()
  itemsGenerator.mountAssistantsDiscoverableValues()

  const endTime = performance.now();
  const time = ((endTime - startTime) / 1000) / 60
  console.log(`Data importation took ${time.toFixed(2)} minutes.`);
}

importData()

