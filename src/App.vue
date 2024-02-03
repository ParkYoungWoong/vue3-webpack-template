<script setup lang="ts">
import { ref } from 'vue';
import { addOne } from '@/utils';

const num = ref(0);

const clickEv = () => {
    num.value = addOne(num.value);
};
</script>

<template>
    <div class="hello">
        <p class="hello-world">{{ num }}</p>
        <button
            class="hello-btn"
            type="button"
            @click="clickEv"
        >
            Click!
        </button>
    </div>
</template>

<style scoped lang="scss">
.hello {
    display: flex;
}
</style>
