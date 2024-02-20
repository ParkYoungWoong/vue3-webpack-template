import { shallowRef, shallowReadonly, type ShallowRef } from 'vue';
import { produce, freeze } from 'immer';

type UpdateFunc<T = unknown> = (draft: T) => void;

/**
 * @description A vue hook for immer
 * @param val value to be transferred to immutable
 * @returns An array whose first element is the immutable state, and the second one is an updater function.
 */
const useImmerVue = <T = unknown>(val: T | (() => T)) => {
    const realVal: T = typeof val === 'function' ? (val as () => T)() : val;

    // trans the real value to the immutable one
    const tmp = shallowRef(freeze<T>(realVal, true));

    // updater
    const updateFunc = (updater: T | UpdateFunc<T>): void => {
        if (typeof updater === 'function') {
            tmp.value = produce(tmp.value, updater as UpdateFunc<T>);
        } else {
            tmp.value = shallowRef<T>(freeze(updater as T, true));
        }
    };

    return [shallowReadonly(tmp), updateFunc] as [ReturnType<typeof shallowReadonly<ShallowRef<T>>>, typeof updateFunc];
};

export default useImmerVue;
