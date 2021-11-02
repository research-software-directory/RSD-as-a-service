<template>
  <div class="">
    <LoginModal />
    {{ hello() }}
    <nuxt-link to="/hello" class="btn">
      Go to Nuxt content
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
// Using Vue 3 script setup with composition api
import hello from '~/api/example'
</script>
