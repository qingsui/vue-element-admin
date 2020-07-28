<template>
  <div class="container">
    <el-button @click="change">observable</el-button>
    <div>{{ authed }}
      <div v-html="changeHtml()" />
    </div>
    <error-page />
  </div>
</template>

<script>
import Vue from 'vue'
import errorPage from '../error-page/401'

const state = Vue.observable({ auth: true })
const mutation = {
  setAuth(val) {
    state.auth = val
  }
}
export default {
  components: { errorPage },
  data() {
    return {
      authed: state.auth,
      html: this.changeHtml()
    }
  },
  computed: {
    auth() {
      return state.auth
    }
  },
  mounted() {
    console.log(errorPage)
  },
  methods: {
    change() {
      this.authed = !this.authed
      mutation.setAuth(this.authed)
    },
    changeHtml() {
      if (!state.auth) {
        return `
          <div class="hello">hello world</div>
        `
      } else {
        return `
        <div class="hello">
          <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=611041968,544429965&fm=11&gp=0.jpg"/>
          <error-page class="error"/>
        </div>
        `
      }
    }
  }
}
</script>

<style lang="scss">
.hello{
  &:hover{
    cursor: pointer;
  }
}
</style>
