<script setup lang="ts">

// IMPORT
import {VueFinalModal} from "vue-final-modal";
import LineChartComponent from "@/components/LineChartComponent.vue";

// Propriétés d'entrée du composant
const props = defineProps<{
  title?: string,
  data?: Array<any>,
}>()


// Fonction d'émission d'événement
const emit = defineEmits(["onclose"])

// on recupere le nombre de grandeur physique a afficher pour déterminer le nombre de graphique a afficher
const nbData = Object.keys(props.data["name"]).length
//console.log("Nombre de grandeur physique : ", nbData)

let deviceTime = props.data["deviceTime"]
let deviceUnit = props.data["unit"]
let deviceValue = props.data["valueGraph"]
let deviceName = props.data["name"]

//console.log("deviceTime : ", deviceTime)
//console.log("deviceUnit : ", deviceUnit)
//console.log("deviceValue : ", deviceValue)
//console.log("deviceName : ", deviceName)


</script>

<template>
  <VueFinalModal
      class="confirm-modal-content"
      content-class="confirm-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
  >
    <!--    Affiche N lineChart en fonction du nombre de paramètres détecté-->
    <LineChartComponent
        v-for="(item, index) in Array(nbData)"
        :key="index"
        v-model:title="deviceName[index]"
        :timeTabme="deviceTime"
        :unit="deviceUnit[index]"
        :value="deviceValue[index]"
        @mounted="() => console.log('index:', index, 'item:', item)"
    />

    <button class='button' @click="emit('close')">
      Fermer
    </button>
  </VueFinalModal>
</template>

<style scoped>

.confirm-modal-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  //width: 60%;
  //height: 80%;
}

</style>