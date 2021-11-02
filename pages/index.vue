<template>
  <div class="p-20">
    {{ hello() }}
  </div>
</template>

<script setup lang="ts">
// Using Vue 3 script setup with composition api
import hello from '~/api/example'
</script>
