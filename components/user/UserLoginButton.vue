<template>
  <div>
    <!-- Logged in -->
    <div v-if="isLoggedIn" class="hover:bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center">
      <img
        class="cursor-pointer h-8 w-8 rounded-full"
        :src="userSession.user.user_metadata.avatar_url || require('~/assets/img/avatar.svg')"
        @click="toProfile"
      >
    </div>
    <!-- Not logged in-->
    <div v-else>
      <div>
        <label for="login-modal" class="btn btn-primary btn-md modal-button">
          <IconUser />
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

const router = useRouter()
function toProfile () {
  router.push({ name: 'profile' })
}

</script>
