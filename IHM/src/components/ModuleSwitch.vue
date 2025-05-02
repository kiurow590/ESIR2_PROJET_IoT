<template>
    <div class="switch widget widget-rect" :class="{ 'active': isLightOn }" @click="toggleLight">

        <div class="switch-content">
            <h1 class="switch-title" v-if="widget?.module"> {{ widget.module }} </h1>
            <label class="choose wrapper-square-1x1 " v-if="!widget?.module">
                <input type="checkbox" class="choose-checkbox" :id="'add-right-widget-'.index">

                <p> Choisir un module </p>
                <p> </p>

                <!-- </label> -->
                <div class="choose-wrap">
                    <ul class="choose-nav">
                        <li v-for="(name, index) in names" :key="index" @click="setName(name)">
                            {{ name }}
                        </li>
                    </ul>
                </div>

            </label>

            <img class="switch-img" src="../assets/photo/logo_light.png" alt="logo light">

            <div class="remove-buton" @click="rmvWidget">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 21.6C17.302 21.6 21.6 17.302 21.6 12C21.6 6.69809 17.302 2.40002 12 2.40002C6.69809 2.40002 2.40002 6.69809 2.40002 12C2.40002 17.302 6.69809 21.6 12 21.6ZM8.40002 10.8C7.73728 10.8 7.20002 11.3373 7.20002 12C7.20002 12.6628 7.73728 13.2 8.40002 13.2H15.6C16.2628 13.2 16.8 12.6628 16.8 12C16.8 11.3373 16.2628 10.8 15.6 10.8H8.40002Z" />
                </svg>

            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '../stores/store.js'

import Authentification from './Authentification.vue';
import { toastComponent } from "@/components/toast/toastComponent";
import configJson from "../../config.json"

export default {
    props: {
        index: { type: Number, required: true },
    },
    data() {
        return {
            names: [],
            id: null,
            isLightOn: null,
        };
    },
    computed: {
        ...mapState(['widgets']),
        widget() {
            return this.widgets[this.index];
        }
    },
    methods: {
        //Get all names of switch device existing
        getNames() {
            fetch('http://'+configJson.URL+':'+configJson.PORT + '/listDeviceType')
                .then(response => response.json())
                .then(data => {
                    // Filtrer uniquement les objets "brightness"
                    const brightnessDevice = Object.values(data.brightness);
                    // Extraire les noms des appareils "brightness"
                    this.names = brightnessDevice.map(device => device.deviceName);
                    this.id = brightnessDevice.map(device => device.deviceId)
                    this.isLightOn = brightnessDevice.map(device => device.info.brightness)
                })
                .catch(error => {
                    this.error = error;
                });
        },
        //Set the name choosen by the user in the list
        setName(name) {
            const newWidget = { name: 'switch', module: name }
            store.commit('updateWidgets', { index: this.index, widget: newWidget })
        },
        //Remove widget from grid 
        rmvWidget() {
            Authentification.authentification().then(response => {
                if( response == "true"){
                    toastComponent.successMessages("Suppression effectué")
                    this.$emit('eventName')
                }
                else{
                    toastComponent.errorMessages("Vous ne pouvez pas supprimer ce widget")
                }
            }).catch(error => {
                //on affiche un message d'erreur
                console.log("Une erreur est survenue")
            })
        },
        // Fonction pour éteindre la lampe
       
        //Switch on or off the ligth
        toggleLight() {
            if (this.widget?.module) {
                this.isLightOn = !this.isLightOn;
                
                fetch('http://' + configJson.URL+':'+configJson.PORT + '/action/light/'+this.id, {
                    method: "POST",
                    body: JSON.stringify({
                        action: "TOGGLE",
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                });   
            }
        }
    },
    created() {
        this.getNames();
    },
}

</script>

<style lang="scss" scoped>
.switch {
    position: relative;

    &-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    &-title {
        font-size: 1rem;
        width: 100%;
        height: 25%;

        text-align: center;
        margin-top: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    &-text {
        font-size: 25px;
        font-weight: bold;
    }

    &-img {
        height: 80px;
        width: 80px;
        padding: 5px;

    }

    &.active {
        background-color: yellow;
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

.choose {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

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