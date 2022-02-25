import puppeteer from 'puppeteer-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'

async function scrapCookingItemsPage(page) {
  try {
    const itemPages = await page.evaluate(getItemPages)
    const items = []
    for (let index = 0; index < itemPages.length; index++) {
      const url = itemPages[index]
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 })
      const item = await page.evaluate(getCookingItem)
      items.push(item)
    }

    return {
      items
    }
  } catch (error) {
    console.log(error)
  }
}

function getItemPages() {
  const linkElements = [...document.querySelectorAll('.category-page__member-link')]
  return linkElements.map((anchor: HTMLAnchorElement) => anchor.href)
}

function getCookingItem() {
  const title = document.querySelector('.page-header__title').innerHTML.trim()
  const sourceElement = document.querySelector('#Source')
  if (!sourceElement) {
    return { title }
  }
  let nextElementSibling = sourceElement.parentElement.nextElementSibling
  let additionalText = ''
  if (nextElementSibling instanceof HTMLParagraphElement) {
    additionalText = nextElementSibling.innerText
    nextElementSibling = nextElementSibling.nextElementSibling
  }

  let sources = []
  if (nextElementSibling) {
    sources = [...nextElementSibling.querySelectorAll('li')].map(el => el.innerText)
  }

  return {
    title,
    additionalText,
    sources
  }
}

export default async function scrapCookingItems() {
  puppeteer.use(stealthPlugin())
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const page = await browser.newPage()
  await page.goto(`https://zenithmmo.fandom.com/wiki/Category:Cooking_ingredient_items`, { waitUntil: 'networkidle2', timeout: 0 })
  const items = await scrapCookingItemsPage(page)
  await browser.close()
  return items
}