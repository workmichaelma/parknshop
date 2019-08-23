<template>
  <div class="index-sidebar">
    <div v-on:click="turnOn(!isActive)" class="index-sidebar__toggler">
      <div class="toggler" :class="{left: isActive, right: !isActive}"></div>
    </div>
    <div class="index-sidebar__content" :class="{hide: !isActive}">
      <div class="index-sidebar__show-report">
        <div v-on:click="showReport = !showReport" class="on-off-button" :class="{on: showReport}"></div>
        <div>
          只顯示今天特價
        </div>
      </div>
      <div class="index-sidebar__filters">
        <div class="index-sidebar__categories filter">
          <div v-for="(c, key) in categories" :key="`index-sidebar__category[${key}]`" v-on:click="toggle(c, 'category')" class="index-sidebar__category filter__item">
            <div class="toggle-button" :class="{on: find(filter.category.on, c)}"></div>
            <div>{{ c.title }}</div>
          </div>
        </div>
        <div class="index-sidebar__brands filter">
          <div v-for="(b, key) in brands" :key="`index-sidebar__brand[${key}]`" v-on:click="toggle(b, 'brand')" class="index-sidebar__brand filter__item">
            <div class="toggle-button" :class="{on: find(filter.brand.on, b)}"></div>
            <div>{{ b.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import uniq from 'lodash/uniq'
import reduce from 'lodash/reduce'
import pull from 'lodash/pull'
import find from 'lodash/find'
import reject from 'lodash/reject'
export default {
  name: 'index-sidebar',
  data() {
    return {
      showReport: true,
      filter: {
        category: {
          list: [],
          on: [],
          off: []
        },
        brand:  {
          list: [],
          on: [],
          off: []
        }
      },
      categories: [],
      brands: []
    }
  },
  props: {
    products: {
      required: true,
      type: Array
    }
  },
  computed: {
    ...mapGetters({
      isActive: 'index-sidebar/isActive'
    }),
  },
  methods: {
    ...mapActions({
      turnOn: 'index-sidebar/setActive'
    }),
    find,
    init() {
      this.categories = reduce(reduce(this.products.map(p => {
        return p.categories
      }), (v1, v2) => {
        return [...v1, ...v2]
      }), (arr, v, k) => {
        if (!find(arr, {code: v.code})) {
          arr.push(v)
        }
        return arr
      }, [])
      this.brands = reduce(reduce(this.products.map(p => {
        return p.brands
      }), (v1, v2) => {
        return [...v1, ...v2]
      }), (arr, v, k) => {
        if (!find(arr, {code: v.code})) {
          arr.push(v)
        }
        return arr
      }, [])

      this.categories.forEach(c => {
        if (!this.filter.category.list.includes(c.code)) {
          this.filter.category.list.push(c.code)
          this.filter.category.on.push(c)
        }
      })
      this.brands.forEach(b => {
        if (!this.filter.brand.list.includes(b.code)) {
          this.filter.brand.list.push(b.code)
          this.filter.brand.on.push(b)
        }
      })

      this.$parent.updateFilter(this.filter)
    },
    toggle(v, k) {
      if (find(this.filter[k].on, v)) {
        this.filter[k].on = reject(this.filter[k].on, v)
        this.filter[k].off.push(v)
      } else {
        this.filter[k].off = reject(this.filter[k].off, v)
        this.filter[k].on.push(v)
      }
    },
  },
  mounted() {
    // this.init()
  },
  watch: {
    filter () {
      this.$parent.updateFilter(this.filter)
    },
    products: {
      handler () {
        this.init()
      },
      immediate: true
    }
  }
}
</script>

<style lang="stylus" scoped>  
.index-sidebar
  position fixed
  &__wrapper
    width auto
  &__toggler
    position absolute
    left -30px
    top calc( 50% - 30px )
    width 30px
    height 60px
    border-bottom-left-radius 60px
    border-top-left-radius 60px
    background #eaecef
    box-shadow -2px 1px 4px 0px #d1cece
    cursor pointer
    display flex
    align-items center
    justify-content center
    .toggler
      border-left 2px solid #fff
      border-top 2px solid #fff
      width 15px
      height 15px
      &.left
        transform rotate(135deg)
      &.right
        margin-left 10px
        transform rotate(315deg)

  &__content
    display flex
    flex-direction column
    align-items center
    padding 50px 20px
    width 100%
    min-height "calc( 100vh - %s )" % $header-height
    border-left 2px solid #f5f5f5
    &.hide
      width 0
      overflow hidden
      padding 0
  &__show-report
    display flex
    align-items center
    font-size 16px
    padding-bottom 20px
    .on-off-button
      on-off-button(40px)
      margin-right 5px
      flex 0 0 40px

  &__filters
    width 100%

    .filter
      border 1px solid #e6e6e6
      padding 8px 12px 0 12px
      max-height 250px
      overflow auto

      &__item
        font-size 13px
        color #898989
        display flex
        align-items center
        user-select none
        cursor pointer
        &:not(:last-child)
          margin-bottom 5px
        .toggle-button
          toggle-button(15px)
          flex-shrink 0
          margin-right 6px
      &:not(:first-child)
        margin-top 30px
</style>

