import type { Page } from '@playwright/test'

const TOKEN_KEY = 'capstone_token'
const EMAIL_KEY = 'capstone_email'

export async function registerUser(page: Page, email: string, password: string) {
  await page.request.post('http://localhost:4000/api/auth/register', {
    data: { email, password },
  })
  // 201 on first call, 409 (already exists) on subsequent â€” both are fine
}

export async function loginViaApi(page: Page, email: string, password: string) {
  const res  = await page.request.post('http://localhost:4000/api/auth/login', {
    data: { email, password },
  })
  const body = await res.json()
  // Navigate to the app origin so we can write to its localStorage
  await page.goto('/login')
  await page.evaluate(
    ({ token, em, tokenKey, emailKey }) => {
      localStorage.setItem(tokenKey, token)
      localStorage.setItem(emailKey, em)
    },
    { token: body.data.token, em: body.data.email, tokenKey: TOKEN_KEY, emailKey: EMAIL_KEY },
  )
}

export async function clearAuth(page: Page) {
  await page.evaluate(
    ({ tokenKey, emailKey }) => {
      localStorage.removeItem(tokenKey)
      localStorage.removeItem(emailKey)
    },
    { tokenKey: TOKEN_KEY, emailKey: EMAIL_KEY },
  )
}

// ---------------------------------------------------------------------------
// E2E cleanup helpers — call from afterAll hooks to remove test data
// ---------------------------------------------------------------------------
const DEBUG_BASE = 'http://localhost:4000'

/** Delete one test user (and all their items) by exact email address. */
export async function deleteUserByEmail(
  request: import('@playwright/test').APIRequestContext,
  email: string,
): Promise<void> {
  await request.delete(`${DEBUG_BASE}/api/debug/users/${encodeURIComponent(email)}`)
}

/**
 * Bulk-delete all test users whose email matches a SQL LIKE pattern plus their items.
 * Use a narrow pattern (e.g. 'register_e2e_%@capstone.dev') to avoid touching other suites.
 */
export async function cleanupTestUsersByPattern(
  request: import('@playwright/test').APIRequestContext,
  like: string,
): Promise<void> {
  await request.delete(`${DEBUG_BASE}/api/debug/cleanup`, { data: { like } })
}
