<template>
  <div class="flex flex-wrap bg-white w-full container mx-auto">
    <div class="w-full md:w-1/4 px-4 mb-4 md:mb-0 bg-red-500">
      Filters
    </div>
    <div class="w-full md:w-3/4 px-4 mb-4 md:mb-0 bg-blue-200">
      <div>Full text search bar with autocomplete</div>

      <div class="font-bold mt-4">
        # Software: {{ softwareCount }}
      </div>

      <div class="flex flex-wrap ">
        <div
          v-for="({id, title, short_desc, description, version, mentions, contributors, tags},index) in softwareData"
          :key="index"
          class="w-1/2 p-4"
        >
          <div
            class="cursor-pointer py-12 px-10 rounded-lg bg-white h-full"
            @click="$router.push(`software/${id}`)"
          >
            <span class="mb-3 flex items-center justify-center w-8 h-8 rounded-full bg-gray-500 text-gray-50 font-bold font-heading">
              {{ id }}
            </span>
            <h3 class="mb-4 text-xl lg:text-2xl font-bold font-heading">
              {{ title }}
            </h3>
            <p class="text-lg text-gray-500 leading-loose">
              {{ description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted } from '@nuxtjs/composition-api'
import { softwareData, softwareCount, fetchSoftware } from '~/api/software'

onMounted(async () => {
  await fetchSoftware()
})
</script>

<style scoped>

</style>
