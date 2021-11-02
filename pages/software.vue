<template>
  <div class="flex flex-wrap bg-white w-full container mx-auto">
    <div class="w-full md:w-1/4 px-4 mb-4 md:mb-0 bg-red-500">
      Filters
    </div>
    <div class="w-full md:w-3/4 px-4 mb-4 md:mb-0 bg-blue-200">
      Search bar

      <div class="flex flex-wrap ">
        <div v-for="(item,index) in items" :key="index" class="w-1/2 p-4">
          <div class="py-12 px-10 rounded-lg bg-white">
            <span class="mb-6 flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-gray-50 font-bold font-heading">
              {{ index + 1 }}
            </span>
            <h3 class="mb-4 text-4xl lg:text-5xl font-bold font-heading">
              Suspendisse interdum ullamcorper elit, at consequat libero.
            </h3>
            <p class="text-lg text-gray-500 leading-loose">
              Etiam pellentesque non nibh non pulvinar. Mauris posuere, tellus sit amet tempus vestibulum, erat augue imperdiet.
            </p>
          </div>
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
  },
  {
    name: 'hello'
  },
  {
    name: 'hello'
  },
  {
    name: 'hello'
  }, {
    name: 'hello'
  }

]
</script>

<style scoped>

</style>
