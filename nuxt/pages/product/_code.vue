<template>
  <div class="product">
    <div class="row">
      <div class="product__title col-md-10 col-md-offset-1">
        {{ product.title }}
      </div>
    </div>
    <div class="row">
      <!-- <div class="product__separator col-md-offset-1 col-md-10" /> -->
    </div>
    <div class="row">
      <div class="product__image col-md-4 col-md-offset-1">
        <img :src="product.image" />
      </div>
      <div class="product__summary col-md-5 col-md-offset-1">
        <div class="product__tags">
          <template v-for="(brand, k) in product.brands">
            <nuxt-link :to="`/brand/${brand.code}`" class="product__tag brand" :key="`product__tag-brand[${k}]`">
              {{ brand.title }}
            </nuxt-link>
          </template>
          <template v-for="(category, k) in product.categories">
            <nuxt-link :to="`/category/${category.code}`" class="product__tag category" :key="`product__tag-category[${k}]`">
              {{ category.title }}
            </nuxt-link>
          </template>
        </div>
        <div class="product__amount-selectors">
          <div v-on:click="amount = ~~i" v-for="(i, k) in amounts" :key="`product__amount-selectors[${k}]`" class="selector" :class="{active: ~~i === amount}">
            <div>
              <span>{{ i }}</span>
              <span class="piece">件</span>
            </div>
          </div>
        </div>
        <div class="product__prices">
          <div class="product__price latest">
            <div class="title">
              新
            </div>
            <div class="price">
              ${{ get(find(product.latestPrice.prices, {amount}), 'value', '') }}
            </div>
          </div>
          <div class="product__price week">
            <div class="title">
              過去<strong>{{ day }}</strong>天平均
            </div>
            <div class="price">
              ${{ pastAveragePrice }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="product__chart">
      <div class="row">
        <div class="product__chart-title col-md-12">
          <div>過去 </div>
          <div class="product__chart-selectors">
            <div v-for="(d, k) in [7, 30, 180]" v-on:click="day = d" :key="`product__chart-selector[${k}]`" class="product__chart-selector" :class="{'active': d === day}">{{ d }}</div>
          </div>
          <div> 天價格歷史</div>
        </div>
      </div>
      <div class="row">
        <no-ssr>
          <div class="product__chart-graph col-md-8 col-md-offset-2">
            <product-chart v-bind="{chartData}"/>
          </div>
        </no-ssr>
      </div>
    </div>
  </div>
</template>

<script>
import Product from '~/mixins/Product'

import get from 'lodash/get'
import takeRight from 'lodash/takeRight'
import find from 'lodash/find'
import sum from 'lodash/sum'
import dropRight from 'lodash/dropRight'
import { mapGetters } from 'vuex'

import ProductChart from '~/components/Product/Chart'

export default {
  name: 'product-page',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    const code = route.params.code
    if (code) {
      await store.dispatch('product/fetchProduct', {code})
    }
  },
  mixins: [
    Product
  ],
  components: {
    ProductChart,
  },
  computed: {
    ...mapGetters({
      getProduct: 'product/getProduct'
    }),
    product() {
      return this.getProduct(this.$route.params.code)
    },
    chartData() {
      return {
        columns: ['日期', '價格'],
        rows: this.pastPrices.map(record => {
          const day = new Date(record.date).toLocaleString('en-GB', { timeZone: 'Asia/Hong_Kong' })
          return {
            '日期': `${day.substring(0, 2)}/${day.substring(3,5)}`,
            '價格': parseFloat(get(find(record.prices, {amount: this.amount}), 'value', 0))
          }
        })
      }
    }
  },
  methods: {
    find,
    get,
  },
  data() {
    return {
      amount: 1,
      day: 7,
    }
  },
  mounted() {
    
  }
}
</script>

<style lang="stylus" scoped>
.product
  img
    width 100%

  &__separator
    height 1px
    background-color #bbbbbb
  &__title
    font-size 22px
  &__image
    margin-top 20px

  &__summary
    display flex
    flex-direction column
    justify-content space-around
  &__tags
    display flex
    flex-wrap wrap
  &__tag
    display block
    position relative
    padding 2px 5px 2px 10px
    font-weight bold
    font-size 14px
    height 24px
    color #374a5b
    margin-right 15px
    margin-bottom 8px
    &:after
      content ''
      position absolute
      right -10px
      top 0
      border-bottom 12px solid transparent
      border-top 12px solid transparent
    &.brand
      background-color #b8d3ff
      &:after
        border-left 10px solid #b8d3ff
    &.category
      background-color #fbdbe1
      &:after
        border-left 10px solid #fbdbe1
  &__amount-selectors
    display flex
    .selector
      font-size 24px
      font-family 'Blinker'
      display flex
      flex-direction column
      height 50px
      min-width 60px
      justify-content space-around
      align-items center
      cursor pointer
      .piece
        font-size 10px
      &:not(:first-child)
        border-left 1px solid #eeeeee
      &:first-child
        border-top-left-radius 10px
        border-bottom-left-radius 10px
      &:last-child
        border-top-right-radius 10px
        border-bottom-right-radius 10px
      &:after
        content ''
        position static
        display block
        width 50%
        height 1px
        background-color #eeeeee
      &.active
        background-color #f2f2f2bf
  &__price
    display flex
    align-items center
    &.latest
      font-size 14px
      font-weight bold
      .title
        display flex
        align-items center
        justify-content center
        background-color #e7001c
        color #ffffff
        width 22px
        height 22px
        border-radius 50%
      .price
        font-size 30px
        font-weight bold
        color red
        margin-left 20px
    &.week
      margin-top 5px
      color green
      font-size 12px
      .title
        margin-right 10px
        strong
          font-size 14px
      .price
        font-weight bold
        font-size 15px
  &__chart
    margin-top 50px
    border-top 1px solid #f5f5f5
    &-title
      display flex
      justify-content center
      align-items center
      margin-top 30px
    &-selectors
      display flex
      border 1px solid #dddddd
      font-size 26px
      line-height 32px
      margin 0 10px
    &-selector
      padding 0 10px
      background-color #f8f8f8bf
      cursor pointer
      &:not(:first-child)
        border-left 1px solid #dddddd
      &.active
        background-color #e2e2e2
    // &-graph
    //   width 400px
    //   height 400px
</style>

