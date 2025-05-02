// store.js
import { createStore } from 'vuex';

// Récupérer les données du localStorage s'il y en a, sinon initialiser à un tableau vide
const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
const savedNames = JSON.parse(localStorage.getItem('names')) || [];

export default createStore({
    state: {
        widgets: savedWidgets,
        names: savedNames,
    },
    mutations: {
        //Mutations for Grid Component to add or remove widget on the grid
        async addWidget(state, widget) {
            state.widgets.push(widget);
            localStorage.setItem('widgets', JSON.stringify(state.widgets));
        },
        removeWidget(state, index) {
            state.widgets.splice(index, 1);
            localStorage.setItem('widgets', JSON.stringify(state.widgets));
        },
        setWidgets(state, widgets) {
            state.widgets = widgets;
        },

        //Mutations for Modules components to save name (title)
        addName(state, name) {
            state.names.push(name);
            localStorage.setItem('name', JSON.stringify(state.names));
        },

        updateWidgets(state, { index, widget }) {
            state.widgets[index] = widget
            localStorage.setItem('widgets', JSON.stringify(state.widgets))
        }
    },
    actions: {
        // Vous pouvez définir des actions si nécessaire pour gérer des opérations asynchrones
    },
    getters: {
        // Vous pouvez définir des getters pour obtenir des données calculées à partir de l'état
    },
});
