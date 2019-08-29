<template>
  <div class="product">
    <product-main v-bind="{product, amount, day}"/>
    <product-chart v-bind="{product, amount, day}"/>
    <product-recommend v-bind="{product}"/>>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Product from '~/mixins/Product'

import ProductMain from '~/components/Product/Main'
import ProductChart from '~/components/Product/Chart'
import ProductRecommend from '~/components/Product/Recommend'

export default {
  name: 'product-page',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    try {
      const code = route.params.code
      await store.dispatch('product/fetchProduct', {code})
      const product = store.getters['product/getProduct'](code)
      if (!product) {
        res.redirect(404, '')
      }
     } catch (err) {
       console.log(err)
       return
     }
  },
  mixins: [
    Product
  ],
  components: {
    ProductChart,
    ProductMain,
    ProductRecommend
  },
  computed: {
    ...mapGetters({
      getProduct: 'product/getProduct',
    }),
    product() {
      return this.getProduct(this.$route.params.code)
    },
  },
  methods: {
    ...mapMutations({
      saveCategory: 'category/saveCategory'
    }),
    updateAmount(a) {
      this.amount = a
    },
    updateDay(d) {
      this.day = d
    }
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
  padding-top 50px
  padding-bottom 50px
  img
    width 100%

  &__separator
    height 1px
    background-color #bbbbbb
    // &-graph
    //   width 400px
    //   height 400px
</style>

