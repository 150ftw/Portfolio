/**
 * View Transitions API Hook
 *
 * A bleeding-edge browser API (2024) that almost nobody uses yet.
 * Provides smooth cross-fade animations between DOM state changes.
 *
 * Used by: Chrome team, cutting-edge SPAs
 * Spec: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */
import { useCallback } from 'react'

export default function useViewTransition() {
    /**
     * Wraps a DOM-mutating callback in a View Transition.
     * Falls back to immediate execution if the API isn't supported.
     *
     * Usage:
     *   const transition = useViewTransition()
     *   transition(() => setState(newValue))
     */
    const startTransition = useCallback((updateCallback) => {
        // Check for View Transitions API support
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                updateCallback()
            })
        } else {
            // Graceful fallback — just run the update
            updateCallback()
        }
    }, [])

    /**
     * Cross-fades between two elements by toggling a class.
     * Automatically applies view-transition-name for morphing.
     */
    const morphTransition = useCallback((element, transitionName, updateCallback) => {
        if (!element) return updateCallback()

        element.style.viewTransitionName = transitionName

        if (document.startViewTransition) {
            const transition = document.startViewTransition(() => {
                updateCallback()
            })

            transition.finished.then(() => {
                element.style.viewTransitionName = ''
            })
        } else {
            updateCallback()
        }
    }, [])

    return { startTransition, morphTransition }
}
