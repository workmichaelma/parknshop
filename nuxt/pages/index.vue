<template>
  <div class="index-page">
    <div class="product-list">
      <product-card v-for="(product, k) in products" :key="k" :product="product" />
    </div>
    <div class="pointer" ref="pointer"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import get from 'lodash/get'
import ProductCard from '~/components/Index/ProductCard'

export default {
  name: 'index-page',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    await store.dispatch('product/fetchProducts', {page: 1})
  },
  data() {
    return {
      page: 1
    }
  },
  components: {
    ProductCard
  },
  methods: {
    ...mapActions({
      fetchProducts: 'product/fetchProducts',
      isSidebarActive: 'layout/isSidebarActive'
    })
  },
  computed: {
    ...mapGetters({
      products: 'product/getAllProduct'
    }),
    layout() {
      // return this.isSidebarActive ? ''
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(async entries => {
      if (get(entries, '[0].intersectionRatio', 0) > 0) {
        this.page++
        await this.fetchProducts({page: this.page})
        this.$forceUpdate()
      }
    }, {})
    this.observer.observe(this.$refs.pointer)
  },
}
</script>

<style lang="stylus" scoped>
.index-page
  .product-list
    display flex
    flex-wrap wrap
    justify-content space-around
    align-items flex-start
    > .product-card
      +fix(sm)
        flex-basis 90%
      +fix(lg)
        flex-basis 48%
      &:not(:last-child)
        margin-bottom 60px
</style>
