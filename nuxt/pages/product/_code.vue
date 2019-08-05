<template>
  <div class="product">
    <div class="row">
      <div class="product__title col-md-12">
        {{ product.title }}
      </div>
    </div>
    <div class="row">
      <!-- <div class="product__separator col-md-offset-1 col-md-10" /> -->
    </div>
    <div class="row">
      <div class="product__image col-md-4">
        <img :src="product.image" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    const code = route.params.code
    if (code) {
      await store.dispatch('product/fetchProduct', {code})
    }
  },
  computed: {
    ...mapGetters({
      getProduct: 'product/getProduct'
    }),
    product() {
      return this.getProduct(this.$route.params.code)
    }
  },
  mounted() {
    console.log(this)
  },
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
    font-size 30px
    margin-bottom 20px

  &__image
    margin-top 20px
</style>

