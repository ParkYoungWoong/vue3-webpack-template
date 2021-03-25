<template>
  <!-- Remove & use example component! -->
  <HelloWorld 
    :msg="message" 
    @click="handler" />
  <HelloWorld msg="Good" />
</template>

<script>
import HelloWorld from '~/components/HelloWorld'

export default {
  components: {
    HelloWorld
  },
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  methods: {
    handler() {
      console.log(this.message)
      this.message += '!'
    }
  }
}
</script>