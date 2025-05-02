<script setup lang="ts">
import {VueFinalModal} from 'vue-final-modal';
import { Authcomponent } from "@/models/AuthModel.js";

const props = defineProps<{
  title?: string,
  mode?: string,
  data?:  Authcomponent,
}>()

console.log('props', props.title, props.mode, props.data)

const newComp = props.mode === "edit" ? new  Authcomponent(
    props.data?.id || '',
    props.data?.password || ''
) : new  Authcomponent('', '');

const emit = defineEmits(["confirm"])

</script>

<template>
  <VueFinalModal
      class="confirm-modal"
      content-class="confirm-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
  >
    <h1>{{ title }}</h1>
    <form>
      <!-- Formulaire pour le mode 'add' -->
      <!--<label for="IDComp">Mot de passe</label><br>-->
      <input v-if="mode === 'edit'" type="password" id="iDComp" name="IDComp" v-model="newComp.password"
             placeholder="mon mot de passe" disabled="disabled">
      <input v-else required type="password" id="iDComp" name="IDComp" v-model="newComp.password"
             placeholder="mon mot de passe">
    </form>


    <button class='button' @click="emit('confirm', newComp)">
      Confirm
    </button>
  </VueFinalModal>
</template>

<style>
.confirm-modal {
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-modal-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
}

.confirm-modal-content > * + * {
  margin: 0.5rem 0;
}

.confirm-modal-content h1 {
  font-size: 1.375rem;
}

.confirm-modal-content button {
  margin: 0.25rem 0 0 auto;
  padding: 0 8px;
  border: 1px solid;
  border-radius: 0.5rem;
}

.dark .confirm-modal-content {
  background: #000;
}
</style>