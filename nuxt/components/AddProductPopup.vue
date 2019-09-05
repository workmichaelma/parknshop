<template>
  <div v-show="active" class="add-product-popup">
    <div class="box" :class="{mini: step === 3}">
      <div class="box__nav" v-if="step !== 3">
        <div class="box__nav-back" v-on:click="setActive(false)">
          取消
        </div>
        <div class="box__nav-title">
          {{ step === 1 ? `加入新貨品` : step === 2 ? '預覽新貨品' : '' }} 
        </div>
        <div class="box__nav-next" v-on:click="next" :class="{confirmable}">
          確定
        </div>
      </div>
      <div class="box__content">
        <div v-if="loading" class="box__loading">
          <spinner class="box__loading-spinner"/>
        </div>
        <div class="step-1" v-if="step === 1">
          <div class="step-1__title url">
            請輸入貨品網址
          </div>
          <div class="step-1__input url">
            <input type="text" v-model="url" placeholder="例如：https://www.parknshop.com/zh-hk/black-forest-ice-cream/p/BP_350742"/>
            <div class="step-1__input-error" v-show="urlError">
              網址格式錯誤，請重新輸入
            </div>
          </div>
          <div class="step-1__title code">
            或輸入貨品編號
          </div>
          <div class="step-1__input code">
            <input type="text" v-model="code" placeholder="例如：350742" onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))" :class="{codeError}"/>
            <div class="step-1__input-error" v-show="codeError">
              編號格式錯誤，請重新輸入
            </div>
          </div>
        </div>
        <div class="step-2" v-if="step === 2 && product">
          <div class="step-2__title">
            {{ product.title }}
          </div>
          <div class="step-2__image">
            <img :src="product.image"/>
          </div>
          <div class="step-2__bot">
            <div class="step-2__redirect">
              <a :href="`https://www.parknshop.com/zh-hk/code/p/${product.code}`">
                百佳網頁
              </a>
            </div>
            <div class="step-2__price">
              $ {{ price.value }}
            </div>
          </div>
        </div>
        <div class="step-3" v-if="step === 3 && product">
          <div class="step-3__top">
            <div class="step-3__image">
              <img :src="product.image"/>
            </div>
            <div class="step-3__title">
              {{ error ? '產品已有紀錄' : '已成功添加產品' }}
            </div>
          </div>
          <div class="step-3__bot" v-on:click="setActive(false)">
            <div class="step-3__back">
              返回
            </div>
            <nuxt-link :to="`/product/${product.code}`" class="step-3__forward">
              前往產品
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import client from '../api/apollo-client'
import { PREVIEW_PRODUCT, ADD_PRODUCT } from '~/api/query/product.gql'
import isURL from 'validator/lib/isURL'
import get from 'lodash/get'
import spinner from '~/components/Spinner'
export default {
  name: 'add-product-popup',
  data() {
    return {
      code: '',
      url: '',
      codeError: false,
      urlError: false,
      loading: false,
      error: false,
      step: 1,
      product: null
    }
  },
  components: {
    spinner
  },
  computed: {
    ...mapGetters({
      active: 'index-sidebar/showAddProductPopup',
    }),
    confirmable() {
      return !this.loading && !this.urlError && !this.codeError && (this.url != '' || this.code != '')
    },
    price() {
      return (this.product !== null && this.product.prices) ? this.product.prices[0] : null
    }
  },
  methods: {
    ...mapActions({
      setActive: 'index-sidebar/setAddProductPopup'
    }),
    async next() {
      if (this.step === 1) {
        this.loading = true
        
        const product = await client.query({
          query: PREVIEW_PRODUCT,
          variables: {
            code: this.code || '',
            url: encodeURIComponent(this.url) || ''
          },
        })
        this.loading = false
        if (get(product, 'data.previewProduct.title')) {
          this.step = 2
          this.product = product.data.previewProduct
        } else {
          this.error = true
          if (this.code) {
            this.codeError = true
          } else if (this.url) {
            this.urlError = true
          }
        }
      } else if (this.step === 2 && this.product) {
        this.loading = true
        
        const product = await client.mutate({
          mutation: ADD_PRODUCT,
          variables: {
            code: this.product.code
          },
        })
        this.loading = false
        this.step = 3
        if (get(product, 'data.addProduct.title')) {
          this.product = product.data.addProduct
        } else if (!get(product, 'data.addProduct.success')) {
          this.error = true
        }
      }
    }
  },
  watch: {
    code(v) {
      this.url = ''
      this.codeError = v != '' ? ~~v < 1 : false
    },
    url(v) {
      this.code = ''
      this.urlError = v != '' ? !isURL(v) : false
    },
    active(v) {
      this.code = ''
      this.url = ''
      this.codeError = false
      this.urlError = false
      this.loading = false
      this.error = false
      this.step = 1
      this.product = null
    }
  }
}
</script>
<style lang="stylus" scoped>
.add-product-popup
  position fixed
  display flex
  align-items center
  justify-content center
  top 0
  left 0
  right 0
  bottom 0
  background-color rgba(0, 0, 0, 0.6)
  z-index 1000000
  overflow hidden
  .box
    width 375px
    height 667px
    background-color #efeff4
    box-shadow 0px 0px 8px 1px #d3d3d3
    border-radius 15px
    display flex
    flex-direction column
    &.mini
      width 355px
      height 137px
    &__nav
      display flex
      padding 10px
      font-size 14px
      color #54b2fd
      border-bottom 1px solid #d3d3d4
      background-color #f7f7f7
      box-shadow 0px 0px 3px 0px #d8d2d2
      border-top-left-radius 15px
      border-top-right-radius 15px
      &-back
        flex-basis 40px
        cursor pointer
      &-title
        flex-grow 1
        color #000101
        text-align center
      &-next
        flex-basis 40px
        text-align right
        color #c0c0c0
        &.confirmable
          color #54b2fd
          cursor pointer
    &__content
      width 100%
      flex-grow 1
      position relative
    &__loading
      position absolute
      display flex
      align-items center
      justify-content center
      width 100%
      height 100%
      background-color #20202078
      border-bottom-left-radius 15px
      border-bottom-right-radius 15px
      &-spinner
        width 84px
        height 84px
    .step-1
      width 100%
      height 100%
      display flex
      align-items center
      flex-direction column
      padding 20px
      &__title
        color #494a4c
        margin-bottom 5px
        &.code
          margin-top 20px
      &__input
        width 100%
        &-error
          text-align right
          color #f06f6f
          font-size 10px
        > input
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
    .step-2
      display flex
      flex-direction column
      justify-content space-around
      height 100%
      padding 20px 0
      font-family 'Blinker'
      &__title
        padding 0 20px 30px 20px
        font-size 20px
        color #38393a
      &__image
        flex-grow 1
        text-align center
        > img
          max-width 300px
          border 1px solid #f3f3f3
          box-shadow 0px 1px 3px 2px #ececec
      &__bot
        display flex
        align-items center
        justify-content space-between
        margin 20px 10px 0 10px
        padding 10px 8px
        border 1px solid #d3d3d3
        border-radius 4px
      &__redirect
        font-size 16px
        border-bottom 1px solid #54b2fd
        a
          color #54b2fd
          &:hover
            text-decoration none
      &__price
        color #ea8080
        font-size 24px
    .step-3
      width 100%
      height 100%
      display flex
      flex-direction column
      &__top
        display flex
        align-items center
        justify-content center
        flex-grow 1
      &__image
        width 65px
        height 65px
        margin-right 10px
        img
          width 100%
          border-radius 50%
          box-shadow 0px 0px 2px 1px #c3c3c3
      &__title
        padding 10px 0
        text-align center
        font-size 18px
      &__bot
        display flex
        justify-content space-around
        border-top 1px solid #ccc
        height 50px
        > div
        > a
          display block
          flex-basis 50%
          text-align center
          display flex
          align-items center
          justify-content center
          color #54b2fd
          cursor pointer
          &:hover
            text-decoration none
      &__back
        border-right 1px solid #ccc



      

</style>


