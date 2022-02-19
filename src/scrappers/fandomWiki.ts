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
  const introText = document.querySelector('p').innerText

  const [passiveTable, activeTable] = [...document.querySelectorAll('.fandom-table')]
  const passiveTableRows = [...passiveTable.querySelectorAll('tr')]
  const passivePerks = passiveTableRows.map(tr => {
    const [name, effect, tier1, tier2, tier3] = [...tr.querySelectorAll('td')].map(td => td && td.innerHTML.trim())
    return {
      name,
      effect,
      tier1,
      tier2,
      tier3
    }
  })

  const activeTableRows = [...activeTable.querySelectorAll('tr')]
  const activePerks = activeTableRows.map(tr => {
    const [name, effect] = [...tr.querySelectorAll('td')].map(td => td && td.innerHTML.trim())
    return {
      name,
      effect,
    }
  })

  const buffsAndStacksText = document.querySelector('#Buffs_and_stacks').parentElement.nextElementSibling.innerHTML

  return {
    introText,
    passivePerks,
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