<template>
    <div class="wrapper">
        <div v-for="(widget, index) in widgets">
            <div class="fit-parent" v-if="widget.name == 'temperature'">
                <ModuleTemperature @eventName="handleRemoveWidget(index)" :index="index" />
            </div>
            <div class="fit-parent" v-if="widget.name == 'switch'">
                <ModuleSwitch @eventName="handleRemoveWidget(index)" :index="index" />
            </div>
            <div class="fit-parent" v-if="widget.name == 'presence'">
                <ModulePresence @eventName="handleRemoveWidget(index)" :index="index" />
            </div>
            <div class="fit-parent" v-if="widget.name == 'meteo'">
                <ModuleMeteo @eventName="handleRemoveWidget(index)" />
            </div>
        </div>

        <label class="dropdown wrapper-square-1x1 ">
            <input type="checkbox" class="dropdown-checkbox" id="add-right-widget">

            <svg class="widget-add-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12 21.6C17.302 21.6 21.6 17.302 21.6 12C21.6 6.69809 17.302 2.40002 12 2.40002C6.69809 2.40002 2.40002 6.69809 2.40002 12C2.40002 17.302 6.69809 21.6 12 21.6ZM13.2 8.40002C13.2 7.73728 12.6628 7.20002 12 7.20002C11.3373 7.20002 10.8 7.73728 10.8 8.40002V10.8H8.40002C7.73728 10.8 7.20002 11.3373 7.20002 12C7.20002 12.6628 7.73728 13.2 8.40002 13.2H10.8V15.6C10.8 16.2628 11.3373 16.8 12 16.8C12.6628 16.8 13.2 16.2628 13.2 15.6V13.2H15.6C16.2628 13.2 16.8 12.6628 16.8 12C16.8 11.3373 16.2628 10.8 15.6 10.8H13.2V8.40002Z" />
            </svg>

            <!-- </label> -->
            <div class="dropdown-wrap">
                <ul class="dropdown-nav">
                    <li class="dropdown-item" v-for="widgetLabel in widgetLabels" @click="addToStore(widgetLabel.name)">
                        {{
            widgetLabel.label }}</li>
                </ul>
            </div>

        </label>
    </div>
</template>

<script>
import ModuleSwitch from '../components/ModuleSwitch.vue'
import ModuleTemperature from '../components/ModuleTemperature.vue'
import ModulePresence from '../components/ModulePresence.vue'
import ModuleMeteo from '../components/ModuleMeteo.vue'

import store from '../stores/store.js'
import { mapState } from 'vuex'


export default {
    components: {
        ModuleSwitch,
        ModuleTemperature,
        ModulePresence,
        ModuleMeteo,
    },
    data() {
        return {
            widgetLabels: [
                // { label: "weather", component:   },
                { label: "Temperature", name: "temperature" },
                { label: "Switch", name: "switch" },
                { label: "Presence", name: "presence" },
                { label: "Meteo", name: "meteo" },
            ],
            data: null,

        }
    },
    computed: {
        ...mapState(['widgets']),
    },
    methods: {
        handleRemoveWidget(index) {
            store.commit('removeWidget', index)
        },

        async addToStore(label) {
            const widgetData = { name: label }
            await store.commit('addWidget', widgetData)
        },
    },
}
</script>

<style scoped lang="scss">
.dropdown {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &-wrap {
        opacity: 0;
        position: absolute;
        // inset: 0;
        transform: translateX(100%);
        border-left: 3px solid #3498db;
        padding: 0.5rem 1rem;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 4px;
        transition: 0.2s ease-in;
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


    &-checkbox:checked~.dropdown-wrap {
        opacity: 1;
        transform: translateX(85%);
    }
}

.widget-add {
    &-icon {
        width: 4rem;
        height: 4rem;
        fill: #3498db;
    }
}

.fit-parent {
    width: 100%;
    height: 100%;
}
</style>