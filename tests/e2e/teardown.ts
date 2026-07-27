import { request } from '@playwright/test'

/**
 * Global teardown — runs exactly once after all workers and all tests complete.
 *
 * Deletes every test user whose email matches the '@capstone.dev' domain
 * together with all of their items.  This covers every static and dynamic
 * user email pattern created by the E2E suite:
 *   - login_e2e@capstone.dev          (login.spec.ts)
 *   - dash_e2e@capstone.dev           (dashboard.spec.ts)
 *   - items_test@capstone.dev         (items.spec.ts)
 *   - register_e2e_<timestamp>@capstone.dev  (register.spec.ts)
 *
 * Running cleanup here (not in per-test afterAll hooks) is intentional:
 * with fullyParallel: true each test runs in its own worker, so a per-file
 * afterAll fires in each worker independently and can delete shared users
 * while another worker's test is still mid-flight.  A single globalTeardown
 * has no such race condition.
 */
export default async function globalTeardown() {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:4000'
  let apiCtx: Awaited<ReturnType<typeof request.newContext>> | null = null
  try {
    apiCtx = await request.newContext({ baseURL: backendUrl })
    const res = await apiCtx.delete('/api/debug/cleanup')
    const body = await res.json().catch(() => ({}))
    console.log(
      `[teardown] Cleaned up test users: ${(body as { deleted?: number }).deleted ?? 'unknown'} user(s) removed`,
    )
  } catch (err) {
    // Non-fatal: the backend may already be stopped in some CI configurations.
    console.warn('[teardown] Could not reach backend for cleanup:', (err as Error).message)
  } finally {
    await apiCtx?.dispose()
  }
}
