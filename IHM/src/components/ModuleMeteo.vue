<template>
  <div class="weather widget">

    <div class="remove-buton" @click="rmvWidget">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M12 21.6C17.302 21.6 21.6 17.302 21.6 12C21.6 6.69809 17.302 2.40002 12 2.40002C6.69809 2.40002 2.40002 6.69809 2.40002 12C2.40002 17.302 6.69809 21.6 12 21.6ZM8.40002 10.8C7.73728 10.8 7.20002 11.3373 7.20002 12C7.20002 12.6628 7.73728 13.2 8.40002 13.2H15.6C16.2628 13.2 16.8 12.6628 16.8 12C16.8 11.3373 16.2628 10.8 15.6 10.8H8.40002Z" />
      </svg>

    </div>

    <div class="flex flex-col w-full gap-10">
      <!-- LE JOUR -->
      <p class="weather-text-m">{{ module_meteo.date[0] }}</p>
      <!-- LA TEMPERATURE -->
      <p class="weather-text-m">{{ module_meteo.temperature + module_meteo.uniteDegre }}</p>
      <!-- AUTRES -->
      <div class="flex justify-evenly">

        <div class="flex">
          <!-- HUMIDITY -->
          <p class="weather-info">{{ module_meteo.humidity }}</p>
          <img class="weather-icon" src="../assets/photo/logo_humidity.png" alt="logo humidity">
        </div>

        <div class="flex">
          <!-- WIND -->
          <img class="weather-icon" src="../assets/photo/logo_wind.png" alt="logo wind">
          <p class="weather-info">{{ module_meteo.wind + module_meteo.uniteWind }}</p>
        </div>

      </div>
    </div>

    <div class="flex flex-col w-full gap-10" v-for="i in 2">
      <!-- LE JOUR -->
      <p class="weather-text-m">{{ module_meteo.date[i] }}</p>

      <!-- LA TEMPERATURE -->
      <p class="weather-text-s"> Max {{ module_meteo.temperaturesMax[i] + module_meteo.uniteDegre }}</p>
      <p class="weather-text-s"> Min {{ module_meteo.temperaturesMin[i] + module_meteo.uniteDegre }}</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'MeteoRennes',
  data() {
    return {
      module_meteo: {
        temperature: null,
        temperaturesMax: [],
        temperaturesMin: [],
        uniteDegre: "°C",
        humidity: null,
        uniteHumidity: "%",
        wind: null,
        uniteWind: "km/h",
        date: [],
        error: null,

      },
      days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    };
  },
  methods: {
    getWeather() {
      const urlParams = new URLSearchParams();
      urlParams.append('forecast_days', 3);
      urlParams.append('format', 'json');
      urlParams.append('latitude', '48.0833');
      urlParams.append('longitude', '-1.6833');
      urlParams.append('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m');

      fetch("https://api.open-meteo.com/v1/forecast?" + urlParams)
        .then(response => response.json())
        .then(response => {
          const dayIndex = new Date(response.current.time).getDay();

          this.module_meteo.temperature = response.current.temperature_2m
          this.module_meteo.humidity = response.current.relative_humidity_2m
          this.module_meteo.wind = response.current.wind_speed_10m
          this.module_meteo.date = this.days.slice(dayIndex, dayIndex + 3);
        })
        .catch(error => this.module_meteo.error = error);
    },

    getNextDayWeather() {
      const urlParams = new URLSearchParams();
      urlParams.append('forecast_days', 3);
      urlParams.append('format', 'json');
      urlParams.append('latitude', '48.0833');
      urlParams.append('longitude', '-1.6833');
      urlParams.append('daily', 'temperature_2m_max,temperature_2m_min');

      fetch("https://api.open-meteo.com/v1/forecast?" + urlParams)
        .then(response => response.json())
        .then(response => {

          this.module_meteo.temperaturesMax = response.daily.temperature_2m_max
          console.log("val1")
          console.log(this.module_meteo.temperatureMax)
          this.module_meteo.temperaturesMin = response.daily.temperature_2m_min
          console.log("val2")
          console.log(this.module_meteo.temperaturesMin)
          this.module_meteo.date = this.days[dayIndex];

        })
        .catch(error => this.module_meteo.error = error);
    },
  },
  created() {
    this.getWeather();
    this.getNextDayWeather();
  },
};
</script>

<style lang="scss" scoped>
.weather {
  display: flex;
  gap: 0.5rem;

  &-text-m {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  &-text-s {
    font-size: 15px;
    font-weight: bold;
    text-align: center;
  }

  &-info {
    font-size: 15px;
    font-weight: bold;
  }

  &-icon {
    width: 15px;
    height: 15px;
  }
}

.remove-buton {
  width: 2rem;
  height: 2rem;
  fill: #3498db;

  position: absolute;
  top: 0px;
  right: 0px
}
</style>