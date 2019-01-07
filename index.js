const rp = require('request-promise')
const $ = require('cheerio')
const fs = require('fs')

const url = 'https://www.goodreads.com/author/quotes/4918776.Seneca'

function getHtml(url) {

  return rp(url)
    .then(html => {
      return $('.quoteText', html)
    })
    .catch(err => {
      console.error(err)
    })

}

getHtml(url)
  .then(data => {
     let quotes = []
     for(let i = 0; i < data.length; i++){
       quotes.push({ id: i+1, text: data[i].children[0].data.trim() })
     }

     console.log(quotes)
  })
  .catch(err => console.error(err))
