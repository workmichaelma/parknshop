<template>
  <div class="category">
    <div class="category__top">
      <div class="container">
        <div class="row">
          <div class="category__title col-md-12">
            {{ category }}
          </div>
        </div>
      </div>
    </div>
    <div class="category__bot">
      <div class="container">
        <div class="row">
          <div class="category__result col-md-12">
            <product-card v-for="(product, k) in products" :key="k" :product="product" class="category__product"/>
            <div class="category__empty" v-if="!products">
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
  name: 'category',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    try {
      const category = route.params.category
      if (category) {
        await store.dispatch('category/fetchProducts', {title: category})
      }
    } catch (err) {
      console.log(err)
      redirect('/')
    }
  },
  head() {
    return {
      title: this.category
    }
  },
  components: {
    ProductCard,
  },
  computed: {
    ...mapGetters({
      getAllProduct: 'category/getAllProduct',
    }),
    category() {
      return this.$route.params.category
    },
    products() {
      return this.getAllProduct(this.category)
    }
  },
}
</script>
<style lang="stylus" scoped>
.category
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

