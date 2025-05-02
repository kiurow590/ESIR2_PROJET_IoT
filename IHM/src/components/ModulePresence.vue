<template>
    <div class="presence widget widget-square">
        <div class="presence-content">

            <h1 class="presence-title" v-if="widget?.module"> {{ widget.module }} </h1>

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

            <img class="presence-img" src="../assets/photo/logo_presence.png" alt="logo presence">
            <p class="presence-text-s"> {{ msg }}</p>

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
import {toastComponent} from "@/components/toast/toastComponent";
import configJson from "../../config.json"

export default {
    props: {
        index: { type: Number, required: true },
    },
    data() {
        return {
            names: [],
            msg: "null",
            presence: false,

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
            fetch('http://'+configJson.URL+':'+configJson.PORT+ '/listDeviceType')
                .then(response => response.json())
                .then(data => {
                    // Filtrer uniquement les objets "occupancy"
                    const occupancyDevices = Object.values(data.occupancy);
                    // Extraire les noms des appareils "occupancy"
                    this.names = occupancyDevices.map(device => device.deviceName);
                    console.log(this.names)
                })
                .catch(error => {
                    this.error = error;
                });
        },
        getPresence(deviceName) {
            fetch('http://'+configJson.URL+':'+configJson.PORT+'/listDeviceType')
                .then(response => response.json())
                .then(data => {
                    // Rechercher l'appareil avec le nom spécifié
                    const device = Object.values(data.occupancy).find(device => device.deviceName === deviceName);

                    // Vérifier si l'appareil a été trouvé
                    if (device) {
                        // Extraire et stocker la valeur de la variable "occupancy"
                        this.occupancyValue = device.info.occupancy;
                    } else {
                        // Si l'appareil n'est pas trouvé, définir la valeur sur null ou une valeur par défaut
                        this.occupancyValue = null;
                    }
                })
                .catch(error => {
                    this.error = error;
                });
        },

        //Set the name choosen by the user in the list
        setName(name) {
            const newWidget = { name: 'presence', module: name }
            store.commit('updateWidgets', { index: this.index, widget: newWidget })
            this.getPresence(this.widget.module)
        },
        presenceOnOff() {
            if (this.presence) {
                this.msg = "Présence détectée !"
            } else { this.msg = "Pas de présence." }
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
    },
    created() {
        this.getNames()
        this.presenceOnOff()
        if (this.widget?.module) {
            this.getPresence(this.widget.module)
        }
    },
}
</script>

<style lang="scss" scoped>
.presence {
    position: relative;

    &-content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
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

    &-text-m {
        font-size: 25px;
        font-weight: bold;
        margin-bottom: 15px;
    }

    &-text-s {
        font-size: 12px;
        // font-weight: bold;
    }

    &-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 5px;
        opacity: 0.3;
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