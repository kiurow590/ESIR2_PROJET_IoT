<template>
    <div class="widget wrapper-square-1x1">
        <label class="choose wrapper-square-1x1 " v-if="!widget?.module">
            <input type="checkbox" class="choose-checkbox" :id="'add-right-widget-'.index">

            <p> Choisir un module </p>
            <p> </p>

            <div class="choose-wrap">
                <ul class="choose-nav">
                    <li v-for="(name, index) in names" :key="index" @click="setName(name)">
                        {{ name }}
                    </li>
                </ul>
            </div>

        </label>

        <div class="content">
            <div class="remove-buton" @click="rmvWidget">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 21.6C17.302 21.6 21.6 17.302 21.6 12C21.6 6.69809 17.302 2.40002 12 2.40002C6.69809 2.40002 2.40002 6.69809 2.40002 12C2.40002 17.302 6.69809 21.6 12 21.6ZM8.40002 10.8C7.73728 10.8 7.20002 11.3373 7.20002 12C7.20002 12.6628 7.73728 13.2 8.40002 13.2H15.6C16.2628 13.2 16.8 12.6628 16.8 12C16.8 11.3373 16.2628 10.8 15.6 10.8H8.40002Z" />
                </svg>
            </div>
            <h1 class="content-title" v-if="widget?.module"> {{ widget.module }} </h1>
        </div>
        <div class="temperature flex">

            <div class="temperature-icon">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
                    <path style="fill:#FFFFFF;" d="M298.464,54.972c0-23.452-19.011-42.464-42.464-42.464c-23.452,0-42.464,19.011-42.464,42.464V186.35
	h84.927V54.972H298.464z" />
                    <path style="fill:#FF7876;" d="M298.464,358.076V186.348h-84.927v171.727c-20.857,13.796-34.623,37.449-34.623,64.33
	c0,42.574,34.512,77.087,77.087,77.087s77.087-34.512,77.087-77.087C333.087,395.526,319.321,371.872,298.464,358.076z" />
                    <g>
                        <path style="fill:var(--dark);" d="M310.972,351.666c0-10.297,0-286.396,0-296.693C310.972,24.661,286.311,0,256,0
		s-54.972,24.661-54.972,54.972c0,10.305,0,286.4,0,296.693c-21.798,16.933-34.623,42.898-34.623,70.739
		C166.405,471.807,206.598,512,256,512s89.595-40.193,89.595-89.595C345.595,394.564,332.77,368.6,310.972,351.666z M226.044,54.972
		c0-16.517,13.439-29.956,29.956-29.956s29.956,13.439,29.956,29.956V86.92h-25.795c-6.91,0-12.508,5.599-12.508,12.508
		s5.599,12.508,12.508,12.508h25.795v12.975h-25.795c-6.91,0-12.508,5.599-12.508,12.508s5.599,12.508,12.508,12.508h25.795v23.912
		h-59.912L226.044,54.972L226.044,54.972z M256,486.984c-35.61,0-64.579-28.969-64.579-64.579c0-21.731,10.847-41.881,29.014-53.898
		c3.502-2.317,5.607-6.232,5.607-10.432V198.856h59.912v159.219c0,4.199,2.106,8.115,5.607,10.432
		c18.168,12.018,29.014,32.168,29.014,53.898C320.579,458.015,291.61,486.984,256,486.984z" />
                        <path style="fill:#58595B;" d="M293.001,409.897c-6.91,0-12.508,5.599-12.508,12.508c0,13.505-10.987,24.493-24.493,24.493
		c-6.91,0-12.508,5.599-12.508,12.508s5.599,12.508,12.508,12.508c27.299,0,49.509-22.208,49.509-49.509
		C305.509,415.497,299.909,409.897,293.001,409.897z" />
                    </g>
                </svg>
            </div>
            <div>
                <span class="temperature-temp">{{ Temp.temperature }}&deg;</span>
                <span class="temperature-high-low">{{ Temp.temperaturesMin }}&deg;/ {{ Temp.temperaturesMax
                    }}&deg;</span>
            </div>

        </div>

        <div class="info flex">
            <div class="humidity flex">

                <div class="humidity-icon">
                    <svg fill="#3498db" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 322.881 322.881" xml:space="preserve">
                        <g>
                            <path d="M161.288,106.839c-3.304,2.498-3.957,7.201-1.459,10.506c18.253,24.142,48.873,70.369,48.873,108.734
		c0,50.641-34.336,68.684-66.47,68.684c-49.062,0-66.47-36.999-66.47-68.684c0-68.843,70.861-135.59,71.574-136.254
		c3.035-2.819,3.209-7.564,0.39-10.599c-2.818-3.034-7.565-3.209-10.599-0.39c-0.779,0.723-19.286,18.023-38.017,44.671
		C73.665,159.71,60.763,194.22,60.763,226.079c0,41.653,25.191,83.684,81.47,83.684c26.266,0,47.812-9.126,62.307-26.391
		c12.357-14.719,19.163-35.065,19.163-57.293c0-40.603-28.228-86.461-51.908-117.781
		C169.297,104.994,164.593,104.34,161.288,106.839z" />
                            <path
                                d="M75.795,97.802c0-12.238-5.541-26.705-16.47-42.999C51.475,43.099,43.694,34.769,43.366,34.42
		c-2.834-3.02-7.58-3.173-10.601-0.337c-3.021,2.834-3.172,7.58-0.337,10.601c7.89,8.408,28.366,34.341,28.366,53.118
		c0,5.585-1.651,23.808-22.897,23.808C21.016,121.609,15,109.312,15,97.802c0-9.398,3.538-19.847,10.515-31.055
		c2.188-3.517,1.113-8.142-2.403-10.331c-3.516-2.187-8.142-1.112-10.331,2.403C4.3,72.443,0,85.559,0,97.802
		c0,10.137,3.213,19.515,9.046,26.408c4.787,5.656,13.679,12.399,28.852,12.399C64.077,136.609,75.795,117.118,75.795,97.802z" />
                            <path d="M277.6,15.486c-2.824-3.011-7.55-3.172-10.573-0.363c-0.466,0.433-11.519,10.765-22.656,26.61
		c-15.255,21.702-22.989,42.482-22.989,61.765c0,13.673,4.305,26.289,12.12,35.524c9.146,10.808,22.504,16.521,38.63,16.521
		c35.058,0,50.75-26.14,50.75-52.045C322.881,64.191,279.449,17.456,277.6,15.486z M272.131,140.543
		c-17.282,0-35.75-9.731-35.75-37.045c0-30.145,24.336-59.855,35.444-71.847c11.066,13.149,36.056,45.736,36.056,71.847
		C307.881,121.406,298.489,140.543,272.131,140.543z" />
                        </g>
                    </svg>
                </div>

                <div>
                    <!-- <p class="humidity-text">Humidité</p> -->
                    <span class="humidity-text"> {{ Humd.humidity }}</span>
                    <span class="humidity-text">{{ Humd.unite }}</span>
                </div>

            </div>

            <div class="battery">
                <!-- <p class="battery-text">Batterie module</p> -->
                <span class="battery-text">{{ Bat.battery }} {{ Bat.unite }}</span>
            </div>
        </div>


    </div>
</template>

<script>

import Authentification from './Authentification.vue';
import { toastComponent } from "@/components/toast/toastComponent";

import { mapState } from 'vuex'
import store from '../stores/store.js'
import configJson from "../../config.json"


export default {
    props: {
        index: { type: Number, required: true },
    },
    data() {
        return {
            names: [],
            Temp: {
                temperature: null,
                temperaturesMax: 28,
                temperaturesMin: 15,
                unite: "°C",

                error: "null",
            },
            Humd: {
                humidity: null,
                unite: "%",

                error: "null"
            },
            Bat: {
                battery: null,
                unite: "%",

                error: "null"
            }

        };
    },
    computed: {
        ...mapState(['widgets']),
        widget() {
            return this.widgets[this.index];
        }
    },
    methods: {
        //Get all names of presence device existing
        getNames() {
            console.log("http://"+configJson.URL+":"+configJson.PORT+"/listDeviceType")
            fetch("http://"+configJson.URL+":"+configJson.PORT+"/listDeviceType")
                .then(response => response.json())
                .then(data => {
                    console.log("TEST !!!!")
                    // Filtrer uniquement les objets "temperature"
                    const temperatureDevices = Object.values(data.temperature);
                    // Extraire les noms des appareils "temperature"
                    this.names = temperatureDevices.map(device => device.deviceName);
                })
                .catch(error => {
                    this.error = error;
                });
        },
        getTemperature(deviceName) {
            fetch("http://"+configJson.URL+":"+configJson.PORT+"/listDeviceType")
                .then(response => response.json())
                .then(data => {
                    // Rechercher l'appareil avec le nom spécifié
                    const device = Object.values(data.temperature).find(device => device.deviceName === deviceName);
                    // Vérifier si l'appareil a été trouvé
                    if (device) {
                        // Extraire et stocker la valeur de la variable "temperature"
                        this.Temp.temperature = device.info.temperature;
                    } else {
                        // Si l'appareil n'est pas trouvé, définir la valeur sur null ou une valeur par défaut
                        this.Temp.temperature = null;
                    }
                })
                .catch(error => {
                    this.error = error;
                });
        },
        getHumidity(deviceName) {
            fetch("http://"+configJson.URL+":"+configJson.PORT+"/listDeviceType")
                .then(response => response.json())
                .then(data => {
                    // Rechercher l'appareil avec le nom spécifié
                    const device = Object.values(data.temperature).find(device => device.deviceName === deviceName);
                    // Vérifier si l'appareil a été trouvé
                    if (device) {
                        // Extraire et stocker la valeur de la variable "occupancy"
                        this.Humd.humidity = device.info.humidity;
                    } else {
                        // Si l'appareil n'est pas trouvé, définir la valeur sur null ou une valeur par défaut
                        this.Hum.humidity = null;
                    }
                })
                .catch(error => {
                    this.error = error;
                });
        },
        getBattery(deviceName) {
            fetch("http://"+configJson.URL+":"+configJson.PORT+"/listDeviceType")
                .then(response => response.json())
                .then(data => {
                    // Rechercher l'appareil avec le nom spécifié
                    const device = Object.values(data.temperature).find(device => device.deviceName === deviceName);
                    // Vérifier si l'appareil a été trouvé
                    if (device) {
                        // Extraire et stocker la valeur de la variable "occupancy"
                        this.Bat.battery = device.info.battery;
                    } else {
                        // Si l'appareil n'est pas trouvé, définir la valeur sur null ou une valeur par défaut
                        this.Bat.battery = null;
                    }
                })
                .catch(error => {
                    this.error = error;
                });
        },
        //Set the name choosen by the user in the list
        setName(name) {
            const newWidget = { name: 'temperature', module: name }
            store.commit('updateWidgets', { index: this.index, widget: newWidget })
            this.getHumidity(this.widget.module)
            this.getTemperature(this.widget.module)
            this.getBattery(this.widget.module)
        },
        rmvWidget() {
            console.log("heyyyy")
            Authentification.authentification().then(response => {
                if (response == "true") {
                    toastComponent.successMessages("Suppression effectué")
                    this.$emit('eventName')
                }
                else {
                    toastComponent.errorMessages("Vous ne pouvez pas supprimer ce widget")
                }
            }).catch(error => {
                console.log("Une erreur est survenue")
            })
        }
    },
    created() {
        this.getNames();
        if (this.widget?.module) {
            this.getTemperature(this.widget.module)
            this.getHumidity(this.widget.module)
            this.getBattery(this.widget.module)
        }
    },
};
</script>
<style lang="scss" scoped>
.content {

    justify-content: center;
    position: relative;
    display: flex;
    flex-direction: column;

    &-title {
        font-size: 1rem;
        width: 100%;
        height: 10%;

        text-align: center;
        margin-top: 25px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

}

.temperature {

    margin-top: 15px;
    margin-bottom: 15px;
    justify-content: center;
    position: relative;

    &-temp {
        font-size: 3em;
        line-height: 1;
        text-align: center;
    }

    &-high-low {
        //font-size: 1.5em;
        color: lighten(#313E48, 20%);
        text-align: center;
        display: block;
        font-weight: 100;
    }

    &-icon {
        height: 100%;
        width: 100%;
        align-items: center;
    }
}

.humidity {
    // position: relative;

    &-icon {
        height: 10%;
        width: 10%;
        // align-items: center;
    }

    &-text {
        font-size: 1rem;
        color: #3498db;
    }
}

.battery {
    // justify-content: center;
    // position: relative;

    &-text {
        font-size: 1rem;
    }

}

.info {
    justify-content: space-around;
}

.remove-buton {
    width: 2rem;
    height: 2rem;
    fill: #3498db;

    position: absolute;
    top: 0px;
    right: 0px
}

.choose {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1;

    &-wrap {
        opacity: 0;
        z-index: 999;
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
        width: 100%;
        border-left: 3px solid #3498db;
        padding: 0.5rem 1rem;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 4px;
        transition: opacity 0.2s ease-in;
    }

    &-checkbox {
        display: none;
    }

    &-nav {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    &-item {
        cursor: pointer;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0%;
            height: 2px;
            background-color: #3498db;

            transition: 0.2s ease-in-out;
        }

        &:hover::after {
            width: 100%;
        }
    }

    .choose-wrap {
        pointer-events: none;
    }

    &-checkbox:checked~.choose-wrap {
        opacity: 1;
        transform: translateX(85%);
        pointer-events: auto;
    }
}
</style>