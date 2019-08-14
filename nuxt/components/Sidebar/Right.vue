<template>
  <div class="side-bar-right">
    <div class="side-bar-right__wrapper">
      <div v-on:click="turnOn(!isActive)" class="side-bar-right__toggler">
        <div class="toggler" :class="{left: isActive, right: !isActive}"></div>
      </div>
      <div class="side-bar-right__content" :class="{hide: !isActive}">
        <div class="side-bar-right__show-report">
          <div v-on:click="showReport = !showReport" class="on-off-button" :class="{on: showReport}"></div>
          <div>
            只顯示今天特價
          </div>
        </div>
        <div class="side-bar-right__filters">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'side-bar-right',
  data() {
    return {
      showReport: true
    }
  },
  computed: {
    ...mapGetters({
      isActive: 'sidebar/isActive'
    })
  },
  methods: {
    ...mapActions({
      turnOn: 'sidebar/setActive'
    })
  },
}
</script>

<style lang="stylus" scoped>  
.side-bar-right
  min-width 1px  
  &__wrapper
    position sticky
    top $header-height
    left 0
    min-height "calc( 100vh - %s )" % $header-height
    border-left 2px solid #f5f5f5
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
    padding 50px 0
    width 100%
    height 100%
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
</style>

