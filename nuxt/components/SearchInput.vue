<template>
  <input type="text" :value="searchText" @input="$emit('input', $event.target.value)" ref="input" @keyup.enter="submit" />
</template>
<script>
export default {
  name: 'input-text',
  props: ['searchText'],
  methods: {
    submit() {
      this.$router.push({path: `/search/${this.searchText}`})
    }
  },
  watch: {
    $route() {
      this.$emit('input', '')
      this.$refs.input.value = ''
    }
  }
}
</script>
<style lang="stylus" scoped>
input
  width 100%
  outline none
  border-style none
  border-radius 4px
  border 1px solid #d6d6d6
  background-color white
  background-clip padding-box
  font-size 17px
  line-height 1.52947
  font-weight 400
  letter-spacing -.021em
  padding-left 5px
  font-size 12px
  height 30px
  &::placeholder
    font-size 10px
    color #c0c0c0
</style>

