const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')

// Get the quotes data from goodreads page
const getQuotes = async (uri) => {
  let quotes = []

  const options = {
    uri,
    transform: (body) => {
      return cheerio.load(body)
    }
  }

  try {
    const $ = await rp(options)

    for (let i = 0; i < 30; i++) {
      const author = $('.authorOrTitle')[i].children[0].data.trim()
      const message = $('.quoteText')[i].children[0].data.trim()
  
      quotes.push({ author, message })
    }
  
  }
  catch(err) {
    console.error(err)
  }

  return quotes
}

async function main() {
  const pageLimit = 3

  let currentPage = 1
  let goodreadsUri = 'https://www.goodreads.com/author/quotes/4918776.Seneca'
  let result = []

  while (currentPage <= pageLimit) {
    try {
      const data = await getQuotes(goodreadsUri)
      result = [...result, ...data]
    }
    catch(err) { console.error(err) }

    currentPage += 1
    goodreadsUri += `?page=${currentPage}`

  }
  
  try {
    fs.writeFileSync('./quotes.json', JSON.stringify(result, null, 2))
  }
  catch(err) {
    console.error(err)
  }

  return `${result.length} quotes scraped.`

}

main()