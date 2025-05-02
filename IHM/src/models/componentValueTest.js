import { reactive } from "vue";

export class ComponentValueTest {

    static data = reactive({
        tableTitle: 'Température de Toto',
        elementTable: [[
            {x: new Date(2020, 0, 1, 12, 0, 0), y: 14.1},
            {x: new Date(2020, 0, 2, 13, 0, 0), y: 15},
            {x: new Date(2020, 0, 3, 14, 0, 0), y: 17.2},
            {x: new Date(2020, 0, 4, 15, 0, 0), y: 20.8},
            {x: new Date(2020, 0, 5, 16, 0, 0), y: 24.4},
            {x: new Date(2020, 0, 6, 17, 0, 0), y: 26.6},
            {x: new Date(2020, 0, 7, 18, 0, 0), y: 29.2},
            {x: new Date(2020, 0, 8, 19, 0, 0), y: 29.2},
            {x: new Date(2020, 0, 9, 20, 0, 0), y: 26.9},
            {x: new Date(2020, 0, 10, 21, 0, 0), y: 23.5},
            {x: new Date(2020, 0, 11, 22, 0, 0), y: 19.7},
            {x: new Date(2020, 0, 12, 23, 0, 0), y: 15.8}
        ],
            [
                {x: new Date(2020, 0, 1, 12, 0, 0), y: 5 + 14.1},
                {x: new Date(2020, 0, 2, 13, 0, 0), y: 5 + 15},
                {x: new Date(2020, 0, 3, 14, 0, 0), y: 5 + 17.2},
                {x: new Date(2020, 0, 4, 15, 0, 0), y: 5 + 20.8},
                {x: new Date(2020, 0, 5, 16, 0, 0), y: 5 + 24.4},
                {x: new Date(2020, 0, 6, 17, 0, 0), y: 5 + 26.6},
                {x: new Date(2020, 0, 7, 18, 0, 0), y: 5 + 29.2},
                {x: new Date(2020, 0, 8, 19, 0, 0), y: 5 + 29.2},
                {x: new Date(2020, 0, 9, 20, 0, 0), y: 5 + 26.9},
                {x: new Date(2020, 0, 10, 21, 0, 0), y: 5 + 23.5},
                {x: new Date(2020, 0, 11, 22, 0, 0), y: 5 + 19.7},
                {x: new Date(2020, 0, 12, 23, 0, 0), y: 5 + 15.8}
            ]]
    });
}