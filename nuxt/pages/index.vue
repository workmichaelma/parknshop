<template>
  <div class="index-page">
    <div class="product-list">
      <product-card v-for="(product, k) in products" :key="k" :product="product" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProductCard from '~/components/Index/ProductCard'

export default {
  name: 'index-page',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    await store.dispatch('product/fetchProducts', {page: 1})
  },
  components: {
    ProductCard
  },
  methods: {
    ...mapActions({
      fetchProducts: 'product/fetchProducts'
    })
  },
  computed: {
    ...mapGetters({
      products: 'product/getAllProduct'
    })
  },
  mounted() {
  },
}
</script>

<style lang="stylus" scoped>
.index-page
  .product-list
    > .product-card
      &:not(:first-child)
        margin-top 60px
</style>
