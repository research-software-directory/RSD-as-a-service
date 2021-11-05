<template>
  <div class="container mx-auto overflow-hidden">
    <div class="flex justify-center pb-10">
      <div class="mb-8 w-24 h-24 mask mask-hexagon shadow">
        <img
          :src="userSession.user.user_metadata.avatar_url || require('~/assets/img/avatar.svg')"
          class="h-40 w-40 object-cover "
          alt="username"
        >
      </div>
      <div class="ml-10">
        <div class="flex items-center">
          <h2 class="block leading-relaxed font-light text-gray-700 text-3xl">
            {{ userSession.user.user_metadata.full_name }}
          </h2>
        </div>
        <ul class="flex justify-content-around items-center">
          <li>
            <span class="block text-base flex"><span class="font-bold mr-2">23 </span> Posts</span>
          </li>
          <li>
            <span class="cursor-pointer block text-base flex ml-5"><span class="font-bold mr-2">102k </span> Followers</span>
          </li>
          <li>
            <span class="cursor-pointer block text-base flex ml-5"><span class="font-bold mr-2">654 </span> followed</span>
          </li>
        </ul>
        <br>
        <div>
          {{ userSession.user.email }}
        </div>
        <button
          class=" cursor-pointer mt-5 border-2 border-blue-500
            rounded-lg font-bold text-blue-500 px-2 py-2
            transition duration-200
            ease-in-out hover:bg-blue-500 hover:text-white mr-6"
          depressed
          @click="
            logout()
            $router.push('/')
          "
        >
          LOG OUT
        </button>
      </div>
    </div>
    <div>
      App version {{ version }}
    </div>
    <div class="border-b border-gray-300" />
    <div>
      <pre>
      {{ userSession }}
    </pre>
    </div>
  </div>
</template>
<script>
import { userSession, isLoggedIn, logout } from '~/api/auth'
import { version } from '~/package.json'
export default {
  name: 'App',
  middleware: ['auth'],
  setup () {
    return { userSession, logout, isLoggedIn }
  },
  data () {
    return {
      showButton: false
    }
  },
  computed: {
    version () {
      return version
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
