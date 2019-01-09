const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')

async function getQuotes() {
  let quotes = []
  const options = {
    uri:'https://www.goodreads.com/author/quotes/4918776.Seneca',
    transform: function(body) {
      return cheerio.load(body)
    }
  }

  try {
    const $ = await rp(options)

    for(let i = 0; i < 30; i++) {
      const id = i + 1
      const author = $('.authorOrTitle')[i].children[0].data.trim()
      const message = $('.quoteText')[i].children[0].data.trim()

      quotes.push({ id, author, message })
    }
  
  }
  catch(err) {
    console.error(err)
  }
  
  return quotes
}

async function saveToJson(obj) {
  const data = await JSON.stringify(obj, null, 2)
  await fs.writeFile('./data.json', data, (err) => {
      if (err) console.error(err)
  })

  return data
}

async function main() {
  const result = await getQuotes()
  const output = await saveToJson(result)
  console.log(output)
}

main()