<script>
import {useModal} from "vue-final-modal";
import ModalAuthentification from "@/components/modals/ModalsAuthentification.vue";
import configJson from "../../config.json";

//import {toastComponent} from "@/components/toast/toastComponent";

export default {
    authentification() {
        return new Promise((resolve, reject) => {
            console.log('Veuillez entrez votre mot de passe');

            const {open, close} = useModal({
                component: ModalAuthentification,
                attrs: {
                title: 'Veuillez entrer votre mot de passe',
                mode: 'login',
                onConfirm: (newComp) => {
                    
                    console.log('Click confirm on modal received', newComp);
                    //addRow(newComp.name, newComp.idComponent, "Connected", '');
                    fetch("http://"+configJson.URL+":"+configJson.PORT+"/askPermission/"+newComp.password)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        
                        //Si le code est bon alors
                        //toastComponent.successMessages("Authentification réussi")
                        resolve(data);
                    })
                    .catch(error => {
                        console.log("Echec d'authentification")
                        //toastComponent.successMessages("Authentification réussi")
                        reject(error);
                    });
                    close();
                }
                }
            });
            open();
            
        });
    },
    
    methods: {
    },
}
</script>