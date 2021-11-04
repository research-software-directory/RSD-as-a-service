<template>
  <div>
    <form class="px-5 py-7">
      <h1 class="font-bold text-center text-2xl mb-5">
        Research Software Directory
      </h1>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Access with email (no password)</span>
        </label>
        <input v-model="email" type="email" placeholder="Type your email" class="input input-bordered">
      </div>
      <label for="login-modal" class="btn btn-primary w-full mt-3" @click="accessWithEmail">
        <IconEmail class="mr-2" />
        Access with email
      </label>
    </form>
    <div class="p-5">
      <label class="label">
        <span class="label-text">Or access with a provider</span>
      </label>
      <div class="grid grid-cols-2 gap-3">
        <!-- <button type="button" class="rsd-button primary">
          <IconSurfConext class="mr-2" />
          Surf Conext
        </button> -->

        <button type="button" class="rsd-button" @click="loginWithAzure">
          <icon-microsoft class="mr-2" />
          Microsoft
        </button>

        <button type="button" class="rsd-button" @click="loginWithGithub">
          <icon-github class="mr-2" />
          Github
        </button>

        <!-- <button type="button" class="rsd-button">
          <icon-google class="mr-2" />
          Google
        </button> -->
      </div>
    </div>
    <div class="py-5">
      <div class="flex justify-end">
        <button class="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block align-text-bottom	">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="inline-block ml-1">Help</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/composition-api'
import { loginWithEmail, loginWithGithub, loginWithAzure } from '~/api/auth'

// import IconSurfConext from '~icons/mdi/message-outline'
// import IconGoogle from '~icons/mdi/google'
import IconGithub from '~icons/mdi/github'
import IconMicrosoft from '~icons/mdi/microsoft'
import IconEmail from '~icons/mdi/email'

const email = ref('')

function accessWithEmail () {
  loginWithEmail(email.value)
  // console.log('🎹', email.value)
}
</script>

<style scoped>

</style>
