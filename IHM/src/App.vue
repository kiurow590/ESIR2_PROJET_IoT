<script setup>
import {RouterLink, RouterView} from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import {ModalsContainer} from 'vue-final-modal'
import {toastComponent} from "@/components/toast/toastComponent";
import LineChartComponent from "@/components/LineChartComponent.vue";
import {reactive} from "vue";
import {ComponentValueTest} from "@/models/componentValueTest";

toastComponent.successMessages("Toast Initialise")


</script>


<template>
  <div class="container">
    <!-- SIDEBAR -->
    <Sidebar></Sidebar>
    <!-- ROUTER VIEW -->
    <RouterView/>
    <!-- MODALS -->
    <ModalsContainer/>

  </div>

<!--  <LineChartComponent v-model:title="ComponentValueTest.data.tableTitle"-->
<!--                      :elementTable="ComponentValueTest.data.elementTable"-->
<!--  />-->

</template>

<style lang="scss">
:root {
  --primary: #4ade80;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #ffffff;
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.container {
  display: flex;

  main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 1024px) {
      padding-left: 6rem;
    }
  }
}
</style>
