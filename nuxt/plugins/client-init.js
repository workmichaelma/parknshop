
import Vue from 'vue'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

/**
 * Executes before mounted. For initializing libraries and stores.
 */
export default (context) => {
  const { store, app } = context

  // For initializing stores from local storage
  if (!app.mixins) {
    app.mixins = []
  }
  app.mixins.push({
    mounted() {
      // store.dispatch('clientInit')
    }
  })
}