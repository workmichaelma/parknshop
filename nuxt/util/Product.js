import takeRight from 'lodash/takeRight'
import get from 'lodash/get'

export const preprocessProduct = (product) => {
  product.latestPrice = get(takeRight(product.records), '[0]', [])
  return product
}
