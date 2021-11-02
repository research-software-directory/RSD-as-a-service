<template>
  <div class="flex flex-col ">
    <section class="py-20 container mx-auto h-full ">
      <nuxt-content :document="content" class="prose max-w-2xl p-4 sm:p-0 mx-auto " />

      <!--Page not found -->
      <div v-if="!!error" class="mt-60 bg-secondary prose">
        <h3>
          Page not found
          <div class="btn btn-ghost" @click="$router.push('/')">
            ← Go back
          </div>
        </h3>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  transition: 'fade',
  data () {
    return {
      content: {},
      error: null
    }
  },
  async fetch () {
    const { page } = this.$route.params
    try {
      this.content = await this.$content(page).fetch()
    } catch {
      this.error = true
    }
  }
}
</script>
