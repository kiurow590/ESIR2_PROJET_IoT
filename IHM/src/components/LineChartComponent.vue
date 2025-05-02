<script setup>

// IMPORT
import {defineProps} from 'vue'
import {toastComponent} from "@/components/toast/toastComponent";

// PROPRITIES EN ENTREE DU COMPOSANT
const props = defineProps({
  title: String,
  timeTabme: Array,
  unit: Array,
  value: Array,
})

toastComponent.infoMessages("LineChartComponent initialise " + props.title)

//console.log(props.dataTables)

// console.log("Title : ", props.title)
// console.log("Time : ", props.timeTabme)
// console.log("Unit : ", props.unit)
// console.log("Value : ", props.value)


// Option d'affichage du graphique
const options = {
  animationEnabled: true,
  title: {
    text: props.title,
  },
  axisX: {
    valueFormatString: 'DD MM YYYY HH:mm:ss',
  },
  axisY: {
    title: props.title,
    includeZero: false,
    suffix: props.unit ? props.unit : '',
    lineColor: '#021bcc',
  },
  data: [
    {
      type: 'line',
      xValueFormatString: 'DD MMM',
      yValueFormatString: '##,##.## ' + props.unit,
      dataPoints: props.value.map((value, index) => {
        let yValue;
        if (value["y"] === true) {
          yValue = 1;
        } else if (value["y"] === false) {
          yValue = 0;
        } else {
          yValue = value["y"];
        }

        return {
          x: new Date(value["x"]),
          y: yValue,
        };
      }),
    },
  ],
};


</script>

<template>
  <div class="container">
    <CanvasJSChart class="custom-chart-size" :options="options" :style="styleOptions" @chart-ref="chartInstance"/>
  </div>
</template>


<script>

</script>

<style scoped>
.custom-chart-size {
  width: 500px; /* Set the width as per your requirement */
  height: 300px; /* Set the height as per your requirement */
}
</style>