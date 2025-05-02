<script setup>
import {computed, reactive, onMounted} from "vue";
import {defineModel} from 'vue-model';

// inputs
const listComponents = defineModel('listComponents');
const title = defineModel('title');
let dataBack = [];
//outputs
const emits = defineEmits(["onAdd"]);
/**
 * create a reactive object
 * @type {UnwrapNestedRefs<{sortColumn: string, elementsPerPage: number, currentPage: number, ascending: boolean, rows: *[]}>}
 */
const data = reactive({
  currentPage: 1,
  elementsPerPage: 10,
  ascending: false,
  sortColumn: '',
  rows: listComponents ? listComponents : []
});

/**
 * Récupérer la liste des composants depuis l'API REST
 * @returns {Promise<void>} la liste des composants
 */
async function getListComponents() {

}

onMounted(getListComponents);

const addRow = (data) => {
  console.log(data);
  emits('onAdd', data);
};

/**
 * Trier le tableau
 * @param col {string}
 */
const sortTable = (col) => {
  if (data.sortColumn === col) {
    data.ascending = !data.ascending;
  } else {
    data.ascending = true;
    data.sortColumn = col;
  }

  const ascending = data.ascending;

  data.rows.sort((a, b) => {
    if (a[col] > b[col]) {
      return ascending ? 1 : -1;
    } else if (a[col] < b[col]) {
      return ascending ? -1 : 1;
    }
    return 0;
  });
};

/**
 * Calculer le nombre de pages
 * @returns {number} le nombre de pages
 */
const num_pages = () => Math.ceil(data.rows.length / data.elementsPerPage);

/**
 * Récupérer les lignes à afficher
 * @returns {UnwrapRefSimple<*>[]}
 */
const get_rows = () => {
  const start = (data.currentPage - 1) * data.elementsPerPage;
  const end = start + data.elementsPerPage;
  return data.rows.slice(start, end);
};

/**
 * Changer de page
 * @param page
 */
const change_page = (page) => {
  data.currentPage = page;
};

/**
 *  Récupérer les colonnes
 * @type {ComputedRef<[]|string[]>}
 */
const columns = computed(() => {
  if (data.rows.length === 0) {
    return [];
  }
  return Object.keys(data.rows[0]);
});

</script>

<script>


</script>

<template>
  <div class="listTableContainer">

    <h2>{{ title }}</h2>

    <table>
      <thead>
      <tr>
        <th v-on:click="sortTable('id')">{{ "ID" }}
          <div class="arrow" v-if="'ID' === sortColumn" v-bind:class="[ascending ? 'arrow_up' : 'arrow_down']"></div>
        </th>
        <th v-on:click="sortTable('name')">{{ "NAME" }}
          <div class="arrow" v-if="'name' === sortColumn" v-bind:class="[ascending ? 'arrow_up' : 'arrow_down']"></div>
        </th>
        <th v-on:click="sortTable('idComponent')">{{ "IDCOMPONENT" }}
          <div class="arrow" v-if="'idComponent' === sortColumn"
               v-bind:class="[ascending ? 'arrow_up' : 'arrow_down']"></div>
        </th>
        <th>
          Action
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="get_rows().length === 0">
        <td :colspan="columns.length + 1">Empty table</td>
      </tr>
      <tr v-for="row in get_rows()">
        <td v-for="col in columns">
          <span>{{ row[col] }}</span>
        </td>
        <td>
          <button type="button" @click="addRow(row)">
            <i class="material-icons">
              add
            </i>
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <div class="number"
           v-for="i in num_pages()"
           v-bind:class="[i === currentPage ? 'active' : '']"
           v-on:click="change_page(i)">{{ i }}
      </div>
    </div>


  </div>
</template>


<style scoped>

.listTableContainer {

  table {
    width: 100%;
    border-collapse: collapse;
    border: 3px solid #44475C;
    margin: 10px 10px 0 10px;

    th {
      text-transform: uppercase;
      text-align: left;
      background: #44475C;
      color: #FFF;
      cursor: pointer;
      padding: 8px;
      min-width: 30px;

      &:hover {
        background: #717699;
      }

      .arrow_down {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAaCAYAAABPY4eKAAAAAXNSR0IArs4c6QAAAvlJREFUSA29Vk1PGlEUHQaiiewslpUJiyYs2yb9AyRuJGm7c0VJoFXSX9A0sSZN04ULF12YEBQDhMCuSZOm1FhTiLY2Rky0QPlQBLRUsICoIN/0PCsGyox26NC3eTNn3r3n3TvnvvsE1PkwGo3yUqkkEQqFgw2Mz7lWqwng7ztN06mxsTEv8U0Aam5u7r5EInkplUol/f391wAJCc7nEAgE9Uwmkzo4OPiJMa1Wq6cFs7Ozt0H6RqlUDmJXfPIx+qrX69Ti4mIyHA5r6Wq1egND+j+IyW6QAUoul18XiUTDNHaSyGazKcZtdgk8wqhUKh9o/OMvsVgsfHJy0iWqVrcQNRUMBnd6enqc9MjISAmRP3e73T9al3XnbWNjIw2+KY1Gc3imsNHR0YV4PP5+d3e32h3K316TySQFoX2WyWR2glzIO5fLTSD6IElLNwbqnFpbWyO/96lCoai0cZjN5kfYQAYi5H34fL6cxWIZbya9iJyAhULBHAqFVlMpfsV/fHxMeb3er+Vy+VUzeduzwWC45XA4dlD/vEXvdDrj8DvURsYEWK3WF4FA4JQP9mg0WrHZbEYmnpa0NxYgPVObm5teiLABdTQT8a6vrwdRWhOcHMzMzCiXlpb2/yV6qDttMpkeshEzRk4Wo/bfoe4X9vb2amzGl+HoXNT29vZqsVi0sK1jJScG+Xx+HGkL4Tew2TPi5zUdQQt9otPpuBk3e0TaHmMDh1zS7/f780S0zX6Yni+NnBj09fUZUfvudDrNZN+GkQbl8Xi8RLRtHzsB9Hr9nfn5+SjSeWUCXC7XPq5kw53wsNogjZNohYXL2EljstvtrAL70/mVaW8Y4OidRO1/gwgbUMvcqGmcDc9aPvD1gnTeQ+0nmaInokRj0nHh+uvIiVOtVvt2a2vLv7Ky0tL3cRTXIcpPAwMDpq6R4/JXE4vFQ5FI5CN+QTaRSFCYc8vLy1l0rge4ARe5kJ/d27kYkLXoy2Jo4C7K8CZOsEBvb+9rlUp1xNXPL7v3IDwxvPD6AAAAAElFTkSuQmCC')
      }

      .arrow_up {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAwpJREFUSA21Vt1PUmEYP4dvkQ8JFMwtBRocWAkDbiqXrUWXzU1rrTt0bdVqXbb1tbW16C9IBUSmm27cODdneoXjputa6069qwuW6IIBIdLvdaF4OAcOiGeDc87zPs/vd57P96WpFq7p6enbGo1mjKZpeTabjU1MTCRagGnOZHFxcXxtbe1XKpUq7+zslJeXl//Mz8+Hy+Uy3RxSE9qTk5M3otFooVQqgef4Wl9f343FYoEmoISrxuNxFX5f9vb2jhn/PxUKhfLS0tIPfFifUESRUMV8Pv/M6XReRm5rTGQyGeXxeGxYe1ezeBpBOBx2rKysbO7v79d4Wy3Y2Nj4GQqFbgnhaugxwiuGJx99Pp9FLBbXxYTXvTqd7v3MzIy6riIWGxJnMpl7AwMD14xGYyMsSq1WUyQdUqn0eSPlusQIsbGrq+vl4OCgvhFQZd1utyv1en0gEolcqsi47nWJlUrlG5fLZVcoFFy2nDKSDpIWlUoVTCQSEk4lCHmJMZ2GTCbTiMVikfIZ88l7enoos9l8dXt7+z6fDicxSJUokqDX6xXcl2wCROoc0vQCWL3sNfLOSdzR0fHY4XC4tVotl40gmVwup9xuN4OQv+UyqCFGH9rg7SOGYVRcBs3IEG4J0nVnamrqOtvuBDGGgQg9+wHFcVEi4a0LNkbdd6TrPKo8ODc311mteIIYjT/a398/jK+s1jnVM0kXoufCFvq0GuiIGEVgQIhfoygM1QrteEa9dAL7ITiYCt4RMabOK5AyKKzKWtvupLcRciu8D5J0EuDDPyT/Snd39yh6VtY2NhYQSR9G79Ds7OxdskRjEyAufvb7/cPoO5Z6e1+xtVKrq6vfcFzyi/A3ZrPZ3GdNSlwgo5ekE4X2RIQGf2C1WlufFE0GBeGWYQ8YERWLxQtnUVB830MKLZfL9RHir8lkssCn2G751tZWEWe03zTKm15YWPiEiXXTYDB0Ig/t7yd8PRws4EicwWHxO4jHD8/C5HiTTqd1BwcHFozKU89origB+y/kmzgYpgOBQP4fGmUiZmJ+WNgAAAAASUVORK5CYII=')
      }

      .arrow {
        float: right;
        width: 12px;
        height: 15px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position-y: bottom;
      }
    }
  }

  tr {
    &:nth-child(2n) {
      background: #D4D8F9;
    }

    td {
      text-align: left;
      padding: 8px;
      border-right: 2px solid #7D82A8;

      &:last-child {
        border-right: none;
      }

    }
  }
}


.pagination {

  text-align: right;
  width: 750px;
  padding: 8px;
}


.number {
  display: inline-block;
  padding: 4px 10px;
  color: #FFF;
  border-radius: 4px;
  background: #44475C;
  margin: 0px 5px;
  cursor: pointer;
}

.number:hover, .number.active {
  background: #717699;
}


</style>