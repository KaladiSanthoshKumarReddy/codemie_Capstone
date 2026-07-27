/* eslint-disable @typescript-eslint/no-explicit-any */

// Use vitest global APIs (configured via vitest.config.ts -> test.globals)
const { describe, it, expect, beforeEach } = globalThis as any

import { useAuthStore } from '../authStore'

// Vitest can throw "failed to find the runner" in certain monorepo/CWD setups.
// Using the global test APIs avoids importing the runner module directly.

const TOKEN_KEY = 'capstone_token'
const EMAIL_KEY = 'capstone_email'

// Reset store state and localStorage before every test so tests are isolated.
beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({ token: null, email: null })
})

// ---------------------------------------------------------------------------
// setAuth
// ---------------------------------------------------------------------------
describe('setAuth', () => {
  it('updates the store token', () => {
    useAuthStore.getState().setAuth('jwt-abc', 'user@example.com')
    expect(useAuthStore.getState().token).toBe('jwt-abc')
  })

  it('updates the store email', () => {
    useAuthStore.getState().setAuth('jwt-abc', 'user@example.com')
    expect(useAuthStore.getState().email).toBe('user@example.com')
  })

  it('persists token to localStorage', () => {
    useAuthStore.getState().setAuth('my-token', 'persist@test.com')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('my-token')
  })

  it('persists email to localStorage', () => {
    useAuthStore.getState().setAuth('my-token', 'persist@test.com')
    expect(localStorage.getItem(EMAIL_KEY)).toBe('persist@test.com')
  })

  it('overwrites an existing token in localStorage', () => {
    localStorage.setItem(TOKEN_KEY, 'old-token')
    useAuthStore.getState().setAuth('new-token', 'user@example.com')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('new-token')
  })
})

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------
describe('logout', () => {
  it('clears token from store state', () => {
    useAuthStore.getState().setAuth('token-to-clear', 'clear@test.com')
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().token).toBeNull()
  })

  it('clears email from store state', () => {
    useAuthStore.getState().setAuth('token-to-clear', 'clear@test.com')
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().email).toBeNull()
  })

  it('removes token from localStorage', () => {
    localStorage.setItem(TOKEN_KEY, 'some-token')
    useAuthStore.getState().logout()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('removes email from localStorage', () => {
    localStorage.setItem(EMAIL_KEY, 'some@email.com')
    useAuthStore.getState().logout()
    expect(localStorage.getItem(EMAIL_KEY)).toBeNull()
  })

  it('is idempotent — calling logout twice does not throw', () => {
    useAuthStore.getState().logout()
    expect(() => useAuthStore.getState().logout()).not.toThrow()
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().email).toBeNull()
  })
})
