<template>
  <div class="side-bar-right">
    <div v-on:click="turnOn(!isActive)" class="side-bar-right__toggler">
      <div class="toggler" :class="{left: isActive, right: !isActive}"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'side-bar-right',
  computed: {
    ...mapGetters({
      isActive: 'layout/isSidebarActive'
    })
  },
  methods: {
    ...mapActions({
      turnOn: 'layout/setSidebarActive'
    })
  },
}
</script>

<style lang="stylus" scoped>
.side-bar-right
  position relative
  min-width 1px
  min-height "calc( 100vh - %s )" % $header-height
  border-left 2px solid #f5f5f5
  &__toggler
    position absolute
    left -30px
    top 50%
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
        margin-left 10px
        transform rotate(315deg)
      &.right
        transform rotate(135deg)
</style>

