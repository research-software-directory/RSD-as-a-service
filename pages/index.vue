<template>
  <div class="bg-red-700">
    {{ hello }}

    <nuxt-link to="/hello" class="btn">
      hello RSD
    </nuxt-link>
    <Tutorial />
  </div>
</template>

<script>
import hello from '~/api/example'

export default {
  data () {
    return {
      hello: hello()
    }
  }
}
</script>
