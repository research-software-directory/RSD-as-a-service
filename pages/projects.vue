<template>
  <div class="flex flex-wrap bg-white w-full container mx-auto">
    <div class="w-full md:w-1/4 px-4 mb-4 md:mb-0 bg-red-500">
      Filters
    </div>
    <div class="w-full md:w-3/4 px-4 mb-4 md:mb-0 bg-blue-200">
      <div class="flex flex-wrap -m-4">
        <div v-for="(item,index) in items" :key="index" class="w-1/2 p-4">
          {{ index }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const items = [
  {
    name: 'hello'
  },
  {
    name: 'hello'
  }

]
</script>

<style scoped>

</style>
