<template>
  <header class="header">
    <div class="header__logo">
      <nuxt-link to="/">
        <img src="~/static/logo.png" alt="logo">
      </nuxt-link>
    </div>
  </header>
</template>
<script>
export default {
  name: 'main-header'
}
</script>
<style lang="stylus" scoped>
img
  width 100%
.header
  position fixed
  top 0
  left 0
  width 100%
  height $header-height
  border-bottom 2px solid #f5f5f5
  background-color #ffffff
  z-index 100
  display flex
  align-items center
  justify-content center

  &__logo
    a
      width 50px
      height 50px
      display block
</style>


