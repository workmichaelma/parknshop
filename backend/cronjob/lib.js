import { find, get, map, zipWith } from 'lodash'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

export const axiosConfig = {
  headers: {
    'User-Agent': 'PNSHK/6.10.2 (iOS/15.1)',
    'Accept-Language': 'zt',
    'x-device-id': uuidv4(),
    env: 'PROD',
  },
}

export const parseProducts = ({ products, defaultCat }) => {
  return map(products, (p) => {
    return parseProduct({ p, defaultCat })
  })
}

const parseProduct = ({ p, defaultCat }) => {
  try {
    const product = {
      name: p.name,
      code: p.code,
      url: p.url,
      stockLevel: p.stockLevel,
      price: p?.price?.value,
      image: get(
        find(p.images, { imageType: 'PRIMARY' }),
        'url',
        get(p.images, '[0].url', '')
      ),
      brand: {
        name: p?.brandData?.name,
        image: p?.brandData?.smallLogoUrl,
      },
      unitSize: p.pnsContentSizeUnit,
      category: zipWith(
        get(p, 'pnsCategoriesCode', '').split('/'),
        get(p, 'pnsCategoriesName', '').split('/'),
        (code, name) => {
          return { code, name }
        }
      ),
      sales: map(p.pnsCaseOfferDatas || [], (d) => {
        return {
          start: moment(d.startDate).add(8, 'h').format('M月D日'),
          end: moment(d.endDate).add(8, 'h').format('M月D日'),
          quantity: d.quantity,
          price: d.salesPrice.value,
          avg: parseFloat(d.salesPrice.value) / d.quantity,
        }
      }),
    }

    if (!get(p, 'pnsCategoriesCode')) {
      product.category = [
        {
          code: defaultCat,
        },
      ]
    }
    return product
  } catch (err) {
    console.log(err, `Parse product failed, ${p?.name}, ${p?.code}`)
    return {}
  }
}
