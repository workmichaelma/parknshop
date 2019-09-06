<template>
  <div class="index-page">
    <div class="container" ref="container">
      <div class="index-page__content" ref="content">
        <div class="product-list">
          <product-card v-for="(product, k) in productList" :key="k" :product="product"/>
          <div v-if="!productList.length">
            無
          </div>
        </div>
        <div class="pointer" ref="pointer"></div>
      </div>
      <div class="index-page__sidebar" :class="{collapse: !isSidebarActive}">
        <index-sidebar :style="sidebarStyle" v-bind="{products}"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import get from 'lodash/get'
import find from 'lodash/find'
import filter from 'lodash/filter'
import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'
import ProductCard from '~/components/Index/ProductCard'
import IndexSidebar from '~/components/Sidebar/Index'

export default {
  name: 'index-page',
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    await store.dispatch('home/fetchProducts', {page: 1})
  },
  data() {
    return {
      page: 1,
      sidebarStyle: {},
      filter: {},
      readyToFetchProducts: false
    }
  },
  head() {
    return {
      title: '格價'
    }
  },
  components: {
    ProductCard,
    IndexSidebar
  },
  methods: {
    ...mapActions({
      fetchProducts: 'home/fetchProducts',
    }),
    find,
    resetSidebar() {
      if (this.$refs.content && this.$refs.container) {
        this.sidebarStyle = { width: `${this.$refs.container.clientWidth - this.$refs.content.clientWidth}px`, opacity: 1 }
      }
    },
    updateFilter(f) {
      this.filter = f
    },
    doFetch () {
      const self = this
      return new Promise(async () => {
        self.page++
        self.readyToFetchProducts = false
        await self.fetchProducts({page: self.page})
        self.$forceUpdate()
      })
    }
  },
  computed: {
    ...mapGetters({
      products: 'home/getAllProduct',
      isSidebarActive: 'index-sidebar/isActive'
    }),
    layout() {
      return {
        content: this.isSidebarActive ? 'col-md-8' : 'col-md-12',
        sidebar: this.isSidebarActive ? 'col-md-4' : ''
      }
    },
    productList() {
      return filter(this.products, p => {
        if (isEmpty(this.filter)) {
          return true
        } else {
          const category = this.filter.category.showAll || reduce(p.categories, (show, c, i) => {
            return show || !!find(this.filter.category.on, {code: c.code})
          }, false)
          const brand = this.filter.brand.showAll || reduce(p.brands, (show, b, i) => {
            return show || !!find(this.filter.brand.on, {code: b.code})
          }, false)
          return category && brand
        }
      })
    }
  },
  mounted() {
    const self = this
    this.observer = new IntersectionObserver(async entries => {
      self.readyToFetchProducts = get(entries, '[0].intersectionRatio', 0) > 0
    }, {
      rootMargin: '-50% 0px 50% 0px'
    })
    this.observer.observe(this.$refs.pointer)

    window.addEventListener('scroll', e => {
      if (this.readyToFetchProducts) {
        this.doFetch()
      }
    })

    this.resetSidebar()
    window.addEventListener('resize', e => {
      self.resetSidebar()
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', {})
    window.removeEventListener('resize', {})
  },
}
</script>

<style lang="stylus" scoped>
.index-page
  overflow-y hidden
  .container
    display flex
  &__content
    padding-top 50px
    padding-bottom 50px
    flex 1 1 auto
  &__sidebar
    flex 0 0 250px
    &.collapse
      flex-basis 2px
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
