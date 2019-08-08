<template>
  <ve-histogram v-bind="{data: chartData, grid, extend, settings, colors}" :legend-visible="false"></ve-histogram>
</template>

<script>
import min from 'lodash/min'
import max from 'lodash/max'
export default {
  name: 'product-chart',
  props: {
    chartData: {
      required: true,
      type: Object
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
  }
}
</script>

<style lang="stylus" scoped>

</style>

