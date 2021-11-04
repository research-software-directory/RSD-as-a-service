<template>
  <section class="container mx-auto py-4">
    <h1 class="text-3xl">
      Admin pages
    </h1>
    <section v-if="isLoggedIn">
      <pre>{{ JSON.stringify(userSession,null,2) }}</pre>
    </section>
    <section v-else class="text-5xl text-red-500 my-8">
      403 - Not allowed
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { isLoggedIn, userSession } from '~/api/auth'

export default defineComponent({
  setup () {
    return {
      isLoggedIn,
      userSession
    }
  }
})
</script>
