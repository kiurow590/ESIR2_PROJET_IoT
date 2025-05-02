<script setup>
import configJson from "../../config.json";
import {toastComponent} from "@/components/toast/toastComponent";

const loginData = {
  password: ''
};

const signupData = {
  password: '',
  confirmPassword: ''
};
const connexion = password => {
  if (!password) {
    alert('Please fill in all fields');
    return;
  }
  console.log('Logging in...');
  // get information on the form
  console.log(password);
};

const signup = (pass1, pass2) => {
  if (!pass1 || !pass2) {
    alert('Please fill in all fields');
    return;
  }
  
  console.log('Signing up...');
  // get information on the form
  console.log(configJson.URL);

  fetch("http://"+configJson.URL+":"+configJson.PORT+"/askPermission/"+pass1)
  .then(response => response.json())
  .then(data => {
    console.log("cc")
    if(data == "true"){
      fetch("http://"+configJson.URL+":"+configJson.PORT+"/changePassword/"+pass2)
      .then(response => response.json())
      .then(data => {
        toastComponent.successMessages("Succes de la modification")
      })
    }else{
      console.log("Echec d'authentification")
      toastComponent.errorMessages("Echec de l'operation")
      
    }
                        
    //Si le code est bon alors
    //toastComponent.successMessages("Authentification réussi")
    
  })
  .catch(error => {
    console.log("Echec d'authentification")
    toastComponent.errorMessages("Echec de l'operation")
    //toastComponent.successMessages("Authentification réussi")
    
  });
};
</script>


<template>
  <main>
    <!--    <h1> Login Page </h1>-->


    <div class="log-section">

      <div v-if="showSignUp" class="formSignIn">
        <h2>Changer le mot de passe Admin</h2>
        <form class="flip-card__form" action="">
          <input required class="input_form" name="password" placeholder="Password" type="password"
                 v-model="loginData.password">
          <button class="button" type="button" @click="connexion(
            loginData.password
          )">Connexion
          </button>
          <!--<input type="checkbox" v-model="showSignUp">
          <label>Have an Account ?</label>-->
        </form>


      </div>

      <div v-else class="formLogIn">
        <h2>Changer le mot de passe Admin</h2>
        <form class="flip-card__form" action="">
          <input class="input_form" name="password" placeholder="Enter actual password" type="password" required
                 v-model="signupData.password">
          <input class="input_form" name="password" placeholder="Enter your new password" type="password"
                 required v-model="signupData.confirmPassword">
          <button class="button" type="button"
                  @click="signup(signupData.password,signupData.confirmPassword)">Confirmer
          </button>
          <!--<input type="checkbox" v-model="showSignUp">
          <label>Have an Account ?</label>-->
        </form>
      </div>


    </div>


    <!--    <div class="wrapper">-->
    <!--      <div class="card-switch">-->
    <!--        <label class="switch">-->
    <!--          <input type="checkbox" class="toggle">-->
    <!--          <span class="slider"></span>-->
    <!--          <span class="card-side"></span>-->
    <!--          <div class="flip-card__inner">-->
    <!--            <div class="flip-card__front">-->
    <!--              <div class="title">Log in</div>-->
    <!--              <form class="flip-card__form" action="">-->
    <!--                <input class="input_form" name="Name" placeholder="Name" type="name" required>-->
    <!--                <input class="input_form" name="password" placeholder="Password" type="password" required>-->
    <!--                <button class="button">Connexion</button>-->
    <!--              </form>-->
    <!--            </div>-->
    <!--            <div class="flip-card__back">-->
    <!--              <div class="title">Sign up</div>-->
    <!--              <form class="flip-card__form" action="">-->
    <!--                <input class="input_form" placeholder="Name" type="name" required>-->
    <!--                <input class="input_form" name="password" placeholder="Password" type="password" required>-->
    <!--                <input class="input_form" name="password" placeholder="Enter Again your password" type="password" required>-->
    <!--                <button class="button">Confirme</button>-->
    <!--              </form>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </label>-->
    <!--      </div>-->
    <!--    </div>-->


  </main>

</template>

<script>

export default {
  data() {
    return {
      showSignUp: false,
      loginData: {
        username: '',
        password: ''
      },
      signupData: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    login() {
      // Handle login functionality
      console.log('Logging in...');
    },
    signup() {
      // Handle sign-up functionality
      console.log('Signing');
      //console.log('cc')
    }
  }
}

</script>

<style scoped>

.title {
  margin: 20px 0 20px 0;
  font-size: 25px;
  font-weight: 900;
  text-align: center;
  color: var(--main-color);
}


/*------------------ FORM --------------------*/


.log-section { /* on affiche les deux formulaires cote à cote en colonne*/
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0 1rem 0;

  .formSignIn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .formLogIn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .flip-card__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .input_form {
    width: 12.5rem;
    height: 2rem;
    border-radius: 0.25rem;
    /*border: 2px solid var(--main-color);*/
    background-color: var(--bg-color);
    box-shadow: 0.2rem 0.2rem var(--main-color);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--font-color);
    padding: 0.2rem 0.5rem;
    outline: none;
  }


}

/*------------------ BUTTON --------------------*/

.button {
  position: relative;
  padding: 10px 22px;
  border-radius: 6px;
  border: none;
  color: #fff;
  cursor: pointer;
  background-color: #44475c;
  transition: all 0.2s ease;
  font-family: 'Fira sans', sans-serif;

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

/*------------------ SLIDER --------------------*/

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #b1b9c3;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 30px;
  width: 30px;
  bottom: -5px;
  background: #18333E;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #b1b9c3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(35px);
  -ms-transform: translateX(35px);
  transform: translateX(35px);
  background: #F2F8FD;
}


</style>

<!--<style scoped>
.wrapper {
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --bg-color-alt: #666;
  --main-color: #323232;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 15rem;
}

/* switch card */
.switch {
  transform: translateY(-200px);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  width: 50px;
  height: 20px;
}

.card-side::before {
  position: absolute;
  content: 'Log in';
  left: -70px;
  top: 0;
  width: 100px;
  text-decoration: underline;
  color: var(--font-color);
  font-weight: 600;
}

.card-side::after {
  position: absolute;
  content: 'Sign up';
  left: 70px;
  top: 0;
  width: 100px;
  text-decoration: none;
  color: var(--font-color);
  font-weight: 600;
}

.toggle {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  box-sizing: border-box;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-colorcolor);
  transition: 0.3s;
}

.slider:before {
  box-sizing: border-box;
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  border: 2px solid var(--main-color);
  border-radius: 5px;
  left: -2px;
  bottom: 2px;
  background-color: var(--bg-color);
  box-shadow: 0 3px 0 var(--main-color);
  transition: 0.3s;
}

.toggle:checked + .slider {
  background-color: var(--input-focus);
}

.toggle:checked + .slider:before {
  transform: translateX(30px);
}

.toggle:checked ~ .card-side:before {
  text-decoration: none;
}

.toggle:checked ~ .card-side:after {
  text-decoration: underline;
}

/* card */

.flip-card__inner {
  width: 300px;
  height: 350px;
  position: relative;
  background-color: transparent;
  perspective: 1000px;
  /* width: 100%;
  height: 100%; */
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.toggle:checked ~ .flip-card__inner {
  transform: rotateY(180deg);
}

.toggle:checked ~ .flip-card__front {
  box-shadow: none;
}

.flip-card__front, .flip-card__back {
  padding: 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  background: lightgrey;
  gap: 20px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
}

.flip-card__back {
  width: 100%;
  transform: rotateY(180deg);
}

.flip-card__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.title {
  margin: 20px 0 20px 0;
  font-size: 25px;
  font-weight: 900;
  text-align: center;
  color: var(--main-color);
}

.input_form {
  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
}

.input_form::placeholder {
  color: var(--font-color-sub);
  opacity: 0.8;
}

.input_form:focus {
  border: 2px solid var(--input-focus);
}

.flip-card__btn:active, .button-confirm:active {
  box-shadow: 0px 0px var(--main-color);
  transform: translate(3px, 3px);
}

.flip-card__btn {
  margin: 20px 0 20px 0;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
}
</style>-->


