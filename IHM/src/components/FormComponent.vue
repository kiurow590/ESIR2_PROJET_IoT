<script setup>

// Importez les fonctions reactive et ref de vue
import {reactive, ref} from "vue";
import {useStore} from 'vuex'; // Importez useStore de vuex

const store = useStore(); // Utilisez le store

const form = reactive({
  name: "",
  idcomponent: ""
});

const submitted = ref(false); // Créez une référence pour suivre si le formulaire a été soumis

const submitForm = () => { // Créez une fonction pour soumettre le formulaire
  submitted.value = true;
  store.dispatch('addRow', { // Dispatch l'action addRow avec les données du formulaire
    name: form.name,
    idcomponent: form.idcomponent,
    statut: "",
    value: "",
    action: ""
  });
  form.name = ""; // Réinitialisez les champs du formulaire
  form.idcomponent = "";
};
</script>


<script>

export default {
  name: 'FormComponent',
  data() {
    return {
      newComponent: {
        name: '',
        componentId: '',
        statut: '',
        value: '',
        action: ''
      }
    }
  },
  methods: {
    showForm() {
      this.$store.commit('showForm');
    },
    submitForm() {
      this.$store.commit('addRow', this.newComponent);
      this.newComponent = {
        name: '',
        componentId: '',
        statut: '',
        value: '',
        action: ''
      }
    }
  }
}


</script>


<template>
  <h1>Form Component</h1>


  <div> <!-- Affichez le formulaire -->
    <form @submit.prevent="submitForm">
      <label for="name">Name:</label><br>
      <input type="text" id="name" v-model="form.name" required><br>
      <label for="email">ID Coponent:</label><br>
      <input type="text" id="idcomponent" v-model="form.idcomponent" required><br>
      <input type="submit" value="Submit">
    </form>

    <!-- Display form data -->
    <div v-if="submitted">
      <h3>You submitted the following:</h3>
      <div>Name: {{ form.name }}</div>
      <div>ID Component: {{ form.idcomponent }}</div>
    </div>
  </div>

</template>


<style scoped>



</style>