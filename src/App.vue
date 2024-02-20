<script setup lang="ts">
import { useImmerVue as useImmer } from '@/hooks';

const [obj, updateObj] = useImmer({
    num: 1,
    state: false,
});

// update object with immer
const takeUpdating = () => {
    updateObj(draft => {
        const { state: oldState } = draft;
        draft.num++;
        draft.state = !oldState;
    });
};
</script>

<template>
    <div class="hello">
        <p class="hello-world">{{ obj.num }}</p>
        <p class="hello-world">{{ obj.state }}</p>
        <button
            type="button"
            @click="takeUpdating"
        >
            Up!
        </button>
    </div>
</template>

<style scoped lang="scss">
.hello {
    &-world {
        margin-bottom: 1em;
        color: $element-blue;
    }
}
</style>
