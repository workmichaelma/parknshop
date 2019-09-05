<template>
  <div class="product-recommend" v-if="products.length > 0">
    <div class="container">
      <div class="row">
        <div v-for="(product, key) in products" :key="key" class="col-md-3">
          <nuxt-link class="item" :to="`/product/${product.code}`">
            <div class="item__image">
              <img :src="product.image" />
            </div>
            <div class="item__detail">
              <div class="item__title" :class="{sale: product.sale.length > 0}">
                {{ product.title }}
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Product from '~/mixins/Product'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import uniq from 'lodash/uniq'
import filter from 'lodash/filter'
import take from 'lodash/take'
import shuffle from 'lodash/shuffle'
export default {
  name: 'product-recommend',
  props: {
    product: {
      required: true,
      type: Object,
    }
  },
  mixins: [
    Product
  ],
  computed: {
    ...mapGetters({
      getCategory: 'category/getCategory',
      getProduct: 'product/getProduct'
    }),
    products() {
      return take(shuffle(this.relatedProducts), 4)
      // return take(uniq(filter(reduce(this.product.categories.map(c => {
      //   return get(this.getCategory({_id: c._id}), 'products', [])
      // }), (arr, v, k) => {
      //   return [...arr, ...v]
      // }, []), c => {
      //   return c !== this.product.code
      // })).map(p => {
      //   return this.getProduct(p)
      // }), 4)
    }
  },
  methods: {
    ...mapActions({
      fetchProducts: 'category/fetchProducts'
    })
  },
}
</script>
<style lang="stylus" scoped>
.product-recommend
  margin-top 30px
  border-top 1px solid #f5f5f5
  padding-top 20px
  .item
    display block
    padding 20px
    color #b8b8b8
    font-size 14px
    &:hover
      color #a0a0a0
    img
      width 100%
    &__title
      &.sale
        color #d3d36b
</style>

