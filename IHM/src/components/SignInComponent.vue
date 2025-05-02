<script setup>

</script>

<template>
<h1> Sign In </h1>

  <form>
    <input type="text" placeholder="Email" />
    <input type="password" placeholder="Password" />
    <button>Sign In</button>
  </form>

  <p>Don't have an account? <router-link to="/signup">Sign Up</router-link></p>

  <p>Forgot your password? <router-link to="/reset-password">Reset Password</router-link></p>

  <p>Or sign in with:</p>

  <button>Google</button>
  <button>Facebook</button>
  <button>Twitter</button>
  <button>GitHub</button>

  <p>By signing in, you agree to our <router-link to="/terms">Terms of Service</router-link> and <router-link to="/privacy">Privacy Policy</router-link>.</p>

  <p>Need help? <router-link to="/contact">Contact Support</router-link></p>

  <p>© 2021 Company, Inc.</p>
</template>

<style scoped>

</style>