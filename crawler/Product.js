const words = require('lodash/words')
const trimEnd = require('lodash/trimEnd')

module.exports = {
  title($) {
    const ele = $('#item-photo-container div.itemName')    
    return ele ? ele.text() : ''
  },
  prices($) {
    let ele = $('#item-photo-container .offer-table')
    let prices = []
    if (ele && ele.children().length) {
      prices = $(ele.children().map((i, child) => {
        child = $(child)
        price = child.find('span.price')
        return ( {
          amount: child.attr('data-value'),
          value: $(price).contents().map((n, p) => {
            return p.type === 'text' ? words($(p).text(), /[_A-Za-z0-9.@-]+$/g).join('') : ''
          }).get().join('')
        })
      })).get()
    } else {
      ele = $("#item-photo-container .price-container span[itemprop=price]").attr('content')
      if (ele) {
        prices.push({
          amount: '1',
          value: ele
        })
      }
    }
    return prices
  },
  categories($) {
    const ele = $('.categoryAndBrandContainer ul')
    let categories = []
    if (ele && ele.children().length) {
      categories = $(ele.children().map((i, child) => {
        child = $(child)
        const href = child.find('a').attr('href').split('/')
        return {
          title: trimEnd(child.text()),
          code: href.pop(),
          type: href.indexOf(`brandlist`) > 0 ? 'brand': 'category'
        }
      })).get()
    }
    return categories
  },
  image($) {
    return $(`meta[property="og:image"]`).attr('content') || ''
  },
  init($, detail) {
    if (detail) {
      return {
        title: this.title($),
        image: this.image($),
        categories: this.categories($),
        prices: this.prices($),
      }
    } else {
      return {
        prices: this.prices($),
      }
    }
  }
}