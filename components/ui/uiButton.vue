<template>
  <button
    class="
  transition duration-200
  border border-gray-200 text-gray-500
  w-full py-2.5 rounded-lg text-sm
  shadow-sm hover:shadow-md font-normal text-center inline-block
"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'UIButton'
}
</script>

<style scoped>
/* Trying custom components framework */

</style>
