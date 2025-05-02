<script setup>
// IMPORT
import TableComponent from "@/components/TableComponent.vue";
import {reactive} from "vue";
import {useModal} from "vue-final-modal";
import ModalConfirmPlainCss from "@/components/modals/ModalConfirmPlainCss.vue";
import {IotComponent} from "@/models/iotComponent";
import ModalYesNo from "@/components/modals/ModalYesNo.vue";
import {toastComponent} from "@/components/toast/toastComponent";
import ModalChart from "@/components/modals/ModalChart.vue";
import {toastComponent as ToastComponent} from "../components/toast/toastComponent";
import LoaderOverlay from "../models/loaderComponent.vue";
import AddTableComponent from "../components/AddTableComponent.vue";
import configJson from "../../config.json"
import Authentification from '../components/Authentification.vue'



const titleAddComponent = 'Composant à ajouter';

// Propriétés en entrée du module
const data = reactive({
  tableTitle: 'Composants',
  rows: [],
  addRows: [],
});

/**
 * Ajoute une nouvelle ligne à la table
 * @param name nom du composant
 * @param componentId id du composant
 * @param statut statut du composant
 * @param value valeur du composant
 */
const addRow = (name, componentId, statut, value) => {
  const newId = data.rows.length + 1;
  const newComp = new IotComponent(name, componentId);
  newComp.id = 'id' + newId;
  newComp.statut = statut;
  newComp.value = value;
  data.rows.push(newComp);
};


getLstComponentFromDB();

/**
 *  Récupère la liste des composants depuis la base de données
 */
function getLstComponentFromDB() {
  console.log('Demande de récupération des composants');
  fetch('http://'+configJson.URL+':'+configJson.PORT+'/listDevice/', {
    method: 'GET', // or 'POST'
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer your-token' (if needed)
    },
    // body: JSON.stringify(data), (if you're sending data)
  })
      .then(response => response.json())
      .then(data => {
            console.log(data);

            data.forEach((comp) => {
              console.log(comp);

              addRow(comp.deviceName, comp.deviceId, "Connected", '');
            });

          }
      )
      .catch((error) => {
        console.error('Error:', error);
      });
}


/**
 * Supprime un composant de la liste
 * @param dataToDelete composant à supprimer
 */
const deleteComponent = (dataToDelete) => {

  console.log('Demande de suppression d\'un composant', dataToDelete);

  Authentification.authentification().then(response => {
    if( response == "true"){
        fetch('http://'+configJson.URL+':'+configJson.PORT+'/delete/' + dataToDelete.idComponent, {
        method: 'DELETE', // or 'POST'
        headers: {
          'Content-Type': 'application/json',
          //
        },
      }).then(response => {
          response.json()
      }).then(() => {
          toastComponent.successMessages("Element " + dataToDelete.name + " supprimé")
          // on supprime le composant de la liste
          data.rows = data.rows.filter((comp) => {
            return comp.idComponent !== dataToDelete.idComponent;
          });
      }).catch((error) => {
          toastComponent.errorMessages("Erreur lors de la suppression du composant " + dataToDelete.name + " !")
      });
            
    }else{
      toastComponent.errorMessages("Vous ne pouvez pas supprimer ce widget")

    }
  }).catch(error => {
    //on affiche un message d'erreur
    console.log("Une erreur est survenue")
  })
};

/**
 * Edite un composant de la liste
 * @param dataComp composant à éditer
 */
const editComponent = (dataComp) => {

  console.log('Demande d\'édition d\'un composant', dataComp);

  const {open, close} = useModal({
    component: ModalConfirmPlainCss,
    attrs: {
      title: 'Demande d\'édition',
      mode: 'edit',
      data: dataComp,
      onConfirm: (newComp) => {
        console.log('Click confirm on modal history received', newComp);
        fetch('http://'+configJson.URL+':'+configJson.PORT+`/writeName/${newComp.name}/${newComp.idComponent}`, {
          method: 'GET', // or 'POST'
          headers: {
            'Content-Type': 'application/json',
            //
          },
        })
            .then(response => {
              response.json()
            })
            .then(() => {
                  toastComponent.successMessages("Element " + newComp.name + " modifié")
                  // on modifie le composant de la liste avec le nouveau nom
                  data.rows = data.rows.map((comp) => {
                    if (comp.idComponent === newComp.idComponent) {
                      comp.name = newComp.name;
                    }
                    return comp;
                  });
                }
            )
            .catch((error) => {
              toastComponent.errorMessages("Erreur lors de la modification du composant " + newComp.name + " !\n" + error)
            });


        close();
      }
    }
  });
  open();
};

/**
 * Affiche l'historique d'un composant
 * @param dataComp composant à afficher
 */
const showChartHistory = (dataComp) => {
  //console.log(dataComp['row']["idComponent"]);

  // on recupere l'historique du composant
  fetch('http://'+configJson.URL+':'+configJson.PORT+`/device/${dataComp['row']["idComponent"]}/data`, {
    method: 'GET', // or 'POST'
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer your-token' (if needed)
    },
    //body: JSON.stringify(data), //(if you're sending data)
  })
      .then(response => response.json())
      .then(data => {

            // get la key de l'objet
            const key = Object.keys(data)[0];
            console.log(data[key]);
            const {open, close} = useModal({
              component: ModalChart,
              attrs: {
                title: 'Historique de ' + dataComp['row']["name"],
                data: data[key],
                onClose: (newComp) => {
                  console.log('Click confirm on modal history received', newComp);
                  close();
                }
              }
            });
            open();
          }
      )
      .catch((error) => {
        console.error('Error:', error);
      });
};

const addRowComponent = (dataComp) => {
  console.log('Demande d\'ajout d\'un composant', dataComp);
  const newId = data.rows.length + 1;
  const newComp = new IotComponent(dataComp.name, dataComp.idComponent);
  newComp.id = 'id' + newId;
  // on ouvre un modal pour confirmer l'ajout
  const {open, close} = useModal(
      {
        component: ModalConfirmPlainCss,
        attrs: {
          title: 'Demande de confirmation',
          mode: 'edit',
          data: newComp,
          onConfirm: (newComp) => {
            console.log('Click confirm on modal received', newComp);

            // fetch command pour ajouter un composant dans la base de données
            fetch(`http://${configJson.URL}:${configJson.PORT}/writeName/${newComp.name}/${newComp.idComponent}`, {
              method: 'GET', // or 'POST'
              headers: {
                'Content-Type': 'application/json',
                //
              },
            })
                .then(response => {
                  response.json()
                })
                .then(() => {

                  //TODO - commande pour refresh page

                  // newComp.id = 'id' + (data.rows.length + 1);
                  // // on ajoute le composant à la liste
                  // data.rows.push(newComp);

                  // ToastComponent.successMessages("Element " + newComp.name + " ajouté")
                  // // retirer le composant de la liste des composants à ajouter
                  // data.addRows = data.addRows.filter((comp) => {
                  //   return comp.idComponent !== newComp.idComponent;
                  // });
                  // // recalculer les id des composants à ajouter
                  // data.addRows = data.addRows.map((comp, index) => {
                  //   comp.id = 'id' + (index + 1);
                  //   return comp;
                  // });

                  // close();
                }).catch((error) => {
              ToastComponent.errorMessages("Erreur lors de l'ajout du composant " + newComp.name + " !\n" + error)
            });

          }
        }
      }
  )
  open();

}

/**
 * Récupère la liste des composants à ajouter
 * @returns {Promise<void>}
 * */
function getNewComponent() {
  console.log('Demande d\'ajout d\'un nouveau composant');
  // faire apparaitre un loader
  ToastComponent.loadingMessages("Chargement en cours des composants à ajouter en cours ...");
  data.loading = true; // Affiche le loader
  // Appel à l'API pour récupérer la liste des composants à ajouter
  fetch('http://'+configJson.URL+':'+configJson.PORT+'/allowAddDevice', {

    method: 'POST', // or 'POST'
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization

    },
  })
      .then(response => response.json()).then(tabdata => {
    // console.log(tabdata);
    // data.loading = false; // cache le loader
    // data.showAddTab = true;
    // // on recupere la liste des composants à ajouter
    // data.addRows = tabdata.map((comp, index) => {
    //   return {
    //     id: 'id' + (index + 1),
    //     name: comp.name,
    //     idComponent: comp.id
    //   };
    // });
    // toastComponent.successMessages("Composent afficher !")
    window.location.reload();


  })
      .catch((error) => {
        // data.loading = false; // cache le loader
        // console.error('Error:', error);
        // toastComponent.errorMessages("Erreur lors de la récupération des composants à ajouter !")
        window.location.reload();

      });


  // // mets un delay de 2s pour simuler le chargement des données
  // setTimeout(() => {
  //   // ajoute un composant à la liste
  //   //addRow("Nouveau composant", "id" + (data.rows.length + 1), "Connected", '');
  //   toastComponent.successMessages("Composent afficher !")
  //   data.loading = false; // cache le loader
  //   data.showAddTab = true;
  //
  //   data.addRows = [
  //     {
  //       id: 'id1',
  //       name: 'Composant 1',
  //       idComponent: 'idComponent1'
  //     },
  //     {
  //       id: 'id2',
  //       name: 'Composant 2',
  //       idComponent: 'idComponent2'
  //     },
  //     {
  //       id: 'id3',
  //       name: 'Composant 3',
  //       idComponent: 'idComponent3'
  //     },
  //   ];
  //
  // }, 5000);
}

</script>

<script>
// Ajouter une nouvelle ligne à la table


</script>

<template>
  <main>
    <h1>List Components</h1>
    <TableComponent v-model:title="data.tableTitle" v-model:list-components="data.rows" @on-delete="deleteComponent"
                    @on-show-chart-history="showChartHistory"
                    @on-edit="editComponent"
    />

    <section class="action-zone">
      <button class="button" @click="getNewComponent">
        <LoaderOverlay :loading="data.loading"/>
        Ajouter<i class="material-icons">add</i>
      </button>

      <add-table-component v-if="data.showAddTab" v-model:title="titleAddComponent"
                           v-model:list-components="data.addRows"
                           @on-add="addRowComponent"/>

    </section>

  </main>
</template>

<style scoped>

.action-zone {
  border-bottom: 1px solid darkgray;
  padding-block: 2rem;
  margin-bottom: 3rem;
}

.button {
  position: relative;
  padding: 10px 22px;
  border-radius: 6px;
  border: none;
  color: #fff;
  cursor: pointer;
  background-color: #44475c;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.96);
  }

  &:before,
  &:after {
    position: absolute;
    content: "";
    width: 150%;
    left: 50%;
    height: 100%;
    transform: translateX(-50%);
    z-index: -1000;
    background-repeat: no-repeat;
  }

  &:hover:before {
    top: -70%;
    background-image: radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, transparent 20%, #7d2ae8 20%, transparent 30%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, #7d2ae8 15%, transparent 20%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%);
    background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%,
    10% 10%, 18% 18%;
    background-position: 50% 120%;
    animation: greentopBubbles 0.6s ease;
  }

  &:hover::after {
    bottom: -70%;
    background-image: radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, #7d2ae8 15%, transparent 20%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%),
    radial-gradient(circle, #7d2ae8 20%, transparent 20%);
    background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 20% 20%, 18% 18%;
    background-position: 50% 0%;
    animation: greenbottomBubbles 0.6s ease;
  }

}

@keyframes greentopBubbles {
  0% {
    background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%,
    40% 90%, 55% 90%, 70% 90%;
  }

  50% {
    background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%,
    50% 50%, 65% 20%, 90% 30%;
  }

  100% {
    background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%,
    50% 40%, 65% 10%, 90% 20%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}

@keyframes greenbottomBubbles {
  0% {
    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%,
    70% -10%, 70% 0%;
  }

  50% {
    background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%,
    105% 0%;
  }

  100% {
    background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%,
    110% 10%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}
</style>