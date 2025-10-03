import {ref, watch} from "vue";

export function useLocalStorage<T>(key: string, initialValue: T) {
    const storedValue = ref<T>(initialValue)

    try {
        const raw = localStorage.getItem(key)
        if (raw !== null) {
            storedValue.value = JSON.parse(raw) as T;
        }
    } catch (e) {
        console.error('Не удалось загрузить данные из LocalStorage: ', e)
    }

    watch(storedValue, (value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            console.error('Не удалось сохранить данные в LocalStorage: ', e)
        }
    }, { deep: true})

    return storedValue;
}