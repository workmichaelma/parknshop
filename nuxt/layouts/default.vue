<template>
  <div class="default">
    <MainHeader />
    <div class="main-layout">
      <div class="container">
        <div class="row">
          <nuxt class="nuxt-page" :class="[layout.nuxt]"/>
          <side-bar-right :class="[layout.sidebarR]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainHeader from '../components/MainHeader/Index'
import SideBarRight from '../components/Sidebar/Right'
export default {
  name: 'default',
  components: {
    MainHeader,
    SideBarRight
  },
  computed: {
    ...mapGetters({
      sidebarRisActive: 'sidebarR/isActive'
    }),
    layout() {
      return {
        nuxt: this.sidebarRisActive ? 'col-md-10' : 'col-md-12',
        sidebarR: this.sidebarRisActive ? 'col-md-2': ''
      }
    }
  },
  methods: {
    ...mapActions({ 
    })
  }
}
</script>
<style lang="stylus" scoped>
.default
  min-height 100vh
  width 100%
  padding-top $header-height

.main-layout
  background-color #ffffff

.nuxt-page
  max-width calc( 100% - 2px )
  min-height "calc( 100vh - %s )" % $header-height
  padding-top 50px
</style>


<style>
html {
  font-family: "SF Pro HK","SF Pro Text","SF Pro Icons","PingFang HK","Helvetica Neue","Helvetica","Arial",sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  color: #2c3e50;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
