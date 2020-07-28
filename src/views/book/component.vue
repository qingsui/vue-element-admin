<template>
  <div class="container">
    <input @keyup.enter="out">
    <el-button v-for="(item, i) in tabs" :key="i" @click="current=item">{{ item }}</el-button>
    <component :is="current" />
  </div>
</template>

<script>
import create from './create'
import error1 from '../error-page/401'
export default {
  components: { create, error1 },
  data() {
    return {
      tabs: ['create', 'error1'],
      current: 'create'
    }
  },
  methods: {
    out(event) {
      console.log(event.target.value)
    }
  }
}
</script>

<style lang="scss">
</style>
