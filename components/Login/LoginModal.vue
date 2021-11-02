<template>
  <div>
    <label for="my-modal-2" class="btn modal-button"> <IconUser />
      Access</label></label>
    <input id="my-modal-2" type="checkbox" class="modal-toggle">
    <div class="modal">
      <div class="modal-box">
        <login-form />

        <div class="modal-action">
          <label for="my-modal-2" class="btn">Close</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/composition-api'

import IconUser from '~icons/mdi/user'
import IconSurfConext from '~icons/mdi/message-outline'
import IconGoogle from '~icons/mdi/google'
import IconGithub from '~icons/mdi/github'
import IconEmail from '~icons/mdi/email'

const firstName = ref('John')

function changeName (name:string = 'Default Name') {
  firstName.value = name
}
</script>
