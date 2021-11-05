<template>
  <div>
    <!-- Logged in -->
    <div v-if="isLoggedIn" class="hover:bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center">
      <img
        class="cursor-pointer h-8 w-8 rounded-full"
        :src="avatar"
        @click="toProfile"
      >
    </div>
    <!-- Not logged in-->
    <div v-else>
      <div>
        <label for="login-modal" class="btn btn-primary btn-md modal-button">
          Login access
        </label>
        <input id="login-modal" type="checkbox" class="modal-toggle">
        <div class="modal">
          <div class="modal-box">
            <user-login-form />
            <div class="modal-action">
              <label for="login-modal" class="btn">Close</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from '@nuxtjs/composition-api'
import { userSession, isLoggedIn } from '~/api/auth'

let avatar = require('~/assets/img/avatar.svg')
if (userSession?.user?.user_metadata?.avatar_url) {
  avatar = userSession?.user.user_metadata.avatar_url
}

const router = useRouter()
function toProfile () {
  router.push({ name: 'profile' })
}

</script>
