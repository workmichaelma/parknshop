<template>
  <header class="header">
    <div class="container">
      <div class="row">
        <div class="header__logo col-md-2">
          <nuxt-link to="/">
            <img src="~/static/logo.png" alt="logo">
          </nuxt-link>
        </div>
        <div class="header__search col-md-10" v-show="showSearch">
          <search-input v-model="searchText" v-bind="{searchText}"/>
          <nuxt-link :to="`/search/${searchText}`">
            <search-icon />
          </nuxt-link>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import SearchIcon from '~/components/SearchIcon'
import SearchInput from '~/components/SearchInput'
export default {
  name: 'main-header',
  data() {
    return {
      searchText: ''
    }
  },
  components: {
    SearchIcon,
    SearchInput
  },
  computed: {
    showSearch() {
      return this.$route.path.indexOf('/search') < 0
    }
  }
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

  &__search
    display flex
    justify-content flex-end
    align-items center
    input
      width 200px
      margin-right 5px
      padding-left 10px
    a
      display block
      width 20px
      height 20px
</style>


