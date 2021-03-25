<template>
  <h2 @click="$emit('click')">
    {{ msg }}
  </h2> 
  <img
    src="~assets/logo.png" 
    alt="HEROPY" />
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  emits: ['click']
}
</script>

<style scoped lang="scss">
  h2 {
    font-size: 22px;
    & + img {
      width: 120px;
    }
  }
</style>