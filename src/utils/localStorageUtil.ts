import { createSignal, onMount } from "solid-js";

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = createSignal<T>(initialValue);

    onMount(() => {
        const stored = localStorage.getItem(key);
        if (stored) setValue(JSON.parse(stored));
    });

    const update = (newValue: T) => {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    };

    return [value, update] as const;
}
