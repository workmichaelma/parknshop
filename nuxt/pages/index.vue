<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        nuxt-app
      </h1>
      <h2 class="subtitle">
        My exceptional Nuxt.js project
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  methods: {
    ...mapActions({
      fetchReport: 'product/fetchReport'
    })    
  },
  mounted() {
    this.fetchReport()
  },
}
</script>

<style lang="stylus" scoped>

</style>
