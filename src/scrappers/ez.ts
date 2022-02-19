import puppeteer from 'puppeteer-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'

async function scrapSynthesisContainer(page) {
  try {
    const equipmentSynthesisByLocation = await page.evaluate(getEquipmentSynthesis)
    return {
      equipmentSynthesisByLocation
    }
  } catch (error) {
    console.log(error)
  }
}

function getEquipmentSynthesis() {
  const synthesisContainer = document.querySelector('.synthesisContainer')
  if (!synthesisContainer) {
    return {}
  }

  const synthesisLocationContainers = [...document.querySelectorAll('.synthesisLocationContainer')]
  const equipmentSynthesisByLocation = synthesisLocationContainers.map(container => {
    const location = container.id
    const itemElements = [...container.querySelectorAll('.synthesisItem')]
    const items = itemElements.map(element => {
      const [name, rarity] = element.querySelector('.synthesisItemName').innerHTML.split(' - ')
      const levelElement = element.querySelector('.synthesisItemLevel .synthesisItemStatContent')
      const level = levelElement && levelElement.innerHTML
      const classNameElement = element.querySelector('.synthesisItemClass .synthesisItemStatContent')
      const className = classNameElement && classNameElement.innerHTML
      const slotElement = element.querySelector('.synthesisItemSlot .synthesisItemStatContent')
      const slot = slotElement && slotElement.innerHTML
      const stat1NameElement = element.querySelector('.synthesisItemStat1 .synthesisItemStatTitle')
      const stat1Name = stat1NameElement && stat1NameElement.innerHTML
      const stat1ValueElement = element.querySelector('.synthesisItemStat1 .synthesisItemStatContent')
      const stat1Value = stat1ValueElement && stat1ValueElement.innerHTML
      const stat2NameElement = element.querySelector('.synthesisItemStat2 .synthesisItemStatTitle')
      const stat2Name = stat2NameElement && stat2NameElement.innerHTML
      const stat2ValueElement = element.querySelector('.synthesisItemStat2 .synthesisItemStatContent')
      const stat2Value = stat2ValueElement && stat2ValueElement.innerHTML
      const stats = {
        [stat1Name]: stat1Value,
        [stat2Name]: stat2Value
      }

      const perks = [...element.querySelectorAll('.synthesisItemPerks .synthesisItemStatContent div')].map(el => el.innerHTML)
      const zenElement = element.querySelector('.synthesisItemZen .synthesisItemStatContent')
      const zen = zenElement && zenElement.innerHTML
      const components = [...element.querySelectorAll('.synthesisItemComponents .synthesisItemStatContent div')].map(el => el.innerHTML)
      return {
        location,
        name,
        rarity,
        level,
        className,
        slot,
        stats,
        perks,
        zen,
        components
      }
    })

    return {
      location,
      items
    }
  })

  return equipmentSynthesisByLocation
}

export default async function scrapEquipmentSynthesis() {
  puppeteer.use(stealthPlugin())
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const page = await browser.newPage()
  await page.goto(`https://ez.community/synthesis`, { waitUntil: 'networkidle2', timeout: 0 })
  const synthesisContainer = await scrapSynthesisContainer(page)
  await browser.close()
  return synthesisContainer
}