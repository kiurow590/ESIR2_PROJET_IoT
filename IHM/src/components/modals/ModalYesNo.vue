<script setup lang="ts">

import {VueFinalModal} from "vue-final-modal";

defineProps<{
  title?: string,
  question?: string
}>()

const emit = defineEmits(["confirm", "refuse"]);

</script>

<template>

  <VueFinalModal
      class="confirm-modal"
      content-class="confirm-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
  >
    <h1>{{ title }}</h1>
    <p>{{ question }}</p>

    <button class='button' @click="emit('confirm')">
      Yes
    </button>
    <button class='button' @click="emit('refuse')">
      Nope
    </button>
  </VueFinalModal>

</template>

<style scoped>

</style>