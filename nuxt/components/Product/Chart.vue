<template>
  <div class="product__chart">
    <div class="container">
      <div class="row">
        <div class="product__chart-title col-md-12">
          <div>過去 </div>
          <div class="product__chart-selectors">
            <div v-for="(d, k) in [3, 7, 14, 30]" v-on:click="updateDay(d)" :key="`product__chart-selector[${k}]`" class="product__chart-selector" :class="{'active': d === day}">{{ d }}</div>
          </div>
          <div> 天價格歷史</div>
        </div>
      </div>
      <div class="row">
        <no-ssr>
          <div class="product__chart-graph col-md-12 col-lg-8 col-lg-offset-2">
            <ve-line v-bind="{data: chartData, grid, extend, settings, colors}" :legend-visible="false" :width="`100%`"></ve-line>
          </div>
        </no-ssr>
      </div>
    </div>
  </div>
</template>

<script>
import Product from '~/mixins/Product'
import get from 'lodash/get'
import find from 'lodash/find'
import min from 'lodash/min'
import max from 'lodash/max'
export default {
  name: 'product-chart',
  mixins: [
    Product
  ],
  props: {
    product: {
      required: true,
      type: Object
    },
    amount: {
      required: true,
      type: Number,
    },
    day: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      grid: {
        show: true,
        backgroundColor: '#f5f5f5',
        borderColor: 'transparent'
      },
      extend: {
        series: {
          label: {
            show: true,
            position: 'top'
          }
        }
      },
      colors: ['#5688bb']
    }
  },
  computed: {
    chartData() {
      return {
        columns: ['日期', '價格'],
        rows: [...this.pastPrices, this.product.latestPrice].map(record => {
          const day = new Date(record.date).toLocaleString('en-GB', { timeZone: 'Asia/Hong_Kong' })
          return {
            '日期': `${day.substring(0, 2)}/${day.substring(3,5)}`,
            '價格': parseFloat(get(find(record.prices, {amount: this.amount}), 'value', 0))
          }
        })
      }
    },
    settings() {
      const prices = this.chartData.rows.map(r => {
        return r['價格']
      })

      return {
        scale: [true, true],
        min: [~~(min(prices) * 0.9) - 1],
        max: [~~(max(prices) * 1.1) + 1]
      }
    }
  },
  methods: {
    updateDay(d) {
      this.$parent.updateDay(d)
    }
  }
}
</script>

<style lang="stylus" scoped>
.product__chart
  margin-top 30px
  border-top 1px solid #f5f5f5
  &-title
    display flex
    justify-content center
    align-items center
    margin-top 30px
  &-selectors
    display flex
    border 1px solid #dddddd
    font-size 26px
    line-height 32px
    margin 0 10px
  &-selector
    padding 0 10px
    background-color #f8f8f8bf
    cursor pointer
    &:not(:first-child)
      border-left 1px solid #dddddd
    &.active
      background-color #e2e2e2
</style>

