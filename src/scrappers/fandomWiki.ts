import puppeteer from 'puppeteer-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'

async function scrapEquipmentPerksPage(page) {
  try {
    const equipmentPerks = await page.evaluate(getEquipmentSynthesis)
    return {
      equipmentPerks
    }
  } catch (error) {
    console.log(error)
  }
}

function getEquipmentSynthesis() {
  function scrapTable(table: Element) {
    return [...table.querySelectorAll('tr')].map(tr => {
      const [name, effect, tier1, tier2, tier3] = [...tr.querySelectorAll('td')].map(td => td && td.innerHTML.trim())
      return {
        name,
        effect,
        tier1,
        tier2,
        tier3
      }
    })
  }

  const introText = document.querySelector('p').innerText

  const [passiveTable, exclusivePassiveTable, activeTable] = [...document.querySelectorAll('.mw-collapsible.fandom-table')]
  const passivePerks = scrapTable(passiveTable)
  const exclusivePassivePerks = scrapTable(exclusivePassiveTable)
  const activePerks = scrapTable(activeTable)

  const buffsAndStacksText = document.querySelector('#Buffs_and_stacks').parentElement.nextElementSibling.innerHTML

  return {
    introText,
    passivePerks: [...passivePerks, ...exclusivePassivePerks],
    activePerks,
    buffsAndStacksText
  }
}

export default async function scrapEquipmentPerks() {
  puppeteer.use(stealthPlugin())
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const page = await browser.newPage()
  await page.goto(`https://zenithmmo.fandom.com/wiki/Equipment_Perks`, { waitUntil: 'networkidle2', timeout: 0 })
  const equipmentPerks = await scrapEquipmentPerksPage(page)
  await browser.close()
  return equipmentPerks
}