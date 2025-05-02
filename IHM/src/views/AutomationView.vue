<template>
  <div class="iframe-container">
    <iframe :src="url" frameborder="0" scrolling="no"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "http://rpi-esir2iot.esir.univ-rennes1.fr:1880/"
    };
  }
};
</script>

<style>
.iframe-container {
  width: 100vw; 
  height: 100vh; 
}

iframe {
  width: 100%;
  height: 100%;
}
</style>
