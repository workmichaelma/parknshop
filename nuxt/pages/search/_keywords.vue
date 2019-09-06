<template>
  <div class="search">
    <div class="search__top">
      <div class="container">
        <div class="row">
          <div class="search__input col-md-7">
            <search-input v-model="searchText" v-bind="{searchText}" />
            <nuxt-link :to="`/search/${searchText}`" class="search__button">
              <search-icon />
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="search__bot">
      <div class="container">
        <div class="row">
          <div class="search__result col-md-12">
            <product-card v-for="(product, k) in products" :key="k" :product="product" class="search__product"/>
            <div class="search__empty" v-if="keywords !== ''">
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
import SearchInput from '~/components/SearchInput'
import SearchIcon from '~/components/SearchIcon'
export default {
  name: 'search',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    try {
      const keywords = route.params.keywords
      if (keywords && keywords !== 'undefined' && keywords !== 'false') {
        const products = await store.dispatch('search/fetchSearchResult', {keywords, page: 1})
      } else {
        throw new Error()
      }
    } catch (err) {
      redirect('/')
    }
  },
  head() {
    return {
      title: this.keywords
    }
  },
  data() {
    return {
      searchText: ''
    }
  },
  components: {
    ProductCard,
    SearchInput,
    SearchIcon,
  },
  computed: {
    ...mapGetters({
      getSearchResult: 'search/getSearchResult',
    }),
    keywords() {
      return this.$route.params.keywords
    },
    products() {
      return this.getSearchResult(this.keywords)
    }
  },
  mounted() {
    this.searchText = this.keywords
  },
}
</script>
<style lang="stylus" scoped>
.search
  &__top
    background-color #f5f5f5
  &__input
    width 100%
    height 90px
    display flex
    align-items center
  &__button
    display block
    margin-left 10px
    font-family 'blinker'
    width 20px
    height 20px
  &__bot
    padding 50px 0
  &__result
    display flex
    flex-wrap wrap
  &__product
    margin 0 10px 20px 10px
    flex-basis calc( 50% - 20px )
</style>

