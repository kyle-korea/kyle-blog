import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToggleStore = defineStore('toggle', () => {
    const toggleDarKMode = ref(false)
    return { toggleDarKMode }
})
