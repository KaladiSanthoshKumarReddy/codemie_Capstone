import { vi } from 'vitest'

// JSDOM stubs for API/client.ts response interceptor
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
})

// Minimal localStorage stub (jsdom has it, but keep tests resilient)
if (!('localStorage' in window)) {
  const store = new Map<string, string>()
  // @ts-expect-error - provide minimal stub for tests
  window.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v) },
    removeItem: (k: string) => { store.delete(k) },
    clear: () => { store.clear() },
  }
}

// Ensure no tests accidentally navigate away.
vi.spyOn(window.location, 'href', 'set')
