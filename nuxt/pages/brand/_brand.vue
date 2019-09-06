<template>
  <div class="brand">
    <div class="brand__top">
      <div class="container">
        <div class="row">
          <div class="brand__title col-md-12">
            {{ brand }}
          </div>
        </div>
      </div>
    </div>
    <div class="brand__bot">
      <div class="container">
        <div class="row">
          <div class="brand__result col-md-12">
            <product-card v-for="(product, k) in products" :key="k" :product="product" class="brand__product"/>
            <div class="brand__empty" v-if="!products">
              無相關產品
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import client from '~/api/apollo-client'
import { SEARCH_PRODUCT } from '~/api/query/search.gql'
import ProductCard from '~/components/Index/ProductCard'
export default {
  name: 'brand',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    try {
      const brand = route.params.brand
      if (brand) {
        await store.dispatch('brand/fetchProducts', {title: brand})
      }
    } catch (err) {
      console.log(err)
      redirect('/')
    }
  },
  head() {
    return {
      title: this.brand
    }
  },
  components: {
    ProductCard,
  },
  computed: {
    ...mapGetters({
      getAllProduct: 'brand/getAllProduct',
    }),
    brand() {
      return this.$route.params.brand
    },
    products() {
      return this.getAllProduct(this.brand)
    }
  },
}
</script>
<style lang="stylus" scoped>
.brand
  &__top
    background-color #f5f5f5
  &__title
    height 90px
    font-size 30px
    display flex
    align-items center
    font-family 'blinker'
  &__bot
    padding 50px 0
  &__result
    display flex
    flex-wrap wrap
  &__product
    margin 0 10px 20px 10px
    flex-basis calc( 50% - 20px )
</style>

