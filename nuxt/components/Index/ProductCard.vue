<template>
  <div class="product-card" :class="{sale}">
    <!-- <div v-if="sale" class="product-card__reminder">SALE</div> -->
    <div class="product-card__info">
      <div class="product-card__basic">
        <div class="product-card__brands">
          <nuxt-link v-for="(brand, k) in product.brands" :key="`product-card__brand[${k}]`" class="product-card__brand" :to="`/brand/${brand.title}`">
            {{ brand.title }}
          </nuxt-link>
        </div>
        <div class="product-card__title">
          {{ product.title.replace(brandsText, '') }}
        </div>
      </div>
      <div class="product-card__categories">
        <nuxt-link v-for="(category, k) in product.categories" :key="`product-card__category[${k}]`" class="product-card__category" :to="`/category/${category.title}`">
          {{ category.title }}
        </nuxt-link>
      </div>
    </div>
    <div class="product-card__image">
      <nuxt-link :to="`/product/${product.code}`" class="product-card__link">
        <img :src="product.image" />
      </nuxt-link>
    </div>
    <div class="product-card__prices">
      <div class="product-card__selectors">
        <div v-for="(i, k) in amounts" :key="`product-card__selector[${k}]`" v-on:click="amount = i" class="product-card__selector" :class="{active: amount === i, sale: product.sale.includes(i)}">
          {{ i }}<span>件</span>
        </div>
      </div>
      <div class="product-card__price">
        <div class="product-card__price-latest">
          <span v-if="product.sale.includes(amount) && lastPrice" class="product-card__price-yesterday">
            {{ `$${lastPrice}` }}
          </span>
          {{ `$${currentPrice}` }}
        </div>
        <div v-if="pastAveragePrice" class="product-card__price-past">
          過去7天平均 ${{ pastAveragePrice }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Product from '~/mixins/Product'

import takeRight from 'lodash/takeRight'
import get from 'lodash/get'
import find from 'lodash/find'
import reduce from 'lodash/reduce'
export default {
  name: 'product-card',
  mixins: [Product],
  props: {
    product: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      day: 7,
      amount: 1
    }
  },
  computed: {
    sale() {
      return this.product.sale.length > 0
      // return this.currentPrice && this.lastPrice ? parseFloat(this.currentPrice) < parseFloat(this.lastPrice) : false
      // return get(find(this.prices, {amount: this.amount})
      // const records = this.product.records
      // if (records.length > 1) {
      //   return reduce(takeRight(this.product.records, 2), (v1, v2) => {
      //     return parseFloat(get(find(get(v1, `prices`, []), {amount: this.amount}), 'value')) > parseFloat(get(find(get(v2, 'prices', []), {amount: this.amount}), 'value'))
      //   })
      // }
    },
    brandsText() {
      return this.product.brands.map(b => b.title).join(' ')
    }
  },
  methods: {
    get,
    find
  },
  mounted() {
    if (this.product.sale.length > 0) {
      this.amount = this.product.sale[0]
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="stylus" scoped>
.product-card
  position relative
  border 1px solid #e6e6e6
  border-radius 3px
  font-family 'Blinker'
  height fit-content

  &.sale
    border 2px solid #e8e837

  &__reminder
    display flex
    align-items center
    justify-content center
    position absolute
    width 90px
    height 34px
    left calc( 50% - 45px )
    top -17px
    background-color #e8e837
    border-radius 15px
    box-shadow 0px 0px 8px 1px #f2fc7e
    border 1px solid #fff
    font-size 24px

  &__info
    border-bottom 1px solid #efefef
    padding 12px
  &__basic
    display flex
    line-height 20px
  &__title
    margin-left 2px
  &__brand
    color #262626
    text-decoration underline
    letter-spacing 1px
  &__categories
    display flex
    justify-content flex-end
    margin-top 5px
  &__category
    display block
    position relative
    width fit-content
    padding 2px 5px 2px 10px
    font-weight bold
    font-size 13px
    height 24px
    color #374a5b
    margin-right 15px
    background-color #fbdbe1
    box-shadow -1px 2px 2px 0px #e0a8b1
    &:after
      content ''
      position absolute
      right -10px
      top 0
      border-left 10px solid #fbdbe1
      border-bottom 12px solid transparent
      border-top 12px solid transparent
  &__image
    width 100%
  &__link
    display block
    max-width 300px
    min-width 120px
    width 60%
    margin 0 auto
    > img
      width 100%

  &__prices
    display flex
    justify-content space-between
    align-items center
    border-top 1px solid #efefef
    padding 10px
  &__selectors
    display flex
  &__selector
    padding 2px 0
    width 50px
    text-align center
    font-size 20px
    border 1px solid #e3e3e3
    border-radius 3px
    cursor pointer
    span
      font-size 12px
    &.active
      background #f6f6f6
    &.sale
      border-color #e8e837
    &:not(:first-child)
      margin-left 5px
  &__price
    &-latest
      color #f87272
      font-size 30px
      font-weight bold
      text-align center
      letter-spacing 2px
    &-yesterday
      display inline-block
      color #c0c0c0
      font-size 16px
      font-weight 300
      letter-spacing 0
      text-decoration line-through
    &-past
      color green
      font-size 14px
      text-align right
</style>


