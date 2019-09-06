<template>
  <div class="product-main">
    <div class="container">
      <div class="row">
        <div class="product-main__title col-md-7 col-md-offset-1">
          {{ product.title }}
        </div>
        <div class="product-main__redirect col-md-3">
          <a :href="`https://www.parknshop.com/zh-hk/code/p/${product.code}`" target="_blank">
            百佳網頁
          </a>
        </div>
      </div>
      <div class="row">
        <!-- <div class="product__separator col-md-offset-1 col-md-10" /> -->
      </div>
      <div class="row">
        <div class="product-main__image col-md-4 col-md-offset-1">
          <img :src="product.image" />
        </div>
        <div class="product-main__summary col-md-5 col-md-offset-1">
          <div class="product-main__tags">
            <template v-for="(brand, k) in product.brands">
              <nuxt-link :to="`/brand/${brand.title}`" class="product-main__tag brand" :key="`product-main__tag-brand[${k}]`">
                {{ brand.title }}
              </nuxt-link>
            </template>
            <template v-for="(category, k) in product.categories">
              <nuxt-link :to="`/category/${category.title}`" class="product-main__tag category" :key="`product-main__tag-category[${k}]`">
                {{ category.title }}
              </nuxt-link>
            </template>
          </div>
          <div class="product-main__amount-selectors">
            <div v-on:click="updateAmount(~~i)" v-for="(i, k) in amounts" :key="`product-main__amount-selectors[${k}]`" class="selector" :class="{active: ~~i === amount}">
              <div>
                <span>{{ i }}</span>
                <span class="piece">件</span>
              </div>
            </div>
          </div>
          <div class="product-main__prices">
            <div class="product-main__price latest">
              <div class="title">
                新
              </div>
              <div class="price">
                ${{ get(find(product.latestPrice.prices, {amount}), 'value', '') }}
              </div>
            </div>
            <div class="product-main__price week">
              <div class="title">
                過去<strong>{{ day }}</strong>天平均
              </div>
              <div class="price">
                {{ pastAveragePrice ? `$${pastAveragePrice}` : `-` }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Product from '~/mixins/Product'
import find from 'lodash/find'
import get from 'lodash/get'
export default {
  name: 'product-main',
  props: {
    product: {
      required: true,
      type: Object
    },
    amount: {
      required: true,
      type: Number
    },
    day: {
      required: true,
      type: Number
    }
  },
  mixins: [
    Product
  ],
  methods: {
    find,
    get,
    updateAmount(a) {
      this.$parent.updateAmount(a)
    },
  },
}
</script>
<style lang="stylus" scoped>
.product-main
  &__title
    font-size 22px
  &__image
    margin-top 20px
    img
      width 100%

  &__summary
    display flex
    flex-direction column
    > div
      margin-top 15px
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
      box-shadow -1px 2px 2px 0px #ada8e0
      &:after
        border-left 10px solid #b8d3ff
    &.category
      background-color #fbdbe1
      box-shadow -1px 2px 2px 0px #e0a8b1
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
  &__redirect
    display flex
    justify-content flex-end
    height 30px
    a
      font-size 14px
      display flex
      align-items center
      padding 3px 6px
      color #adadad
      box-shadow 0px 0 5px 1px #b0b0ff
      border-radius 5px
</style>


