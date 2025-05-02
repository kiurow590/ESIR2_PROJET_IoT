<template>
    <h4>liste des modules</h4>
    <ul class="my-list">
        <li @click="AddModule">
            Module Temperature
        </li>
        <li>Élément 2</li>
        <li>Élément 3</li>
    </ul>
    <p>{{ test }}</p>
</template>

<script>
export default {
    data() {
    return {
      test: null,
    };
  },
  methods: {
        AddModule() {
            //this.isAdded = !this.isAdded;
            this.test = "test";
        },
    },
};
</script>
  
<style scoped>
.my-list {
    list-style-type: none;
    padding: 10px;
    background-color: #b43838;
    border: 1px solid #21098a;
    border-radius: 5px;
}
</style>
  