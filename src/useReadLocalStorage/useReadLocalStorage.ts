import { $, Observable, useEffect } from 'woby'

import { useEventListener } from '../useEventListener/useEventListener'
import { localStoreDic } from '../useLocalStorage/useLocalStorage'

type Value<T> = T | null


export function useReadLocalStorage<T>(key: string): Observable<T> {
    if (localStoreDic[key])
        return localStoreDic[key] as any

    // Get from local storage then
    // parse stored json or return initialValue
    const readValue = (): Value<T> => {
        // Prevent build error "window is undefined" but keep keep working
        if (typeof window === 'undefined') {
            return null
        }

        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : null
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error)
            return null
        }
    }

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const storedValue = $<Value<T>>(readValue())

    localStoreDic[key] = storedValue as any

    // Listen if localStorage changes
    useEffect(() => {
        storedValue(readValue())
    })

    const handleStorageChange = ((event: StorageEvent | CustomEvent) => {
        if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
            return
        }
        storedValue(readValue())
    })

    // this only works for other documents, not the current one
    useEventListener(window, 'storage', handleStorageChange)

    // this is a custom event, triggered in writeValueToLocalStorage
    // See: useLocalStorage()
    useEventListener(window, 'local-storage', handleStorageChange)

    return storedValue
}

